import { html } from 'lit'
import { property, query } from 'lit/decorators.js'
import componentStyles from '../../styles/component.styles.js'
import EduxElement from '../../internal/edux-element.js'
import styles from './time-series.styles.js'
import type { CSSResultGroup } from 'lit'
import EduxPlot from '../plot/plot.component.js'
import EduxDateRangeSlider from '../date-range-slider/date-range-slider.component.js'
import { watch } from '../../internal/watch.js'
import type { EduxDateRangeChangeEvent } from '../../events/edux-date-range-change.js'
import { TimeSeriesController } from './time-series.controller.js'

/**
 * @summary A component for visualizing time series data using the GES DISC Giovanni API.
 * @documentation https://disc.gsfc.nasa.gov/components/time-series
 * @status mvp
 * @since 1.0
 *
 * @dependency edux-plot
 */
export default class EduxTimeSeries extends EduxElement {
    static styles: CSSResultGroup = [componentStyles, styles]
    static dependencies = {
        'edux-plot': EduxPlot,
        'edux-date-range-slider': EduxDateRangeSlider,
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
    @property({ attribute: 'start-date', reflect: true })
    startDate: string

    /**
     * The end date for the time series plot. (ex: 2021-01-01)
     */
    @property({ attribute: 'end-date', reflect: true })
    endDate: string

    @query('[part~="date-range-slider"]') dateRangeSlider: EduxDateRangeSlider

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
    private _handleDateRangeSliderChangeEvent(event: EduxDateRangeChangeEvent) {
        // update our start and end date based on the event detail
        this.startDate = event.detail.startDate
        this.endDate = event.detail.endDate

        // make sure the controller also gets updated
        // TODO: try to remove this, couldn't get the task to respond to just the "@watch" above.
        this.#timeSeriesController.startDate = new Date(event.detail.startDate)
        this.#timeSeriesController.endDate = new Date(event.detail.endDate)
    }

    /**
     * rather than showing an empty square while we're waiting for data, we can show an empty plot
     */
    private _renderEmptyPlot() {
        return html`
            <edux-plot
                data="${JSON.stringify(this.#timeSeriesController.emptyPlotData)}"
            ></edux-plot>
        `
    }

    render() {
        return html`
            <div class="plot-container">
                ${this.#timeSeriesController.task.value
                    ? html`<edux-plot
                          data="${JSON.stringify(
                              this.#timeSeriesController.task.value
                          )}"
                      ></edux-plot>`
                    : this._renderEmptyPlot()}
            </div>

            <edux-date-range-slider
                part="date-range-slider"
                min-date=${this.minDate}
                max-date=${this.maxDate}
                start-date=${this.startDate}
                end-date=${this.endDate}
                @edux-date-range-change="${this._handleDateRangeSliderChangeEvent}"
            ></edux-date-range-slider>
        `
    }
}
