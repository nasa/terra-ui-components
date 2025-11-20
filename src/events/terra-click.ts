export type TerraClickEvent = CustomEvent<{ originalEvent: MouseEvent }>

declare global {
    interface GlobalEventHandlersEventMap {
        'terra-click': TerraClickEvent
    }
}
