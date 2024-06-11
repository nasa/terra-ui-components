export type EduxRemoveEvent = CustomEvent<Record<PropertyKey, never>>

declare global {
    interface GlobalEventHandlersEventMap {
        'edux-remove': EduxRemoveEvent
    }
}
