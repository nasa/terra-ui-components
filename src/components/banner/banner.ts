import TerraBanner from './banner.component.js'

export * from './banner.component.js'
export default TerraBanner

TerraBanner.define('terra-banner')

declare global {
    interface HTMLElementTagNameMap {
        'terra-banner': TerraBanner
    }
}
