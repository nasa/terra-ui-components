import type { MapEventDetail } from '../components/map/type.js'

export type TerraMapChangeEvent = CustomEvent<MapEventDetail>

export type TerraSpatialPickerDrawDeletedEvent = CustomEvent<any>

declare global {
    interface GlobalEventHandlersEventMap {
        'terra-map-change': TerraMapChangeEvent
    }
}
