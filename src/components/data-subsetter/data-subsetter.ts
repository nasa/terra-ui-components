import TerraDataSubsetter from './data-subsetter.component.js'

export * from './data-subsetter.component.js'
export default TerraDataSubsetter

TerraDataSubsetter.define('terra-data-subsetter')

declare global {
    interface HTMLElementTagNameMap {
        'terra-data-subsetter': TerraDataSubsetter
    }
}
