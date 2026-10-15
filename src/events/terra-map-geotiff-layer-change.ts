import type { GeoTiffLayerInfo } from '../components/map/layers/geotiff.layer.js'

export interface TerraMapGeoTiffLayerChangeEvent extends CustomEvent {
    detail:
        | {
              name: string
              info: GeoTiffLayerInfo
              error?: never
          }
        | {
              name: string
              info?: never
              error: Error
          }
}

declare global {
    interface GlobalEventHandlersEventMap {
        'terra-map-geotiff-layer-change': TerraMapGeoTiffLayerChangeEvent
    }
}
