import EduxMap from './map.component.js'

export * from './map.component.js'
export default EduxMap

EduxMap.define('edux-map')

declare global {
    interface HTMLElementTagNameMap {
        'edux-map': EduxMap
    }
}
