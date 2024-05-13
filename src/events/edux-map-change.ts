import type { MapEventDetail } from '../components/map/services/leaflet-utils.js'

export type EduxMapEvent = CustomEvent<MapEventDetail>

export type EduxSpatialPickerDrawDeletedEvent = CustomEvent<any>

declare global {
    interface GlobalEventHandlersEventMap {
        'edux-map-change': EduxMapEvent
    }
}
