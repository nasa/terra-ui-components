export type TerraTabShowEvent = CustomEvent<{ name: string }>

declare global {
    interface GlobalEventHandlersEventMap {
        'terra-tab-show': TerraTabShowEvent
    }
}
