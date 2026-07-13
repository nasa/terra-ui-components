export type TerraColormapChangeEvent = CustomEvent<{ value: string }>

declare global {
    interface GlobalEventHandlersEventMap {
        'terra-colormap-change': TerraColormapChangeEvent
    }
}
