import { html } from 'lit'
import { property, query, state } from 'lit/decorators.js'
import componentStyles from '../../styles/component.styles.js'
import GDElement from '../../internal/gd-element.js'
import styles from './time-series.styles.js'
import type { CSSResultGroup } from 'lit'
import GdPlot from '../plot/plot.component.js'
import GdDateRangeSlider from '../date-range-slider/date-range-slider.component.js'
import { fetchTimeSeries } from './time-series.service.js'
import type { PlotData } from 'plotly.js-dist-min'
import { watch } from '../../internal/watch.js'
import type { GdDateRangeChangeEvent } from '../../events/gd-date-range-change.js'

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
    minDate: string // TODO: this should be fetched from the variable itself, rather than passed in

    @property({ attribute: 'max-date' })
    maxDate: string // TODO: this should be fetched from the variable itself, rather than passed in

    /**
     * The start date for the time series plot.
     * @example 2021-01-01
     */
    @property({ attribute: 'start-date' })
    startDate: string

    @property({ attribute: 'end-date' })
    endDate: string

    @property()
    loading: boolean = false

    @state()
    _plotConfig: Partial<PlotData> = {
        type: 'scatter',
        mode: 'lines',
        line: { color: '#17BECF' },
    }

    @query('[part~="plot"]') plot: GdPlot
    @query('[part~="date-range-slider"]') dateRangeSlider: GdDateRangeSlider

    @watch('variable')
    variableChanged() {
        // add the variable name to the plot config
        this._plotConfig = {
            ...this._plotConfig,
            name: this.variable,
        }
    }

    /**
     * on load, fetch the time series data and update the plot
     */
    firstUpdated() {
        this._renderEmptyPlot() // render an empty plot while we wait for the time series data for the first time
        this.loadTimeSeries()
    }

    /**
     * anytime the date range slider changes, update the start and end date and reload the time series data
     */
    private _handleDateRangeSliderChangeEvent(event: GdDateRangeChangeEvent) {
        // update our start and end date based on the event detail
        this.startDate = event.detail.startDate
        this.endDate = event.detail.endDate

        // and reload the time series data
        this.loadTimeSeries()
    }

    async loadTimeSeries() {
        this.loading = true

        // fetch the time series data
        const timeSeries = await fetchTimeSeries(
            `${this.collection}_${this.variable}`,
            new Date(this.startDate),
            new Date(this.endDate)
        )

        // now that we have actual data, update the plot
        this.plot.data = [
            {
                ...this._plotConfig,
                x: timeSeries.data.map(row => row.timestamp),
                y: timeSeries.data.map(row => row.value),
            },
        ]

        this.loading = false
    }

    private _renderEmptyPlot() {
        this.plot.data = [
            {
                ...this._plotConfig,
                x: [],
                y: [],
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
                @gd-date-range-change="${this._handleDateRangeSliderChangeEvent}"
            ></gd-date-range-slider>
        `
    }
}
