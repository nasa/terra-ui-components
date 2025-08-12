export type TerraAfterShowEvent = CustomEvent<Record<PropertyKey, never>>

declare global {
    interface GlobalEventHandlersEventMap {
        'terra-after-show': TerraAfterShowEvent
    }
}
