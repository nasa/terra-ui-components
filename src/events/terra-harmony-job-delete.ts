export type TerraHarmonyJobDeleteEvent = CustomEvent<{ jobId: string }>

declare global {
    interface GlobalEventHandlersEventMap {
        'terra-harmony-job-delete': TerraHarmonyJobDeleteEvent
    }
}
