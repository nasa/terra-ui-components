import type { TimeSeriesData } from '../components/time-series/time-series.types.js'

export interface TerraTimeSeriesDataChangeEvent extends CustomEvent {
    detail: {
        data: TimeSeriesData
        collection: string
        variable: string
        startDate: string
        endDate: string
        location: string
    }
}

declare global {
    interface GlobalEventHandlersEventMap {
        'terra-time-series-data-change': TerraTimeSeriesDataChangeEvent
    }
}
