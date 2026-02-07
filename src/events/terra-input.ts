export type TerraInputEvent = CustomEvent<Record<PropertyKey, never>>

declare global {
    interface GlobalEventHandlersEventMap {
        'terra-input': TerraInputEvent
    }
}
