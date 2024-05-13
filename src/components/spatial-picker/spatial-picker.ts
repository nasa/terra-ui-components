import EduxSpatialPicker from './spatial-picker.component.js'

export * from './spatial-picker.component.js'
export default EduxSpatialPicker

EduxSpatialPicker.define('edux-spatial-picker')

declare global {
    interface HTMLElementTagNameMap {
        'edux-spatial-picker': EduxSpatialPicker
    }
}
