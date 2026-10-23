import type { MapEventDetail, MapLayerToggleDetail } from '../components/map/type.js'

export type TerraMapChangeEvent = CustomEvent<MapEventDetail>

export type TerraSpatialPickerDrawDeletedEvent = CustomEvent<unknown>

export type TerraMapPointerMoveEventDetail = {
    coordinate: [number, number]
    pixel: [number, number]
}

export type TerraMapPointerMoveEvent = CustomEvent<TerraMapPointerMoveEventDetail>

export type TerraMapLayerToggleEvent = CustomEvent<MapLayerToggleDetail>

declare global {
    interface GlobalEventHandlersEventMap {
        'terra-map-change': TerraMapChangeEvent
        'terra-map-pointer-move': TerraMapPointerMoveEvent
        'terra-map-layer-toggle': TerraMapLayerToggleEvent
    }
}
