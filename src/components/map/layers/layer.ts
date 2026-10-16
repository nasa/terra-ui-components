import type TileLayer from 'ol/layer/Tile.js'
import type VectorTileLayer from 'ol/layer/VectorTile.js'
import { buildGibsLayer, type GibsLayerConfig } from './gibs.layer.js'
import {
    buildGeoTiffLayer,
    type GeoTiffLayerConfig,
    type GeoTiffLayerInfo,
} from './geotiff.layer.js'

/**
 * Declarative config for any layer `<terra-map layers>` can build, discriminated
 * by `type`: `'gibs'` (raster) / `'gibs-vector'` from GIBS, or `'geotiff'` for a
 * standalone GeoTIFF/COG by URL.
 */
export type MapLayerConfig = GibsLayerConfig | GeoTiffLayerConfig

export type MapLayerResult =
    | { type: 'gibs' | 'gibs-vector'; layer: TileLayer | VectorTileLayer }
    | { type: 'geotiff'; layer: GeoTiffLayerInfo['layer']; info: GeoTiffLayerInfo }

/**
 * Builds a layer from a `MapLayerConfig`, dispatching to `buildGibsLayer()` or
 * `buildGeoTiffLayer()` based on `config.type`.
 */
export async function buildMapLayer(config: MapLayerConfig): Promise<MapLayerResult> {
    if (config.type === 'geotiff') {
        const info = await buildGeoTiffLayer(config)
        return { type: 'geotiff', layer: info.layer, info }
    }

    const layer = await buildGibsLayer(config)
    return { type: config.type, layer }
}
