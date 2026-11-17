import type { FeatureLike } from 'ol/Feature.js'
import type { MapEventDetail, MapLayerToggleDetail } from '../components/map/type.js'
import type { LatLng } from '../components/map/models/LatLng.js'

export type TerraMapChangeEvent = CustomEvent<MapEventDetail>

export type TerraSpatialPickerDrawDeletedEvent = CustomEvent<unknown>

export type TerraMapPointerMoveEventDetail = {
    coordinate: [number, number]
    pixel: [number, number]
}

export type TerraMapPointerMoveEvent = CustomEvent<TerraMapPointerMoveEventDetail>

export type TerraMapReadyEvent = CustomEvent<Record<PropertyKey, never>>

export type TerraMapClickEventDetail = {
    latLng: LatLng
    pixel: [number, number]
    features: FeatureLike[]
}

export type TerraMapClickEvent = CustomEvent<TerraMapClickEventDetail>

export type TerraMapDoubleClickEventDetail = TerraMapClickEventDetail

export type TerraMapDoubleClickEvent = CustomEvent<TerraMapDoubleClickEventDetail>

export type TerraMapMoveEndEventDetail = {
    center: LatLng
    zoom: number
}

export type TerraMapMoveEndEvent = CustomEvent<TerraMapMoveEndEventDetail>

export type TerraMapZoomChangeEventDetail = {
    zoom: number
}

export type TerraMapZoomChangeEvent = CustomEvent<TerraMapZoomChangeEventDetail>

export type TerraMapLayerClickEventDetail = {
    feature: FeatureLike
    layerName: string
    latLng: LatLng
    pixel: [number, number]
}

export type TerraMapLayerClickEvent = CustomEvent<TerraMapLayerClickEventDetail>

export type TerraMapLayerErrorEventDetail = {
    name: string
    error: Error
}

export type TerraMapLayerErrorEvent = CustomEvent<TerraMapLayerErrorEventDetail>

export type TerraMapLayerToggleEvent = CustomEvent<MapLayerToggleDetail>

declare global {
    interface GlobalEventHandlersEventMap {
        'terra-map-change': TerraMapChangeEvent
        'terra-map-pointer-move': TerraMapPointerMoveEvent
        'terra-map-ready': TerraMapReadyEvent
        'terra-map-click': TerraMapClickEvent
        'terra-map-double-click': TerraMapDoubleClickEvent
        'terra-map-move-end': TerraMapMoveEndEvent
        'terra-map-zoom-change': TerraMapZoomChangeEvent
        'terra-map-layer-click': TerraMapLayerClickEvent
        'terra-map-layer-error': TerraMapLayerErrorEvent
        'terra-map-layer-toggle': TerraMapLayerToggleEvent
    }
}
