export type EduxDateRangeChangeEvent = CustomEvent<{
    startDate: string
    endDate: string
}>

declare global {
    interface GlobalEventHandlersEventMap {
        'edux-date-range-change': EduxDateRangeChangeEvent
    }
}
