import TerraTab from './tab.component.js'

export * from './tab.component.js'
export default TerraTab

TerraTab.define('terra-tab')

declare global {
    interface HTMLElementTagNameMap {
        'terra-tab': TerraTab
    }
}
