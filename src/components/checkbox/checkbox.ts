import TerraCheckbox from './checkbox.component.js'

export * from './checkbox.component.js'
export default TerraCheckbox

TerraCheckbox.define('terra-checkbox')

declare global {
    interface HTMLElementTagNameMap {
        'terra-checkbox': TerraCheckbox
    }
}
