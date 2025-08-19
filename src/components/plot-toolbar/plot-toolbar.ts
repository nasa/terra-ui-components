import TerraPlotToolbar from './plot-toolbar.component.js'

export * from './plot-toolbar.component.js'
export default TerraPlotToolbar

TerraPlotToolbar.define('terra-plot-toolbar')

declare global {
    interface HTMLElementTagNameMap {
        'terra-plot-toolbar': TerraPlotToolbar
    }
}
