import TerraTabs from './tabs.component.js'

export * from './tabs.component.js'
export default TerraTabs

TerraTabs.define('terra-tabs')

declare global {
    interface HTMLElementTagNameMap {
        'terra-tabs': TerraTabs
    }
}
