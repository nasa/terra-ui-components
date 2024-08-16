import TerraSpatialPicker from './spatial-picker.component.js'

export * from './spatial-picker.component.js'
export default TerraSpatialPicker

TerraSpatialPicker.define('terra-spatial-picker')

declare global {
    interface HTMLElementTagNameMap {
        'terra-spatial-picker': TerraSpatialPicker
    }
}
