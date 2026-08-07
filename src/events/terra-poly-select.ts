export type TerraPolySelectEvent = CustomEvent<any>

declare global {
    interface GlobalEventHandlersEventMap {
        'terra-poly-select': TerraPolySelectEvent
    }
}
