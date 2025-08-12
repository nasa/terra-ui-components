import type { SubsetJobStatus } from '../data-services/types.js'

export interface TerraSubsetJobCompleteEvent extends CustomEvent {
    detail: SubsetJobStatus
}

declare global {
    interface GlobalEventHandlersEventMap {
        'terra-subset-job-complete': TerraSubsetJobCompleteEvent
    }
}
