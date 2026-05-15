import type { SubsetJobStatus } from '../apis/harmony.api.js'

export interface TerraHarmonyJobStatusUpdateEvent extends CustomEvent {
    detail: SubsetJobStatus
}

declare global {
    interface GlobalEventHandlersEventMap {
        'terra-harmony-job-status-update': TerraHarmonyJobStatusUpdateEvent
    }
}
