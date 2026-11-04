import type { GeoTiffLayerInfo } from '../components/map/layers/geotiff.layer.js'
import type { MapLayerConfig } from '../components/map/layers/layer.js'

export interface TerraMapLayerChangeEvent extends CustomEvent {
    detail:
        | {
              name: string
              type: 'gibs' | 'gibs-vector'
              info?: never
              error?: never
          }
        | {
              name: string
              type: 'geotiff'
              info: GeoTiffLayerInfo
              error?: never
          }
        | {
              name: string
              type: MapLayerConfig['type']
              info?: never
              error: Error
          }
}

declare global {
    interface GlobalEventHandlersEventMap {
        'terra-map-layer-change': TerraMapLayerChangeEvent
    }
}
