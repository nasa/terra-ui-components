export type TerraFocusEvent = CustomEvent<Record<PropertyKey, never>>

declare global {
    interface GlobalEventHandlersEventMap {
        'terra-focus': TerraFocusEvent
    }
}
