export type TerraPlotRelayoutEvent = CustomEvent<{
    xAxisMin?: number
    xAxisMax?: number
    yAxisMin?: number
    yAxisMax?: number
}>

declare global {
    interface GlobalEventHandlersEventMap {
        'terra-plot-relayout': TerraPlotRelayoutEvent
    }
}
