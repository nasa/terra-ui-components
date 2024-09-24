import TerraTimeSeries from './time-series.component.js'

export * from './time-series.component.js'
export default TerraTimeSeries

TerraTimeSeries.define('terra-time-series')

declare global {
    interface HTMLElementTagNameMap {
        'terra-time-series': TerraTimeSeries
    }
}
