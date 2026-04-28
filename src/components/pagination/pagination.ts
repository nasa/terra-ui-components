import TerraPagination from './pagination.component.js'

export * from './pagination.component.js'
export default TerraPagination

TerraPagination.define('terra-pagination')

declare global {
    interface HTMLElementTagNameMap {
        'terra-pagination': TerraPagination
    }
}
