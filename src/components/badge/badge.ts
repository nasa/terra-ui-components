import TerraBadge from './badge.component.js'

export * from './badge.component.js'
export default TerraBadge

TerraBadge.define('terra-badge')

declare global {
    interface HTMLElementTagNameMap {
        'terra-badge': TerraBadge
    }
}
