export type TerraClearEvent = CustomEvent<Record<PropertyKey, never>>

declare global {
    interface GlobalEventHandlersEventMap {
        'terra-clear': TerraClearEvent
    }
}
