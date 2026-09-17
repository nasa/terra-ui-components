import type { MapEventDetail } from '../components/map/type.js'

export type TerraMapChangeEvent = CustomEvent<MapEventDetail>

export type TerraSpatialPickerDrawDeletedEvent = CustomEvent<any>

export type TerraMapPointerMoveEventDetail = {
    coordinate: [number, number]
    pixel: [number, number]
}

export type TerraMapPointerMoveEvent = CustomEvent<TerraMapPointerMoveEventDetail>

declare global {
    interface GlobalEventHandlersEventMap {
        'terra-map-change': TerraMapChangeEvent
        'terra-map-pointer-move': TerraMapPointerMoveEvent
    }
}
