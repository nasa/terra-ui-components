import TerraAlert from './alert.component.js'

export * from './alert.component.js'
export default TerraAlert

TerraAlert.define('terra-button')

declare global {
    interface HTMLElementTagNameMap {
        'terra-alert': TerraAlert
    }
}
