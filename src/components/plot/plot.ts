import EduxPlot from './plot.component.js'

export * from './plot.component.js'
export default EduxPlot

EduxPlot.define('edux-plot')

declare global {
    interface HTMLElementTagNameMap {
        'edux-plot': EduxPlot
    }
}
