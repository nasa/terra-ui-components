import TerraTabPanel from './tab-panel.component.js'

export * from './tab-panel.component.js'
export default TerraTabPanel

TerraTabPanel.define('terra-tab-panel')

declare global {
    interface HTMLElementTagNameMap {
        'terra-tab-panel': TerraTabPanel
    }
}
