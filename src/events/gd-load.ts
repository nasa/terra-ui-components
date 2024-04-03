export type GdLoadEvent = CustomEvent<Record<PropertyKey, never>>

declare global {
    interface GlobalEventHandlersEventMap {
        'sl-load': GdLoadEvent
    }
}
