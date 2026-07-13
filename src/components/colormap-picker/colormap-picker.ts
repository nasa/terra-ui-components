import TerraColormapPicker from './colormap-picker.component.js'

export * from './colormap-picker.component.js'
export default TerraColormapPicker

TerraColormapPicker.define('terra-colormap-picker')

declare global {
    interface HTMLElementTagNameMap {
        'terra-colormap-picker': TerraColormapPicker
    }
}
