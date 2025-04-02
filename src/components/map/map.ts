import TerraMap from './map.component.js'

export * from './map.component.js'
export default TerraMap

TerraMap.define('terra-map')

declare global {
    interface HTMLElementTagNameMap {
        'terra-map': TerraMap
    }
}
