export type GdChangeEvent = CustomEvent<Record<PropertyKey, never>>

declare global {
    interface GlobalEventHandlersEventMap {
        'gd-change': GdChangeEvent
    }
}
