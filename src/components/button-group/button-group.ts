import TerraButtonGroup from './button-group.component.js'

export * from './button-group.component.js'
export default TerraButtonGroup

TerraButtonGroup.define('terra-button-group')

declare global {
    interface HTMLElementTagNameMap {
        'terra-button-group': TerraButtonGroup
    }
}
