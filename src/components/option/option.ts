import TerraOption from './option.component.js'

export * from './option.component.js'
export default TerraOption

TerraOption.define('terra-option')

declare global {
    interface HTMLElementTagNameMap {
        'terra-option': TerraOption
    }
}
