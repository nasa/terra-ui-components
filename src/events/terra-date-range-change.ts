export type TerraDateRangeChangeEvent = CustomEvent<{
    startDate: string
    endDate: string
}>

declare global {
    interface GlobalEventHandlersEventMap {
        'terra-date-range-change': TerraDateRangeChangeEvent
    }
}
