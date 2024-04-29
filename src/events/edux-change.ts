export type EduxChangeEvent = CustomEvent<Record<PropertyKey, never>>

declare global {
    interface GlobalEventHandlersEventMap {
        'edux-change': EduxChangeEvent
    }
}
