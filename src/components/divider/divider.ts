import TerraDivider from './divider.component.js'

export * from './divider.component.js'
export default TerraDivider

TerraDivider.define('terra-divider')

declare global {
    interface HTMLElementTagNameMap {
        'terra-divider': TerraDivider
    }
}
