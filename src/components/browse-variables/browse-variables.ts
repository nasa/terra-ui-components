import TerraBrowseVariables from './browse-variables.component.js'

export * from './browse-variables.component.js'
export default TerraBrowseVariables

TerraBrowseVariables.define('terra-browse-variables')

declare global {
    interface HTMLElementTagNameMap {
        'terra-browse-variables': TerraBrowseVariables
    }
}
