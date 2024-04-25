import { html } from 'lit'
import { property, query } from 'lit/decorators.js'
import componentStyles from '../../styles/component.styles.js'
import GDElement from '../../internal/gd-element.js'
import styles from './time-series.styles.js'
import type { CSSResultGroup } from 'lit'
import GdPlot from '../plot/plot.component.js'
import GdDateRangeSlider from '../date-range-slider/date-range-slider.component.js'
import { watch } from '../../internal/watch.js'
import type { GdDateRangeChangeEvent } from '../../events/gd-date-range-change.js'
import { TimeSeriesController } from './time-series.controller.js'

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

    #timeSeriesController = new TimeSeriesController(this)

    /**
     * a collection entry id (ex: GPM_3IMERGHH_06)
     */
    @property()
    collection: string

    /**
     * a variable short name to plot (ex: precipitationCal)
     */
    @property()
    variable: string // TODO: support multiple variables (non-MVP feature)

    @property({ attribute: 'min-date' })
    minDate: string // TODO: this should be fetched from the variable itself, rather than passed in

    @property({ attribute: 'max-date' })
    maxDate: string // TODO: this should be fetched from the variable itself, rather than passed in

    /**
     * The start date for the time series plot. (ex: 2021-01-01)
     */
    @property({ attribute: 'start-date' })
    startDate: string

    /**
     * The end date for the time series plot. (ex: 2021-01-01)
     */
    @property({ attribute: 'end-date' })
    endDate: string

    @query('[part~="date-range-slider"]') dateRangeSlider: GdDateRangeSlider

    @watch(['collection', 'variable', 'startDate', 'endDate'])
    refreshTimeSeries() {
        this.#timeSeriesController.collection = this.collection
        this.#timeSeriesController.variable = this.variable
        this.#timeSeriesController.startDate = new Date(this.startDate)
        this.#timeSeriesController.endDate = new Date(this.endDate)
    }

    /**
     * anytime the date range slider changes, update the start and end date and reload the time series data
     */
    private _handleDateRangeSliderChangeEvent(event: GdDateRangeChangeEvent) {
        // update our start and end date based on the event detail
        this.startDate = event.detail.startDate
        this.endDate = event.detail.endDate
    }

    /**
     * rather than showing an empty square while we're waiting for data, we can show an empty plot
     */
    private _renderEmptyPlot() {
        return html`
            <gd-plot
                data="${JSON.stringify(this.#timeSeriesController.emptyPlotData)}"
            ></gd-plot>
        `
    }

    render() {
        return html`
            <div class="plot-container">
                ${this.#timeSeriesController.render({
                    complete: (result: any) => html`
                        <gd-plot data="${JSON.stringify(result)}"></gd-plot>
                    `,
                    // render an empty plot while we wait for data
                    initial: () => this._renderEmptyPlot(),
                    pending: () => this._renderEmptyPlot(),

                    // TODO: build a better error state
                    error: (e: any) => html`<p>${e}</p>`,
                })}
            </div>

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
