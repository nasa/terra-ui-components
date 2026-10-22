import TileLayer from 'ol/layer/Tile.js'
import type VectorTileLayer from 'ol/layer/VectorTile.js'
import WMTS, { optionsFromCapabilities } from 'ol/source/WMTS.js'
import WMTSCapabilities from 'ol/format/WMTSCapabilities.js'
import { transformExtent } from 'ol/proj.js'
import type { Extent } from 'ol/extent.js'
import { XYZLayer } from './xyz.layer.js'
import { buildGibsVectorLayer, type VectorOptions } from './gibs-vector.layer.js'
import type { CommonConfig } from './common.js'
import '../projections.js' // registers EPSG:3413/3031 with OpenLayers

export type Projection = 'EPSG:3857' | 'EPSG:4326' | 'EPSG:3413' | 'EPSG:3031'

const GIBS_WMTS_ROOT = 'https://gibs.earthdata.nasa.gov/wmts'

const WMTS_NS = 'http://www.opengis.net/wmts/1.0'
const OWS_NS = 'http://www.opengis.net/ows/1.1'
const XLINK_NS = 'http://www.w3.org/1999/xlink'

type CapabilitiesEntry = {
    /** The ol-parsed capabilities object, as returned by `getGibsCapabilities()`. */
    capabilities: any
    /** The raw parsed XML, kept around for lookups ol's parser doesn't expose (e.g. legend orientation). */
    doc: Document
}

const capabilitiesCache = new Map<string, Promise<CapabilitiesEntry>>()

function fetchGibsCapabilities(projection: Projection): Promise<CapabilitiesEntry> {
    const endpoint = projection.replace(':', '').toLowerCase() // e.g. 'epsg4326'

    let cached = capabilitiesCache.get(endpoint)
    if (!cached) {
        cached = fetch(
            `${GIBS_WMTS_ROOT}/${endpoint}/best/wmts.cgi?REQUEST=GetCapabilities`
        )
            .then(response => {
                if (!response.ok) {
                    throw new Error(
                        `Failed to fetch GIBS GetCapabilities for ${projection}: ${response.status} ${response.statusText}`
                    )
                }
                return response.text()
            })
            .then(xml => {
                const doc = new DOMParser().parseFromString(xml, 'application/xml')
                return { capabilities: new WMTSCapabilities().read(doc), doc }
            })
            .catch(error => {
                // don't cache failures, so a transient network error can be retried
                capabilitiesCache.delete(endpoint)
                throw error
            })

        capabilitiesCache.set(endpoint, cached)
    }

    return cached
}

/**
 * Fetches and parses a GIBS projection's WMTS GetCapabilities document,
 * caching the result (per projection) so repeated GibsLayer.forProjection()
 * calls don't refetch the (large) capabilities document every time.
 */
export function getGibsCapabilities(projection: Projection): Promise<any> {
    return fetchGibsCapabilities(projection).then(entry => entry.capabilities)
}

export type GibsLegendUrls = {
    /** Wide color map legend image, suitable for rendering below/above the map. */
    horizontal?: string
    /** Tall color map legend image, suitable for rendering beside the map. */
    vertical?: string
}

/**
 * Looks up a GIBS layer's color map legend image URLs (both orientations
 * GIBS publishes, keyed by their `xlink:role`) from a projection's
 * GetCapabilities document.
 *
 * ol's `WMTSCapabilities` parser reads `Style`/`LegendURL` elements, but
 * drops the `xlink:role` attribute that distinguishes the horizontal from
 * the vertical legend image - so this reads the raw parsed XML directly
 * instead of the ol-parsed capabilities object.
 */
export async function getGibsLegendUrls(
    projection: Projection,
    layer: string
): Promise<GibsLegendUrls | undefined> {
    const { doc } = await fetchGibsCapabilities(projection)

    const layerNode = Array.from(doc.getElementsByTagNameNS(WMTS_NS, 'Layer')).find(
        node =>
            node.getElementsByTagNameNS(OWS_NS, 'Identifier')[0]?.textContent ===
            layer
    )
    if (!layerNode) {
        return undefined
    }

    const styleNodes = Array.from(layerNode.getElementsByTagNameNS(WMTS_NS, 'Style'))
    const styleNode =
        styleNodes.find(node => node.getAttribute('isDefault') === 'true') ??
        styleNodes[0]
    if (!styleNode) {
        return undefined
    }

    const legends: GibsLegendUrls = {}
    for (const legendNode of Array.from(
        styleNode.getElementsByTagNameNS(WMTS_NS, 'LegendURL')
    )) {
        const href = legendNode.getAttributeNS(XLINK_NS, 'href')
        const role = legendNode.getAttributeNS(XLINK_NS, 'role') ?? ''
        if (!href) {
            continue
        }
        if (role.endsWith('horizontal')) {
            legends.horizontal = href
        } else if (role.endsWith('vertical')) {
            legends.vertical = href
        }
    }

    return Object.keys(legends).length ? legends : undefined
}

