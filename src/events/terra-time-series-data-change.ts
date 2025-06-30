import type { Variable } from '../components/browse-variables/browse-variables.types.js'
import type { TimeSeriesData } from '../components/time-series/time-series.types.js'

export interface TerraTimeSeriesDataChangeEvent extends CustomEvent {
    detail: {
        data: TimeSeriesData
        variable: Variable
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
