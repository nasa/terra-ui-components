import TerraSpatialBoundaries from './spatial-boundaries.component.js'

export * from './spatial-boundaries.component.js'
export default TerraSpatialBoundaries

TerraSpatialBoundaries.define('terra-spatial-boundaries')

declare global {
    interface HTMLElementTagNameMap {
        'terra-spatial-boundaries': TerraSpatialBoundaries
    }
}
