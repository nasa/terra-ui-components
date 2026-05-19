export function isResizeObserverSupported(): boolean {
    return typeof window !== 'undefined' && 'ResizeObserver' in window
}
