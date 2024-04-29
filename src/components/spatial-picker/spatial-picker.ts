import GdSpatialPicker from './spatial-picker.component.js'

export * from './spatial-picker.component.js'
export default GdSpatialPicker

GdSpatialPicker.define('edux-spatial-picker')

declare global {
    interface HTMLElementTagNameMap {
        'edux-spatial-picker': GdSpatialPicker
    }
}
