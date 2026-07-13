export interface TerraTimeSeriesLoadingChangeEvent extends CustomEvent {
    detail: {
        loading: boolean
    }
}

declare global {
    interface GlobalEventHandlersEventMap {
        'terra-time-series-loading-change': TerraTimeSeriesLoadingChangeEvent
    }
}
