import TerraDropdown from './dropdown.component.js'

export * from './dropdown.component.js'
export default TerraDropdown

TerraDropdown.define('terra-dropdown')

declare global {
    interface HTMLElementTagNameMap {
        'terra-dropdown': TerraDropdown
    }
}
