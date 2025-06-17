import TerraDatePicker from './date-picker.component.js'

export * from './date-picker.component.js'
export default TerraDatePicker

TerraDatePicker.define('terra-date-picker')

declare global {
    interface HTMLElementTagNameMap {
        'terra-date-picker': TerraDatePicker
    }
}
