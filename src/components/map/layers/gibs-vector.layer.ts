import VectorTileLayer from 'ol/layer/VectorTile.js'
import VectorTileSource from 'ol/source/VectorTile.js'
import MVT from 'ol/format/MVT.js'
import { optionsFromCapabilities } from 'ol/source/WMTS.js'
import { transformExtent } from 'ol/proj.js'
import { Circle, Fill, Style } from 'ol/style.js'
import { stylefunction } from 'ol-mapbox-style'
import type { Extent } from 'ol/extent.js'
import { getGibsCapabilities } from './gibs.layer.js'

const GIBS_WMTS_ROOT = 'https://gibs.earthdata.nasa.gov/wmts'
const MVT_FORMAT = 'application/vnd.mapbox-vector-tile'

export type VectorOptions = {
    /** GIBS vector layer identifier, e.g. 'GRanD_Dams'. */
    layer: string
    /** ISO date (YYYY-MM-DD) or 'default' for the layer's latest available date. */
    date?: string
    /**
     * GIBS TileMatrixSet, e.g. '2km' or '500m'. Defaults to '2km'. Only used
     * to look up the right tile grid from GetCapabilities; it does not need
     * to match any raster layer's matrix set.
     */
    tileMatrixSet?: string
    /**
     * Mapbox GL style JSON to render the layer with (e.g. the style GIBS
     * publishes alongside a vector layer's GetCapabilities). Requires
     * `styleSourceId` (the key under the style's `sources` object). If
     * omitted, a simple default circle style is applied.
     */
    style?: object
    /** The `sources` key in `style` that this layer's data corresponds to. Required if `style` is given. */
    styleSourceId?: string
    noWorldWrap?: boolean
    /** Bounding box [west, south, east, north] in EPSG:4326 to clip rendering to. */
    extent?: Extent
}

const DEFAULT_STYLE = new Style({
    image: new Circle({
        radius: 5,
        fill: new Fill({ color: 'rgb(236, 98, 16)' }),
    }),
})

/**
 * Builds a vector tile layer for a NASA GIBS vector data layer (e.g.
 * `GRanD_Dams`, `VIIRS_NOAA20_Thermal_Anomalies_375m_All`), served as Mapbox
 * Vector Tiles (MVT). Only published in EPSG:4326 today.
 *
 * Fetches (and caches, via `getGibsCapabilities`) GIBS' EPSG:4326
 * GetCapabilities document to build a proper tile grid for the given
 * `tileMatrixSet` - same approach as `GibsLayer.forProjection()` - but
 * requests tiles via GIBS' KVP GetTile URL (mirroring NASA's own vector
 * tile examples), since a generic `ol/source/VectorTile` can't use the
 * `{TileMatrix}/{TileRow}/{TileCol}`-style REST templates `ol/source/WMTS`
 * builds for raster layers.
 */
export async function buildGibsVectorLayer(
    options: VectorOptions,
): Promise<VectorTileLayer> {
    const {
        layer,
        date = 'default',
        tileMatrixSet = '2km',
        style,
        styleSourceId,
        noWorldWrap,
        extent,
    } = options

    const projection = 'EPSG:4326'
    const capabilities = await getGibsCapabilities(projection)
    const wmtsOptions = optionsFromCapabilities(capabilities, {
        layer,
        matrixSet: tileMatrixSet,
        format: MVT_FORMAT,
    })

    if (!wmtsOptions) {
        throw new Error(
            `GIBS vector layer "${layer}" was not found, or isn't available in ${tileMatrixSet}`,
        )
    }

    const url =
        `${GIBS_WMTS_ROOT}/epsg4326/best/wmts.cgi?TIME=${date}` +
        `&layer=${layer}&tilematrixset=${tileMatrixSet}` +
        `&Service=WMTS&Request=GetTile&Version=1.0.0` +
        `&FORMAT=${encodeURIComponent(MVT_FORMAT)}` +
        `&TileMatrix={z}&TileCol={x}&TileRow={y}`

    const source = new VectorTileSource({
        format: new MVT(),
        url,
        projection,
        tileGrid: wmtsOptions.tileGrid,
        ...(noWorldWrap ? { wrapX: false } : {}),
    })

    const tileLayer = new VectorTileLayer({
        // NASA's own GIBS examples use renderMode: 'image', but that value
        // was removed in OpenLayers 7+ (only 'hybrid'/'vector' remain) - this
        // codebase is on OL 10, so we rely on the default ('hybrid'), same as
        // the existing BordersLayer/LabelsLayer vector tile layers.
        source,
        ...(extent
            ? { extent: transformExtent(extent, 'EPSG:4326', projection) }
            : {}),
    })

    if (style) {
        if (!styleSourceId) {
            throw new Error(
                `GIBS vector layer "${layer}" was given a "style" but no "styleSourceId" to apply it with.`,
            )
        }
        stylefunction(tileLayer, style, styleSourceId)
    } else {
        tileLayer.setStyle(DEFAULT_STYLE)
    }

    return tileLayer
}
