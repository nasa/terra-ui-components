export type GdDateRangeChangeEvent = CustomEvent<{
    startDate: string
    endDate: string
}>

declare global {
    interface GlobalEventHandlersEventMap {
        'gd-date-range-change': GdDateRangeChangeEvent
    }
}
