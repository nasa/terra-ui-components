export type TerraChangeEvent = CustomEvent<Record<PropertyKey, never>>

declare global {
    interface GlobalEventHandlersEventMap {
        'terra-change': TerraChangeEvent
    }
}
