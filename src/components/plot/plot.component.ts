import { property, query } from 'lit/decorators.js'
import { html } from 'lit'
import { watch } from '../../internal/watch.js'
import componentStyles from '../../styles/component.styles.js'
import EduxElement from '../../internal/edux-element.js'
import styles from './plot.styles.js'
import type { CSSResultGroup } from 'lit'
import { newPlot, Icons, type Data, type Layout, type Config } from 'plotly.js-dist-min'

interface plot {
    type: string
    mode: string
    name: string
    x: Array<number>
    y: Array<number>
}
/**
 * @summary A web component for interactive graphs using Plotly.js.
 * @documentation https://disc.gsfc.nasa.gov/components/plot
 * @status experimental
 * @since 1.0
 *
 * @csspart base - The component's base wrapper.
 */
export default class EduxPlot extends EduxElement {
    static styles: CSSResultGroup = [componentStyles, styles]

    @query('[part~="base"]')
    base: HTMLElement

    @property()
    plotTitle?: string

    @property()
    layout?: Partial<Layout> = {}

    @property()
    config?: Partial<Config> = {
        modeBarButtonsToAdd: [
            {
                name: 'Download Data',
                title: 'Download plot data as a CSV file',
                icon: Icons.disk,
                click: () => {
                    this.downloadCSV()
                }
            }            
        ]
    }

    @property({ type: Array })
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

        newPlot(
            this.base,
            this.data,
            {
                title: this.plotTitle, // support for adding a title directly
                ...this.layout, // or complete access to the Plotly layout
            },
            this.config
        )
    }

    downloadCSV() {
        // TODO: properties x and y do not exist on data since it is of type Array<Partial<Data>> so they are flagged.
        // I created a plot interface to define the x and y properties but data must be of type Array<Partial<Data>> to work with Plotly.
        // Code still works though.
        //const csvData = this.data.map((trace: plot) => {
        const csvData = this.data.map(trace => {
            return trace.x.map((x: any, i: number) => {
                return {
                    x: x,
                    y: trace.y[i]
                };
            });
        }).flat();

        const csv = this.convertToCSV(csvData);
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.setAttribute('href', url);
        a.setAttribute('download', 'chart_data.csv');
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    convertToCSV(data: any[]): string {
    const header = Object.keys(data[0]).join(",") + "\n";
    const rows = data.map(obj => Object.values(obj).join(",")).join("\n");
    return header + rows;
}
    render() {
        return html` <div part="base"></div>
        `
    }
}
