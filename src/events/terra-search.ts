export type TerraSearchEvent = CustomEvent<string>

declare global {
    interface GlobalEventHandlersEventMap {
        'terra-search': TerraSearchEvent
    }
}
