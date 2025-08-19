import TerraTimeAverageMap from './time-average-map.component.js'

export * from './time-average-map.component.js'
export default TerraTimeAverageMap

TerraTimeAverageMap.define('terra-time-average-map')

declare global {
    interface HTMLElementTagNameMap {
        'terra-time-average-map': TerraTimeAverageMap
    }
}
