import TerraAlert from './alert.component.js'

export * from './alert.component.js'
export default TerraAlert

TerraAlert.define('terra-alert')

declare global {
    interface HTMLElementTagNameMap {
        'terra-alert': TerraAlert
    }
}
