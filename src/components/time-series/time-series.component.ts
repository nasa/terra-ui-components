import { html } from 'lit'
import { property, query } from 'lit/decorators.js'
import componentStyles from '../../styles/component.styles.js'
import GDElement from '../../internal/gd-element.js'
import styles from './time-series.styles.js'
import type { CSSResultGroup } from 'lit'
import GdPlot from '../plot/plot.component.js'
import GdDateRangeSlider from '../date-range-slider/date-range-slider.component.js'
import { fetchTimeSeries } from './time-series.service.js'
import type { Data, PlotData } from 'plotly.js-dist-min'

/**
 * @summary A component for visualizing time series data using the GES DISC Giovanni API.
 * @documentation https://disc.gsfc.nasa.gov/components/time-series
 * @status mvp
 * @since 1.0
 *
 * @dependency gd-plot
 */
export default class GdTimeSeries extends GDElement {
    static styles: CSSResultGroup = [componentStyles, styles]
    static dependencies = {
        'gd-plot': GdPlot,
        'gd-date-range-slider': GdDateRangeSlider,
    }

    /**
     * a collection entry id
     * @example GPM_3IMERGHH_06
     */
    @property()
    collection: string

    /**
     * a variable short name to plot
     * @example precipitationCal
     */
    @property()
    variable: string // TODO: support multiple variables (non-MVP feature)

    @property({ attribute: 'min-date' })
    minDate: string

    @property({ attribute: 'max-date' })
    maxDate: string

    /**
     * The start date for the time series plot.
     * @example 2021-01-01
     */
    @property({ attribute: 'start-date' })
    startDate: string

    @property({ attribute: 'end-date' })
    endDate: string

    @query('[part~="plot"]') plot: GdPlot
    @query('[part~="date-range-slider"]') dateRangeSlider: GdDateRangeSlider

    async firstUpdated() {
        const plotConfig: Partial<PlotData> = {
            type: 'scatter',
            mode: 'lines',
            name: this.variable,
            line: { color: '#17BECF' },
        }

        // go ahead and set the plot data to an empty plot while we wait for the time series data
        this.plot.data = [
            {
                ...plotConfig,
                x: [],
                y: [],
            },
        ]

        // fetch the time series data
        const timeSeries = await fetchTimeSeries(
            `${this.collection}_${this.variable}`
        )

        // now that we have actual data, update the plot
        this.plot.data = [
            {
                ...plotConfig,
                x: timeSeries.data.map(row => row.timestamp),
                y: timeSeries.data.map(row => row.value),
            },
        ]
    }

    render() {
        return html`
            <gd-plot part="plot"></gd-plot>
            <gd-date-range-slider
                part="date-range-slider"
                min-date=${this.minDate}
                max-date=${this.maxDate}
                start-date=${this.startDate}
                end-date=${this.endDate}
            ></gd-date-range-slider>
        `
    }
}
