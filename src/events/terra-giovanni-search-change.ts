export type TerraGiovanniSearchChangeEvent = CustomEvent<string>

declare global {
    interface GlobalEventHandlersEventMap {
        'terra-giovanni-search-change': TerraGiovanniSearchChangeEvent
    }
}
