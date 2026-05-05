import type { SubsetJobStatus } from '../data-services/types.js'

export interface TerraHarmonyJobStatusUpdateEvent extends CustomEvent {
    detail: SubsetJobStatus
}

declare global {
    interface GlobalEventHandlersEventMap {
        'terra-harmony-job-status-update': TerraHarmonyJobStatusUpdateEvent
    }
}
