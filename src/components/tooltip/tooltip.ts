import TerraTooltip from './tooltip.component.js'

export * from './tooltip.component.js'
export default TerraTooltip

TerraTooltip.define('terra-tooltip')

declare global {
    interface HTMLElementTagNameMap {
        'terra-tooltip': TerraTooltip
    }
}
