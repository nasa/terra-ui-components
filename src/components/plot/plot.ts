import TerraPlot from './plot.component.js'

export * from './plot.component.js'
export default TerraPlot

TerraPlot.define('terra-plot')

declare global {
    interface HTMLElementTagNameMap {
        'terra-plot': TerraPlot
    }
}
