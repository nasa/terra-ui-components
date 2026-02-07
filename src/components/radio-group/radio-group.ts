import TerraRadioGroup from './radio-group.component.js'

export * from './radio-group.component.js'
export default TerraRadioGroup

TerraRadioGroup.define('terra-radio-group')

declare global {
    interface HTMLElementTagNameMap {
        'terra-radio-group': TerraRadioGroup
    }
}
