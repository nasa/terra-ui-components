import TerraChip from './chip.component.js'

export * from './chip.component.js'
export default TerraChip

TerraChip.define('terra-chip')

declare global {
    interface HTMLElementTagNameMap {
        'terra-chip': TerraChip
    }
}
