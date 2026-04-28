import TerraToggle from './toggle.component.js'

export * from './toggle.component.js'
export default TerraToggle

TerraToggle.define('terra-toggle')

declare global {
    interface HTMLElementTagNameMap {
        'terra-toggle': TerraToggle
    }
}
