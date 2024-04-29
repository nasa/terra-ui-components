export type EduxErrorEvent = CustomEvent<{ status?: number }>

declare global {
    interface GlobalEventHandlersEventMap {
        'edux-error': EduxErrorEvent
    }
}
