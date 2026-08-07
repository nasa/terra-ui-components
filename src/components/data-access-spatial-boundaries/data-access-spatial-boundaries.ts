import TerraDataAccessSpatialBoundaries from './data-access-spatial-boundaries.component.js'

export * from './data-access-spatial-boundaries.component.js'
export default TerraDataAccessSpatialBoundaries

TerraDataAccessSpatialBoundaries.define('terra-data-access-spatial-boundaries')

declare global {
    interface HTMLElementTagNameMap {
        'terra-data-access-spatial-boundaries': TerraDataAccessSpatialBoundaries
    }
}
