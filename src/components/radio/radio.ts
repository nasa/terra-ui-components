import TerraRadio from './radio.component.js'

export * from './radio.component.js'
export default TerraRadio

TerraRadio.define('terra-radio')

declare global {
    interface HTMLElementTagNameMap {
        'terra-radio': TerraRadio
    }
}
