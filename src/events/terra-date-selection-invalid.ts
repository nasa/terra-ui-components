export type TerraDateSelectionInvalidEvent = CustomEvent<Record<PropertyKey, never>>

declare global {
    interface GlobalEventHandlersEventMap {
        'terra-date-selection-invalid': TerraDateSelectionInvalidEvent
    }
}
