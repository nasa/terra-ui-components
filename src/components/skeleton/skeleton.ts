import TerraSkeleton from './skeleton.component.js'

export * from './skeleton.component.js'
export default TerraSkeleton

TerraSkeleton.define('terra-skeleton')

declare global {
    interface HTMLElementTagNameMap {
        'terra-skeleton': TerraSkeleton
    }
}
