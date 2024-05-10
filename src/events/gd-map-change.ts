import type { MapEventDetail } from '../components/map/services/leaflet-utils.js'

export type GdMapEvent = CustomEvent<MapEventDetail>

export type GdSpatialPickerDrawDeletedEvent = CustomEvent<any>

declare global {
    interface GlobalEventHandlersEventMap {
        'gd-map-change': GdMapEvent
    }
}
