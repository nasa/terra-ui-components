import GdTimeSeries from './time-series.component.js'

export * from './time-series.component.js'
export default GdTimeSeries

GdTimeSeries.define('gd-time-series')

declare global {
    interface HTMLElementTagNameMap {
        'gd-time-series': GdTimeSeries
    }
}