export type Options = {
    /** GIBS layer identifier, e.g. 'MODIS_Terra_CorrectedReflectance_TrueColor'. */
    layer: string
    /** ISO date (YYYY-MM-DD) or 'default' for the layer's latest available date. */
    date?: string
    /**
     * GIBS TileMatrixSet, e.g. 'GoogleMapsCompatible_Level9'. Only used by the
     * EPSG:3857 constructor; ignored by forProjection(), which reads the
     * available matrix sets from GetCapabilities.
     */
    tileMatrixSet?: string
    /** Tile image format extension. Defaults to 'jpg'. */
    format?: 'jpg' | 'png'
    noWorldWrap?: boolean
    /** Bounding box [west, south, east, north] in EPSG:4326 to clip rendering to. */
    extent?: Extent
    /**
     * Shown automatically whenever `extent` is set - set to `false` to
     * suppress the boundary outline. Not consumed by `GibsLayer` itself -
     * it's read by `<terra-map>`'s `layers` diffing to pass through to
     * `addLayer()`'s `showBoundary`/`boundaryColorIndex` options.
     */
    showBoundary?: boolean
    /** Palette index (cycled mod 5) for the outline color. Defaults to 0. */
    boundaryColorIndex?: number
}

const DEFAULT_MATRIX_SET_BY_PROJECTION: Record<
    Exclude<Projection, 'EPSG:3857'>,
    string
> = {
    'EPSG:4326': '2km',
    'EPSG:3413': '1km',
    'EPSG:3031': '1km',
}

/**
 * A tile layer for NASA GIBS (Global Imagery Browse Services) imagery.
 *
 * `new GibsLayer(options)` requests EPSG:3857 (Web Mercator) imagery via
 * GIBS' RESTful-WMTS-as-XYZ URL pattern - fast, synchronous, no network
 * call required to construct the layer.
 *
 * For imagery only published in EPSG:4326 (Geographic) or the polar
 * projections (EPSG:3413 Arctic / EPSG:3031 Antarctic), use the async
 * `GibsLayer.forProjection()` factory, which fetches that projection's
 * GetCapabilities document and builds a proper ol/source/WMTS from it
 * (polar/geographic tile grids aren't a simple global XYZ scheme, so
 * they can't be hand-built from a URL template the way EPSG:3857 can).
 */
export class GibsLayer extends XYZLayer {
    constructor(options: Options) {
        const {
            layer,
            date = 'default',
            tileMatrixSet = 'GoogleMapsCompatible_Level9',
            format = 'jpg',
            noWorldWrap,
            extent,
        } = options

        const urlTemplate = `${GIBS_WMTS_ROOT}/epsg3857/best/${layer}/default/${date}/${tileMatrixSet}/{z}/{y}/{x}.${format}`

        super({
            urlTemplate,
            attributions: ['NASA EOSDIS GIBS'],
            noWorldWrap,
            extent,
            extentProjection: 'EPSG:4326',
        })

        if (extent) {
            this.set('sourceExtent', extent)
        }
    }

    /**
     * Async factory for non-Mercator GIBS imagery (EPSG:4326 / EPSG:3413 / EPSG:3031).
     */
    static async forProjection(
        options: Options & { projection: Exclude<Projection, 'EPSG:3857'> }
    ): Promise<TileLayer> {
        const { layer, date = 'default', projection, tileMatrixSet, extent } = options

        const capabilities = await getGibsCapabilities(projection)
        const wmtsOptions = optionsFromCapabilities(capabilities, {
            layer,
            matrixSet: tileMatrixSet ?? DEFAULT_MATRIX_SET_BY_PROJECTION[projection],
        })

        if (!wmtsOptions) {
            throw new Error(
                `GIBS layer "${layer}" was not found, or isn't available in ${projection}`
            )
        }

        const source = new WMTS({ ...wmtsOptions, dimensions: { Time: date } })

        const tileLayer = new TileLayer({
            source,
            ...(extent
                ? { extent: transformExtent(extent, 'EPSG:4326', projection) }
                : {}),
        })

        if (extent) {
            tileLayer.set('sourceExtent', extent)
        }

        return tileLayer
    }
}

export type GibsLayerConfig =
    | (Options & CommonConfig & { type: 'gibs'; projection?: Projection })
    | (VectorOptions & CommonConfig & { type: 'gibs-vector' })

export type GibsLayerInfo = {
    layer: TileLayer | VectorTileLayer
    /**
     * The layer's color map legend image URLs (horizontal/vertical), if GIBS
     * publishes one, read from the layer's GetCapabilities `Style`. Not
     * awaited before the layer itself is built/added to the map - fetching
     * it here is a best-effort lookup off a (possibly already-cached)
     * capabilities document, not a blocking network call.
     */
    legend: Promise<GibsLegendUrls | undefined>
}

/**
 * Builds a layer from a `GibsLayerConfig`, dispatching to:
 * - `buildGibsVectorLayer()` when `type: 'gibs-vector'` is given
 * - the sync `GibsLayer` constructor for EPSG:3857 raster imagery (or no projection given)
 * - the async `GibsLayer.forProjection()` factory for EPSG:4326/3413/3031 raster imagery
 */
export async function buildGibsLayer(
    config: GibsLayerConfig
): Promise<GibsLayerInfo> {
    const { name, position, ...options } = config

    if (options.type === 'gibs-vector') {
        const { type, ...vectorOptions } = options
        const layer = await buildGibsVectorLayer(vectorOptions)
        return { layer, legend: Promise.resolve(undefined) }
    }

    const { type, projection, ...rasterOptions } = options
    const legend = getGibsLegendUrls(
        projection ?? 'EPSG:3857',
        rasterOptions.layer
    ).catch(() => undefined)

    if (!projection || projection === 'EPSG:3857') {
        return { layer: new GibsLayer(rasterOptions), legend }
    }

    const layer = await GibsLayer.forProjection({
        ...rasterOptions,
        projection,
    })
    return { layer, legend }
}
