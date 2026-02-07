export type TerraDropdownSelectEvent = CustomEvent<{
    item: HTMLLIElement
    value: string
}>

declare global {
    interface GlobalEventHandlersEventMap {
        'terra-dropdown-select': TerraDropdownSelectEvent
    }
}
