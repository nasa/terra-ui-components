import EduxVariableCombobox from './variable-combobox.component.js'

export * from './variable-combobox.component.js'
export default EduxVariableCombobox

EduxVariableCombobox.define('edux-variable-combobox')

declare global {
    interface HTMLElementTagNameMap {
        'edux-variable-combobox': EduxVariableCombobox
    }
}
