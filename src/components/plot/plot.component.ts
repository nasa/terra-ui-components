import { property, query } from 'lit/decorators.js'
import { html } from 'lit'
import { watch } from '../../internal/watch.js'
import componentStyles from '../../styles/component.styles.js'
import GDElement from '../../internal/gd-element.js'
import styles from './plot.styles.js'
import type { CSSResultGroup } from 'lit'
import { newPlot, type Data, type Layout, type Config } from 'plotly.js-dist-min'

/**
 * @summary A web component for interactive graphs using Plotly.js.
 * @documentation https://disc.gsfc.nasa.gov/components/plot
 * @status experimental
 * @since 1.0
 *
 * @csspart base - The component's base wrapper.
 */
export default class GdPlot extends GDElement {
    static styles: CSSResultGroup = [componentStyles, styles]

    @query('[part~="base"]')
    base: HTMLElement

    @property()
    layout?: Partial<Layout>

    @property()
    config?: Partial<Config>

    @property()
    data: Array<Partial<Data>> = []

    @watch('data')
    handleDataChange() {
        this.updatePlotWithData()
    }

    firstUpdated(): void {
        if (this.data.length) {
            // when DOM loads, we'll populate the plot with any data passed in

            this.updatePlotWithData()
        }
    }

    updatePlotWithData() {
        if (!this.base) {
            return
        }

        console.log('update plot with data ', this.data)

        newPlot(this.base, this.data, this.layout, this.config)
    }

    render() {
        return html` <div part="base"></div> `
    }
}
