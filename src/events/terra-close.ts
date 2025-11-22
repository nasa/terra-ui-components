export type TerraCloseEvent = CustomEvent<Record<PropertyKey, never>>

declare global {
    interface GlobalEventHandlersEventMap {
        'terra-close': TerraCloseEvent
    }
}
