import GdMap from './map.component.js'

export * from './map.component.js'
export default GdMap

GdMap.define('edux-map')

declare global {
    interface HTMLElementTagNameMap {
        'edux-map': GdMap
    }
}
