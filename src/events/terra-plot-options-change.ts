export interface TimeAverageMapOptions {
    colorMapName: string
    opacity: number
}

export interface TimeSeriesOptions {
    // TODO: add time series options
}

export interface TerraPlotOptionsChangeEvent extends CustomEvent {
    detail: TimeAverageMapOptions | TimeSeriesOptions
}

declare global {
    interface GlobalEventHandlersEventMap {
        'terra-plot-options-change': TerraPlotOptionsChangeEvent
    }
}
