import TerraCombobox from './combobox.component.js'

export * from './combobox.component.js'
export default TerraCombobox

TerraCombobox.define('terra-combobox')

declare global {
    interface HTMLElementTagNameMap {
        'terra-combobox': TerraCombobox
    }
}
