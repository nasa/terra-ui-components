export type TerraErrorEvent = CustomEvent<{ status?: number }>

declare global {
    interface GlobalEventHandlersEventMap {
        'terra-error': TerraErrorEvent
    }
}
