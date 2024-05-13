import EduxTimeSeries from './time-series.component.js'

export * from './time-series.component.js'
export default EduxTimeSeries

EduxTimeSeries.define('edux-time-series')

declare global {
    interface HTMLElementTagNameMap {
        'edux-time-series': EduxTimeSeries
    }
}
