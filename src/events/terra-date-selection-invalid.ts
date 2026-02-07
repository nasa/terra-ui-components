export type TerraDateSelectionInvalidEvent = CustomEvent<{
    message: string
}>

declare global {
    interface GlobalEventHandlersEventMap {
        'terra-date-selection-invalid': TerraDateSelectionInvalidEvent
    }
}
