import TerraBreadcrumbs from './breadcrumbs.component.js'

export * from './breadcrumbs.component.js'
export default TerraBreadcrumbs

TerraBreadcrumbs.define('terra-breadcrumbs')

declare global {
    interface HTMLElementTagNameMap {
        'terra-breadcrumbs': TerraBreadcrumbs
    }
}
