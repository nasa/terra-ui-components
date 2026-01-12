export interface TerraPlotToolbarExportImageEvent extends CustomEvent {
    detail: {
        format: 'png' | 'jpg'
    }
}

declare global {
    interface GlobalEventHandlersEventMap {
        'terra-plot-toolbar-export-image': TerraPlotToolbarExportImageEvent
    }
}
