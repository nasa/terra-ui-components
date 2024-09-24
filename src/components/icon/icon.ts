import TerraIcon from './icon.component.js'

export * from './icon.component.js'
export default TerraIcon

TerraIcon.define('terra-icon')

declare global {
    interface HTMLElementTagNameMap {
        'terra-icon': TerraIcon
    }
}
