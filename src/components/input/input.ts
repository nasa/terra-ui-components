import TerraInput from './input.component.js'

export * from './input.component.js'
export default TerraInput

TerraInput.define('terra-input')

declare global {
    interface HTMLElementTagNameMap {
        'terra-input': TerraInput
    }
}
