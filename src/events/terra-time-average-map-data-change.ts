import type { Variable } from '../components/browse-variables/browse-variables.types.js'

export interface TerraTimeAverageMapDataChangeEvent extends CustomEvent {
    detail: {
        data: Blob
        variable: Variable
        startDate: string
        endDate: string
        location: string
    }
}

declare global {
    interface GlobalEventHandlersEventMap {
        'terra-time-average-map-data-change': TerraTimeAverageMapDataChangeEvent
    }
}
