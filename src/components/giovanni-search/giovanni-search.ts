import TerraGiovanniSearch from './giovanni-search.component.js'

export * from './giovanni-search.component.js'
export default TerraGiovanniSearch

TerraGiovanniSearch.define('terra-giovanni-search')

declare global {
    interface HTMLElementTagNameMap {
        'terra-giovanni-search': TerraGiovanniSearch
    }
}
