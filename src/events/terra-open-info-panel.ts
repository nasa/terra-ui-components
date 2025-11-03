export type TerraOpenInfoPanelEvent = CustomEvent<{ collection: any }>

declare global {
    interface GlobalEventHandlersEventMap {
        'terra-open-info-panel': TerraOpenInfoPanelEvent
    }
}
