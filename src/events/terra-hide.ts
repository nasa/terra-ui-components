export type TerraHideEvent = CustomEvent<Record<PropertyKey, never>>

declare global {
    interface GlobalEventHandlersEventMap {
        'terra-hide': TerraHideEvent
    }
}
