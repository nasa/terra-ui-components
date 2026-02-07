import TerraMenu from './menu.component.js'

export * from './menu.component.js'
export default TerraMenu

TerraMenu.define('terra-menu')

declare global {
    interface HTMLElementTagNameMap {
        'terra-menu': TerraMenu
    }
}
