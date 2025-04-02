import TerraButton from './button.component.js'

export * from './button.component.js'
export default TerraButton

TerraButton.define('terra-button')

declare global {
    interface HTMLElementTagNameMap {
        'terra-button': TerraButton
    }
}
