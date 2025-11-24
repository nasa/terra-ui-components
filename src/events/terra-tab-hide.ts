export type TerraTabHideEvent = CustomEvent<{ name: string }>

declare global {
    interface GlobalEventHandlersEventMap {
        'terra-tab-hide': TerraTabHideEvent
    }
}
