import TerraVariableKeywordSearch from './variable-keyword-search.component.js'

export * from './variable-keyword-search.component.js'
export default TerraVariableKeywordSearch

TerraVariableKeywordSearch.define('terra-variable-keyword-search')

declare global {
    interface HTMLElementTagNameMap {
        'terra-variable-keyword-search': TerraVariableKeywordSearch
    }
}
