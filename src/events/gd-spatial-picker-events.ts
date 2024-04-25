export type GdSpatialPickerDrawCreatedEvent = CustomEvent<{
    bounds: any
    geoJson: any
}>

export type GdSpatialPickerDrawDeletedEvent = CustomEvent<any>

declare global {
    interface GlobalEventHandlersEventMap {
        'gd-spatial-picker-draw-created': GdSpatialPickerDrawCreatedEvent
        'gd-spatial-picker-draw-deleted': GdSpatialPickerDrawDeletedEvent
    }
}
