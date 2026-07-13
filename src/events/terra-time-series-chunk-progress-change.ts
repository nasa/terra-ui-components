export interface TerraTimeSeriesChunkProgressChangeEvent extends CustomEvent {
    detail: {
        currentChunk: number
        totalChunks: number
    }
}

declare global {
    interface GlobalEventHandlersEventMap {
        'terra-time-series-chunk-progress-change': TerraTimeSeriesChunkProgressChangeEvent
    }
}
