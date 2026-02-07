export type TerraPageChangeEvent = CustomEvent<{ page: number }>

declare global {
    interface GlobalEventHandlersEventMap {
        'terra-page-change': TerraPageChangeEvent
    }
}
