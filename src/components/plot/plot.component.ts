import { property, query } from 'lit/decorators.js'
import { html } from 'lit'
import { watch } from '../../internal/watch.js'
import componentStyles from '../../styles/component.styles.js'
import TerraElement from '../../internal/terra-element.js'
import styles from './plot.styles.js'
import type { CSSResultGroup } from 'lit'
import {
    newPlot,
    Plots,
    type Data,
    type Layout,
    type Config,
    type PlotlyHTMLElement,
    type PlotRelayoutEvent,
} from 'plotly.js-dist-min'

/**
 * @summary A web component for interactive graphs using Plotly.js.
 * @documentation https://disc.gsfc.nasa.gov/components/plot
 * @status experimental
 * @since 1.0
 *
 * @csspart base - The component's base wrapper.
 */
export default class TerraPlot extends TerraElement {
    static styles: CSSResultGroup = [componentStyles, styles]

    #resizeObserver: ResizeObserver

    @query('[part="base"]')
    base: PlotlyHTMLElement

    @property()
    plotTitle?: string

    @property()
    layout?: Partial<Layout> = {}

    @property()
    config?: Partial<Config> = {}

    @property({ type: Array })
    data: Array<Partial<Data>> = []

    @watch('data')
    handleDataChange() {
        this.updatePlotWithData()
    }

    firstUpdated(): void {
        this.#resizeObserver = new ResizeObserver(() => {
            Plots.resize(this.base)
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
        if (!this.base) {
            return
        }

        newPlot(
            this.base,
            this.data,
            {
                title: this.plotTitle, // support for adding a title directly
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

    #handlePlotlyRelayout(e: PlotRelayoutEvent) {
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
