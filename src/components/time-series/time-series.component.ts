import { html } from 'lit'
import { property, query, state } from 'lit/decorators.js'
import componentStyles from '../../styles/component.styles.js'
import EduxElement from '../../internal/edux-element.js'
import styles from './time-series.styles.js'
import type { CSSResultGroup } from 'lit'
import EduxPlot from '../plot/plot.component.js'
import EduxDateRangeSlider from '../date-range-slider/date-range-slider.component.js'
import { watch } from '../../internal/watch.js'
import type { EduxDateRangeChangeEvent } from '../../events/edux-date-range-change.js'
import { TimeSeriesController } from './time-series.controller.js'
import EduxVariableCombobox from '../variable-combobox/variable-combobox.component.js'
import type { EduxComboboxChangeEvent } from '../../earthdata-ux-components.js'

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
        'edux-variable-combobox': EduxVariableCombobox,
    }

    #timeSeriesController = new TimeSeriesController(this)

    /**
     * a collection entry id (ex: GPM_3IMERGHH_06)
     */
    @property({ reflect: true })
    collection?: string

    /**
     * a variable short name to plot (ex: precipitationCal)
     */
    @property({ reflect: true })
    variable?: string // TODO: support multiple variables (non-MVP feature)

    /**
     * The start date for the time series plot. (ex: 2021-01-01)
     */
    @property({ attribute: 'start-date', reflect: true })
    startDate?: string

    /**
     * The end date for the time series plot. (ex: 2021-01-01)
     */
    @property({ attribute: 'end-date', reflect: true })
    endDate?: string

    @query('[part~="date-range-slider"]') dateRangeSlider: EduxDateRangeSlider
    @query('[part~="variable-combobox"]') variableCombobox: EduxVariableCombobox

    /**
     * holds the start date for the earliest available data for the collection
     */
    @state()
    collectionBeginningDateTime?: string

    /**
     * holds the end date for the latest available data for the collection
     */
    @state()
    collectionEndingDateTime?: string

    @watch(['collection', 'variable', 'startDate', 'endDate'])
    refreshTimeSeries() {
        this.#timeSeriesController.collection = this.collection ?? ''
        this.#timeSeriesController.variable = this.variable ?? ''
        this.#timeSeriesController.startDate = new Date(this.startDate ?? Date.now())
        this.#timeSeriesController.endDate = new Date(this.endDate ?? Date.now())
    }

    #handleVariableChange(event: EduxComboboxChangeEvent) {
        this.collection = event.detail.entryId?.replace('_' + event.detail.name, '') // set collection to the entryId, minus the variable name
        this.variable = event.detail.name
        this.collectionBeginningDateTime = event.detail.collectionBeginningDateTime
        this.collectionEndingDateTime = event.detail.collectionEndingDateTime

        // TODO: calculate a reasonable date range to request data in and set start and endDate
    }

    /**
     * anytime the date range slider changes, update the start and end date and reload the time series data
     */
    #handleDateRangeSliderChangeEvent(event: EduxDateRangeChangeEvent) {
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
    #renderEmptyPlot() {
        return html`
            <edux-plot
                data="${JSON.stringify(this.#timeSeriesController.emptyPlotData)}"
            ></edux-plot>
        `
    }

    render() {
        return html`
            <edux-variable-combobox
                part="variable-combobox"
                value=${`${this.collection}_${this.variable}`}
                @edux-combobox-change="${this.#handleVariableChange}"
            ></edux-variable-combobox>

            <div class="plot-container">
                ${this.#timeSeriesController.task.value
                    ? html`<edux-plot
                          data="${JSON.stringify(
                              this.#timeSeriesController.task.value
                          )}"
                      ></edux-plot>`
                    : this.#renderEmptyPlot()}
            </div>

            <edux-date-range-slider
                part="date-range-slider"
                min-date=${this.collectionBeginningDateTime}
                max-date=${this.collectionEndingDateTime}
                start-date=${this.startDate}
                end-date=${this.endDate}
                @edux-date-range-change="${this.#handleDateRangeSliderChangeEvent}"
            ></edux-date-range-slider>
        `
    }
}
