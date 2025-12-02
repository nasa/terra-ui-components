import TerraBreadcrumb from './breadcrumb.component.js'

export * from './breadcrumb.component.js'
export default TerraBreadcrumb

TerraBreadcrumb.define('terra-breadcrumb')

declare global {
    interface HTMLElementTagNameMap {
        'terra-breadcrumb': TerraBreadcrumb
    }
}
