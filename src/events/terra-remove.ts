export type TerraRemoveEvent = CustomEvent<Record<PropertyKey, never>>

declare global {
    interface GlobalEventHandlersEventMap {
        'terra-remove': TerraRemoveEvent
    }
}
