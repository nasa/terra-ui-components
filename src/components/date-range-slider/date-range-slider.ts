import GdDateRangeSlider from './date-range-slider.component.js';

export * from './date-range-slider.component.js';
export default GdDateRangeSlider;

GdDateRangeSlider.define('gd-date-range-slider');

declare global {
    interface HTMLElementTagNameMap {
      'gd-date-range-slider': GdDateRangeSlider;
    }
}
