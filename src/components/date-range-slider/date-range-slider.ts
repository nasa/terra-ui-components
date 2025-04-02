import TerraDateRangeSlider from './date-range-slider.component.js'

export * from './date-range-slider.component.js'
export default TerraDateRangeSlider

TerraDateRangeSlider.define('terra-date-range-slider')

declare global {
    interface HTMLElementTagNameMap {
        'terra-date-range-slider': TerraDateRangeSlider
    }
}
