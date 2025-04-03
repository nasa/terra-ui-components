export type TerraLoadEvent = CustomEvent<Record<PropertyKey, never>>

declare global {
    interface GlobalEventHandlersEventMap {
        'terra-load': TerraLoadEvent
    }
}
