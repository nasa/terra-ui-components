export type GdErrorEvent = CustomEvent<{ status?: number }>

declare global {
    interface GlobalEventHandlersEventMap {
        'gd-error': GdErrorEvent
    }
}
