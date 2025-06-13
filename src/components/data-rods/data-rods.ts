import TerraDataRods from './data-rods.component.js'

export * from './data-rods.component.js'
export default TerraDataRods

TerraDataRods.define('terra-data-rods')

declare global {
    interface HTMLElementTagNameMap {
        'terra-data-rods': TerraDataRods
    }
}
