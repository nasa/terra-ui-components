import type TileLayer from 'ol/layer/Tile.js'
import type VectorTileLayer from 'ol/layer/VectorTile.js'
import {
    buildGeoTiffLayer,
    type GeoTiffLayerConfig,
    type GeoTiffLayerInfo,
    layerRequiresAuthentication as geoTiffLayerRequiresAuthentication,
} from './geotiff.layer.js'
import {
    buildGibsLayer,
    type GibsLayerConfig,
    type GibsLayerInfo,
} from './gibs.layer.js'

/**
 * Declarative config for any layer `<terra-map layers>` can build, discriminated
 * by `type`: `'gibs'` (raster) / `'gibs-vector'` from GIBS, or `'geotiff'` for a
 * standalone GeoTIFF/COG by URL.
 */
export type MapLayerConfig = GibsLayerConfig | GeoTiffLayerConfig

export type MapLayerResult =
    | {
          type: 'gibs' | 'gibs-vector'
          layer: TileLayer | VectorTileLayer
          legend: GibsLayerInfo['legend']
      }
    | { type: 'geotiff'; layer: GeoTiffLayerInfo['layer']; info: GeoTiffLayerInfo }

/**
 * Builds a layer from a `MapLayerConfig`, dispatching to `buildGibsLayer()` or
 * `buildGeoTiffLayer()` based on `config.type`.
 */
export async function buildMapLayer(
    config: MapLayerConfig,
    options?: { bearerToken?: string }
): Promise<MapLayerResult> {
    if (config.type === 'geotiff') {
        const info = await buildGeoTiffLayer(config, options)
        return { type: 'geotiff', layer: info.layer, info }
    }

    const { layer, legend } = await buildGibsLayer(config)
    return { type: config.type, layer, legend }
}

export function layerRequiresAuthentication(config: MapLayerConfig): boolean {
    if (config.type === 'geotiff') {
        return geoTiffLayerRequiresAuthentication(config)
    }

    return false
}
