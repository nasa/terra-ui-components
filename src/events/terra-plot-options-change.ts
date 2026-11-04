export interface TimeAverageMapOptions {
    colorMapName: string
    opacity: number
}

export type TimeSeriesOptions = {}

export interface TerraPlotOptionsChangeEvent extends CustomEvent {
    detail: TimeAverageMapOptions | TimeSeriesOptions
}

declare global {
    interface GlobalEventHandlersEventMap {
        'terra-plot-options-change': TerraPlotOptionsChangeEvent
    }
}
