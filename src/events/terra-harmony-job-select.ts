import type { SubsetJobStatus } from '../apis/harmony.api.js'

export type TerraHarmonyJobSelectEvent = CustomEvent<{ job: SubsetJobStatus }>

declare global {
    interface GlobalEventHandlersEventMap {
        'terra-harmony-job-select': TerraHarmonyJobSelectEvent
    }
}
