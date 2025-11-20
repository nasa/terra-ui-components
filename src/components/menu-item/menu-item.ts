import TerraMenuItem from './menu-item.component.js'

export * from './menu-item.component.js'
export default TerraMenuItem

TerraMenuItem.define('terra-menu-item')

declare global {
    interface HTMLElementTagNameMap {
        'terra-menu-item': TerraMenuItem
    }
}
