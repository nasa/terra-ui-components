export type TerraRepositionEvent = CustomEvent<Record<PropertyKey, never>>

declare global {
    interface GlobalEventHandlersEventMap {
        'terra-reposition': TerraRepositionEvent
    }
}
