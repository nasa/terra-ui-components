import TerraDataSubsetterHistory from './data-subsetter-history.component.js'

export * from './data-subsetter-history.component.js'
export default TerraDataSubsetterHistory

TerraDataSubsetterHistory.define('terra-data-subsetter-history')

declare global {
    interface HTMLElementTagNameMap {
        'terra-data-subsetter-history': TerraDataSubsetterHistory
    }
}
