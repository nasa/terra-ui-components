import TerraSelect from './select.component.js'

export * from './select.component.js'
export default TerraSelect

TerraSelect.define('terra-select')

declare global {
    interface HTMLElementTagNameMap {
        'terra-select': TerraSelect
    }
}
