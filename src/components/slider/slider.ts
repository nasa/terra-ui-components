import TerraSlider from './slider.component.js'

export * from './slider.component.js'
export default TerraSlider

TerraSlider.define('terra-slider')

declare global {
    interface HTMLElementTagNameMap {
        'terra-slider': TerraSlider
    }
}
