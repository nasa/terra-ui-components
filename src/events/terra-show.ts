export type TerraShowEvent = CustomEvent<Record<PropertyKey, never>>

declare global {
    interface GlobalEventHandlersEventMap {
        'terra-show': TerraShowEvent
    }
}
