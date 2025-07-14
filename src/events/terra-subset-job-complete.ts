import type { SubsetJobStatus } from '../data-services/types.js'

export interface TerraSubsetJobComplete extends CustomEvent {
    detail: SubsetJobStatus
}

declare global {
    interface GlobalEventHandlersEventMap {
        'terra-subset-job-complete': TerraSubsetJobComplete
    }
}
