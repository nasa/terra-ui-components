import type { SubsetJobStatus } from '../data-services/types.js'

export type TerraHarmonyJobSelectEvent = CustomEvent<{ job: SubsetJobStatus }>

declare global {
    interface GlobalEventHandlersEventMap {
        'terra-harmony-job-select': TerraHarmonyJobSelectEvent
    }
}
