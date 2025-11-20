import TerraPopup from './popup.component.js'

export * from './popup.component.js'
export default TerraPopup

TerraPopup.define('terra-popup')

declare global {
    interface HTMLElementTagNameMap {
        'terra-popup': TerraPopup
    }
}
