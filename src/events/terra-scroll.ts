export type TerraScrollEvent = CustomEvent<Record<PropertyKey, never>>

declare global {
    interface GlobalEventHandlersEventMap {
        'terra-scroll': TerraScrollEvent
    }
}
