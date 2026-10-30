import type { Extent } from 'ol/extent.js'
import WMTSCapabilities from 'ol/format/WMTSCapabilities.js'
import TileLayer from 'ol/layer/Tile.js'
import type VectorTileLayer from 'ol/layer/VectorTile.js'
import { transformExtent } from 'ol/proj.js'
import WMTS, { optionsFromCapabilities } from 'ol/source/WMTS.js'
import { GIBS_WMTS_ENDPOINT, type Projection } from '../../../apis/gibs.api.js'
import { sharedQueryClient } from '../../../mixins/query-client.mixin.js'
import { queryGibsCapabilitiesXml } from '../../../queries/gibs.queries.js'
import type { CommonConfig } from './common.js'
import { buildGibsVectorLayer, type VectorOptions } from './gibs-vector.layer.js'
import { XYZLayer } from './xyz.layer.js'
import '../projections.js' // registers EPSG:3413/3031 with OpenLayers

export type { Projection }

const WMTS_NS = 'http://www.opengis.net/wmts/1.0'
const OWS_NS = 'http://www.opengis.net/ows/1.1'
const XLINK_NS = 'http://www.w3.org/1999/xlink'

export type GibsLegendUrls = {
    /** Wide color map legend image, suitable for rendering below/above the map. */
    horizontal?: string
    /** Tall color map legend image, suitable for rendering beside the map. */
    vertical?: string
}

type CapabilitiesEntry = {
    /**
     * The OpenLayers-parsed capabilities object, as returned by `getGibsCapabilities()`.
     * Evaluated lazily on first access because `EPSG:3857` layers build their tile URLs
     * synchronously via XYZ templates and only need the capabilities XML for legend URLs;
     * running `WMTSCapabilities.read()` on the 1,300+ layer XML document adds unnecessary
     * main-thread work when WMTS tile matrix options aren't needed.
     */
    capabilities: any
    /**
     * Pre-indexed map of WMTS layer identifier -> horizontal/vertical legend URLs.
     * Built in a single pass over the XML DOM on first access so multi-layer collections
     * (e.g. `AIRS2RET_NRT_7.0` with 22 layers) perform O(1) lookups instead of walking
     * the 1,300+ `<Layer>` DOM nodes repeatedly.
     */
    legends: Map<string, GibsLegendUrls>
}

const capabilitiesCache = new Map<string, Promise<CapabilitiesEntry>>()

/**
 * Extracts every layer's default `<Style>` horizontal/vertical `<LegendURL>` entries
 * from a parsed GIBS WMTS `GetCapabilities` XML document in a single pass.
 *
 * Why `GetCapabilities` is required instead of constructing legend URLs from the layer ID:
 * GIBS legend SVG filenames are keyed by shared GIBS ColorMap IDs (~413 unique files across
 * ~1,100 layers), not by the WMTS layer `Identifier`. Over 77% of layers use a legend
 * filename that differs non-deterministically from the layer ID (e.g.
 * `AIRS_L2_Surface_Air_Temperature_Day` -> `AIRS_Temperature_H.svg`,
 * `MODIS_Aqua_Aerosol_Optical_Depth_3km` -> `MODIS_VIIRS_AOD_H.svg`), and neither GIBS
 * nor CMR's `edsc.extra.serverless.gibs` tags expose a per-layer metadata endpoint for
 * legend URLs. Guessing filenames via HTTP probing floods the browser with 404 errors.
 *
 * Why this reads the raw XML DOM instead of OpenLayers' `WMTSCapabilities` output:
 * `ol/format/WMTSCapabilities` parses `Style`/`LegendURL` elements, but drops the
 * `xlink:role` attribute that distinguishes the horizontal from the vertical legend.
 */
function indexGibsLegends(doc: Document): Map<string, GibsLegendUrls> {
    const legendsByLayer = new Map<string, GibsLegendUrls>()

    for (const layerNode of Array.from(
        doc.getElementsByTagNameNS(WMTS_NS, 'Layer')
    )) {
        const id = layerNode.getElementsByTagNameNS(OWS_NS, 'Identifier')[0]
            ?.textContent
        if (!id) {
            continue
        }

        const styleNodes = Array.from(
            layerNode.getElementsByTagNameNS(WMTS_NS, 'Style')
        )
        const styleNode =
            styleNodes.find(node => node.getAttribute('isDefault') === 'true') ??
            styleNodes[0]
        if (!styleNode) {
            continue
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

        if (legends.horizontal || legends.vertical) {
            legendsByLayer.set(id, legends)
        }
    }

    return legendsByLayer
}

function fetchGibsCapabilities(projection: Projection): Promise<CapabilitiesEntry> {
    const endpoint = projection.replace(':', '').toLowerCase() // e.g. 'epsg4326'

    let cached = capabilitiesCache.get(endpoint)
    if (!cached) {
        cached = sharedQueryClient
            .query(queryGibsCapabilitiesXml(projection))
            .then(xml => {
                const doc = new DOMParser().parseFromString(xml, 'application/xml')
                let parsedCapabilities: any
                let indexedLegends: Map<string, GibsLegendUrls> | undefined
                return {
                    get capabilities() {
                        if (!parsedCapabilities) {
                            parsedCapabilities = new WMTSCapabilities().read(doc)
                        }
                        return parsedCapabilities
                    },
                    get legends() {
                        if (!indexedLegends) {
                            indexedLegends = indexGibsLegends(doc)
                        }
                        return indexedLegends
                    },
                }
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

/**
 * Looks up a GIBS layer's color map legend image URLs (both orientations
 * GIBS publishes, keyed by their `xlink:role`) from a projection's
 * GetCapabilities document.
 */
export async function getGibsLegendUrls(
    projection: Projection,
    layer: string
): Promise<GibsLegendUrls | undefined> {
    const { legends } = await fetchGibsCapabilities(projection)
    return legends.get(layer)
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
     * Shown automatically whenever `extent` is set
     */
    showBoundary?: boolean
    /** Palette index. Defaults to 0. */
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

        const urlTemplate = `${GIBS_WMTS_ENDPOINT}/epsg3857/best/${layer}/default/${date}/${tileMatrixSet}/{z}/{y}/{x}.${format}`

        super({
            urlTemplate,
            attributions: ['NASA EOSDIS GIBS'],
            noWorldWrap,
            extent,
            extentProjection: 'EPSG:4326',
        })

        if (extent) {
            // adds a sourceExtent property to this layer
            // can be used by other layers (ex. boundary layer) to visually identify the extent of this layer
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
