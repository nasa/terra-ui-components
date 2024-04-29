import EduxDateRangeSlider from './date-range-slider.component.js'

export * from './date-range-slider.component.js'
export default EduxDateRangeSlider

EduxDateRangeSlider.define('edux-date-range-slider')

declare global {
    interface HTMLElementTagNameMap {
        'edux-date-range-slider': EduxDateRangeSlider
    }
}
