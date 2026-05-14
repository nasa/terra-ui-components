import type { SubsetJobStatus } from '../apis/harmony.api.js'

export interface TerraSubsetJobCompleteEvent extends CustomEvent {
    detail: SubsetJobStatus
}

declare global {
    interface GlobalEventHandlersEventMap {
        'terra-subset-job-complete': TerraSubsetJobCompleteEvent
    }
}
