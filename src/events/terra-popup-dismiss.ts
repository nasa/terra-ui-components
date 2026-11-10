export type TerraPopupDismissEvent = CustomEvent<void>
    
declare global {
    interface GlobalEventHandlersEventMap {
        'terra-popup-dismiss': TerraPopupDismissEvent
    }
}
