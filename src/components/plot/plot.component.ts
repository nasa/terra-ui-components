import { property, query } from 'lit/decorators.js'
import { html } from 'lit'
import { watch } from '../../internal/watch.js'
import componentStyles from '../../styles/component.styles.js'
import TerraElement from '../../internal/terra-element.js'
import styles from './plot.styles.js'
import type { CSSResultGroup } from 'lit'
import * as Plotly from 'plotly.js-dist-min'

// plotly.js-dist-min ships as a UMD bundle. When bundled for production, esbuild's CJS
// interop resolves `import * as Plotly` to the real module exports. When loaded unbundled
// (the browser test runner, or any unbundled ESM consumer) the browser's module loader
// finds no `export` statements in the UMD source, so that namespace comes back empty —
// the UMD wrapper instead attaches the API to the global `self.Plotly` as a side effect.
// Prefer whichever is actually populated so this works in both cases.
const PlotlyLib: typeof Plotly =
    (globalThis as unknown as { Plotly?: typeof Plotly }).Plotly ?? Plotly

/**
 * @summary A web component for interactive graphs using Plotly.js.
 * @documentation https://terra-ui.netlify.app/components/plot
 * @status stable
 * @since 1.0
 *
 * @csspart base - The component's base wrapper.
 */
export default class TerraPlot extends TerraElement {
    static styles: CSSResultGroup = [componentStyles, styles]

    #resizeObserver: ResizeObserver

    @query('[part="base"]')
    base: Plotly.PlotlyHTMLElement

    @property()
    plotTitle?: string

    @property()
    layout?: Partial<Plotly.Layout> = {}

    @property()
    config?: Partial<Plotly.Config> = {}

    @property({ type: Array })
    data: Array<Partial<Plotly.Data>> = []

    /**
     * Optional: Colors to assign to each time series line
     */
    @property({ type: Array })
    colors: string[] = [
        '#1f77b4', // blue
        '#ff7f0e', // orange
        '#2ca02c', // green
        '#d62728', // red
        '#9467bd', // purple
        '#8c564b', // brown
        '#e377c2', // pink
        '#7f7f7f', // gray
        '#bcbd22', // yellow-green
        '#17becf', // cyan
    ]

    @watch('data')
    handleDataChange() {
        this.updatePlotWithData()
    }

    firstUpdated(): void {
        this.#resizeObserver = new ResizeObserver(() => {
            PlotlyLib.Plots.resize(this.base)
        })

        this.#resizeObserver.observe(this.base)

        if (this.data.length) {
            // when DOM loads, we'll populate the plot with any data passed in
            this.updatePlotWithData()
        }
    }

    disconnectedCallback(): void {
        super.disconnectedCallback()

        this.#resizeObserver.disconnect()
    }

    updatePlotWithData() {
        if (!this.base) return

        const coloredData = this.data.map((trace, index) => {
            // Only assign color if not already defined
            const color = this.colors[index % this.colors.length]

            if (!trace.type || trace.type === 'scatter') {
                const scatterTrace = trace as Partial<Plotly.ScatterData>

                return {
                    type: 'scatter',
                    mode: 'lines',
                    ...scatterTrace,
                    line: {
                        color,
                        ...(scatterTrace.line || {}),
                    },
                }
            }
            return trace
        })

        PlotlyLib.newPlot(
            this.base,
            coloredData as Plotly.Data[],
            {
                title: {
                    text: this.plotTitle, // support for adding a title directly
                },
                ...this.layout, // or complete access to the Plotly layout
            },
            { responsive: true, ...this.config }
        )

        this.base.on('plotly_relayout', this.#handlePlotlyRelayout.bind(this))
    }

    render() {
        return html`<div part="base"></div>`
    }

    updated() {
        // If present, define the Plot Title as a part for styling.
        this.shadowRoot?.querySelector('.gtitle')?.part.add('plot-title')
    }

    #handlePlotlyRelayout(e: Plotly.PlotRelayoutEvent) {
        const detail = {
            ...(e['xaxis.range[0]'] && { xAxisMin: e['xaxis.range[0]'] }),
            ...(e['xaxis.range[1]'] && { xAxisMax: e['xaxis.range[1]'] }),
            ...(e['yaxis.range[0]'] && { yAxisMin: e['yaxis.range[0]'] }),
            ...(e['yaxis.range[1]'] && { yAxisMax: e['yaxis.range[1]'] }),
        }

        if (!Object.keys(detail).length) {
            return
        }

        this.emit('terra-plot-relayout', {
            detail,
        })
    }
}
