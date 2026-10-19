import TileLayer from 'ol/layer/Tile.js'
import type VectorTileLayer from 'ol/layer/VectorTile.js'
import WMTS, { optionsFromCapabilities } from 'ol/source/WMTS.js'
import { transformExtent } from 'ol/proj.js'
import type { Extent } from 'ol/extent.js'
import { XYZLayer } from './xyz.layer.js'
import {
    getGibsCapabilities,
    getGibsLegendUrls,
    type GibsLegendUrls,
} from './gibs-capabilities.js'
import { buildGibsVectorLayer, type VectorOptions } from './gibs-vector.layer.js'
import type { CommonConfig } from './common.js'
import '../projections.js' // registers EPSG:3413/3031 with OpenLayers

export type Projection = 'EPSG:3857' | 'EPSG:4326' | 'EPSG:3413' | 'EPSG:3031'

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
}

const GIBS_WMTS_ROOT = 'https://gibs.earthdata.nasa.gov/wmts'

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

        return new TileLayer({
            source,
            ...(extent
                ? { extent: transformExtent(extent, 'EPSG:4326', projection) }
                : {}),
        })
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

    const layer = await GibsLayer.forProjection({ ...rasterOptions, projection })
    return { layer, legend }
}
