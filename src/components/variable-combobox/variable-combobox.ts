import TerraVariableCombobox from './variable-combobox.component.js'

export * from './variable-combobox.component.js'
export default TerraVariableCombobox

TerraVariableCombobox.define('terra-variable-combobox')

declare global {
    interface HTMLElementTagNameMap {
        'terra-variable-combobox': TerraVariableCombobox
    }
}
