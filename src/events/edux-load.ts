export type EduxLoadEvent = CustomEvent<Record<PropertyKey, never>>

declare global {
    interface GlobalEventHandlersEventMap {
        'edux-load': EduxLoadEvent
    }
}
