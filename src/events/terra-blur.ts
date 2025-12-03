export type TerraBlurEvent = CustomEvent<Record<PropertyKey, never>>

declare global {
    interface GlobalEventHandlersEventMap {
        'terra-blur': TerraBlurEvent
    }
}
