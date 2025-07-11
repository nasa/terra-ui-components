export type TerraAfterHideEvent = CustomEvent<Record<PropertyKey, never>>

declare global {
    interface GlobalEventHandlersEventMap {
        'terra-after-hide': TerraAfterHideEvent
    }
}
