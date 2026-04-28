import TerraStatusIndicator from './status-indicator.component.js'

export * from './status-indicator.component.js'
export default TerraStatusIndicator

TerraStatusIndicator.define('terra-status-indicator')

declare global {
    interface HTMLElementTagNameMap {
        'terra-status-indicator': TerraStatusIndicator
    }
}
