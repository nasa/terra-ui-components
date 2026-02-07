export type TerraInvalidEvent = CustomEvent<Record<PropertyKey, never>>

declare global {
    interface GlobalEventHandlersEventMap {
        'terra-invalid': TerraInvalidEvent
    }
}
