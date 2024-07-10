import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc.js'
import timezone from 'dayjs/plugin/timezone.js'
import type { CSSResultGroup } from 'lit'
import { html } from 'lit'
import { property, query, state } from 'lit/decorators.js'
import type { EduxComboboxChangeEvent } from '../../earthdata-ux-components.js'
import type { EduxDateRangeChangeEvent } from '../../events/edux-date-range-change.js'
import EduxElement from '../../internal/edux-element.js'
import { watch } from '../../internal/watch.js'
import componentStyles from '../../styles/component.styles.js'
import EduxDateRangeSlider from '../date-range-slider/date-range-slider.component.js'
import EduxPlot from '../plot/plot.component.js'
import EduxSpatialPicker from '../spatial-picker/spatial-picker.js'
import EduxVariableCombobox from '../variable-combobox/variable-combobox.component.js'
import EduxLoader from '../loader/loader.component.js'
import { TaskStatus } from '@lit/task'
import { TimeSeriesController } from './time-series.controller.js'
import styles from './time-series.styles.js'

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.tz.setDefault('Etc/GMT')

/**
 * @summary A component for visualizing time series data using the GES DISC Giovanni API.
 * @documentation https://disc.gsfc.nasa.gov/components/time-series
 * @status mvp
 * @since 1.0
 *
 * @dependency edux-plot
 * @dependency edux-date-range-slider
 * @dependency edux-variable-combobox
 */
export default class EduxTimeSeries extends EduxElement {
    static styles: CSSResultGroup = [componentStyles, styles]
    static dependencies = {
        'edux-plot': EduxPlot,
        'edux-date-range-slider': EduxDateRangeSlider,
        'edux-spatial-picker': EduxSpatialPicker,
        'edux-variable-combobox': EduxVariableCombobox,
        'edux-loader': EduxLoader,
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
    @property({
        attribute: 'start-date',
        reflect: true,
    })
    startDate?: string

    /**
     * The end date for the time series plot. (ex: 2021-01-01)
     */
    @property({
        attribute: 'end-date',
        reflect: true,
    })
    endDate?: string

    /**
     * The point location in "lat,lon" format.
     */
    @property({
        reflect: true,
    })
    location?: string

    @query('edux-date-range-slider') dateRangeSlider: EduxDateRangeSlider
    @query('edux-plot') plot: EduxPlot
    @query('edux-spatial-picker') spatialPicker: EduxSpatialPicker
    @query('edux-variable-combobo') variableCombobox: EduxVariableCombobox

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

    @watch('collection')
    handleCollectionUpdate(_oldValue: string, newValue: string) {
        this.#adaptPropertyToController('collection', newValue)
    }

    @watch('variable')
    handlevariableUpdate(_oldValue: string, newValue: string) {
        this.#adaptPropertyToController('variable', newValue)
    }

    @watch('startDate')
    handleStartDateUpdate(_oldValue: string, newValue: string) {
        this.#adaptPropertyToController('startDate', newValue)
    }

    @watch('endDate')
    handleEndDateUpdate(_oldValue: string, newValue: string) {
        this.#adaptPropertyToController('endDate', newValue)
    }

    @watch('location')
    handleLocationUpdate(_oldValue: string, newValue: string) {
        this.#adaptPropertyToController('location', newValue)
    }

    #adaptPropertyToController(
        property: 'collection' | 'variable' | 'startDate' | 'endDate' | 'location',
        value: any
    ) {
        switch (property) {
            case 'startDate':
            case 'endDate':
                // FIXME: this also adjusts to local time zone; we want UTC for the controller, but we're getting a number of off-by-one errors because of timezone conversions.
                // We have to consider the incoming startTime, endTime (maybe use a custom converter) and when the start / end times are set by the collection's defaults.
                this.#timeSeriesController[property] = dayjs.utc(value).toDate()

                break

            case 'location':
                const [lat, lon] = value.split(',')

                // TODO: Figure this out: the API requires a very specific format for this value, which seems to be lon, lat. That's a reversal from the order specified in ISO 6709 (though I'm sure we're not compliant in other ways), and we don't use that order anywhere else (like the spatial-picker, or UUI).
                this.#timeSeriesController[property] = `${lon},%20${lat}`
                break

            default:
                this.#timeSeriesController[property] = value

                break
        }

        this.#timeSeriesController.task.run()
    }

    /**
     * The Collection Beginning DateTime changes when a new collection is selected.
     * We want to auto-select a reasonable slice of time and send a request to the data API, the
     * same as if the user moved the time slider.
     * However, if the component has the startDate or endDate set externally, don't override that;
     * this is an init-only action.
     */
    #maybeSliceTimeForStartEnd() {
        const hasExternallySetDates = !!this.startDate || !!this.endDate
        const hasBothDatesFromCollection =
            !!this.collectionBeginningDateTime && !!this.collectionEndingDateTime

        if (hasExternallySetDates || !hasBothDatesFromCollection) {
            return
        }

        // get the diff betwwen start and end; it doesn't matter that we adjust for local time, because the adjustment is the same
        const diff = Math.abs(
            new Date(this.collectionEndingDateTime as string).getTime() -
                new Date(this.collectionBeginningDateTime as string).getTime()
        )
        const threeQuarterRange = Math.floor(diff * 0.75)
        const startDate = Math.abs(
            new Date(this.collectionBeginningDateTime as string).getTime() +
                threeQuarterRange
        )

        this.startDate = dayjs.utc(startDate).format()
        this.endDate = dayjs.utc(this.collectionEndingDateTime).format()
    }

    #handleVariableChange(event: EduxComboboxChangeEvent) {
        this.collectionBeginningDateTime = dayjs
            .utc()
            .format(event.detail.collectionBeginningDateTime)
        this.collectionEndingDateTime = dayjs
            .utc()
            .format(event.detail.collectionEndingDateTime)

        this.#maybeSliceTimeForStartEnd()

        this.collection = `${event.detail.collectionShortName}_${event.detail.collectionVersion}`
        this.variable = event.detail.name as string
    }

    #handleMapChange(event: CustomEvent) {
        const type = event.detail.geoJson.geometry.type

        //* The map emits types for bbox and point-based drawing.
        if (type === 'Point') {
            const { latLng } = event.detail

            this.location = `${latLng.lng},${latLng.lat}`
        }
    }

    /**
     * anytime the date range slider changes, update the start and end date
     */
    #handleDateRangeSliderChangeEvent(event: EduxDateRangeChangeEvent) {
        this.startDate = event.detail.startDate
        this.endDate = event.detail.endDate
    }

    /**
     * aborts the underlying data loading task, which cancels the network request
     */
    #abortDataLoad() {
        this.#timeSeriesController.task?.abort()
    }

    render() {
        return html`
            <edux-variable-combobox
                exportparts="base:variable-combobox__base, combobox:variable-combobox__combobox, button:variable-combobox__button, listbox:variable-combobox__listbox"
                value=${`${this.collection}_${this.variable}`}
                @edux-combobox-change="${this.#handleVariableChange}"
            ></edux-variable-combobox>

            <edux-spatial-picker
                initial-value=${this.location}
                exportparts="map:spatial-picker__map, leaflet-bbox:spatial-picker__leaflet-bbox, leaflet-point:spatial-picker__leaflet-point"
                label="Select Point"
                @edux-map-change=${this.#handleMapChange}
            ></edux-spatial-picker>

            <edux-plot
                exportparts="base:plot__base"
                data="${JSON.stringify(
                    this.#timeSeriesController.lastTaskValue ??
                        this.#timeSeriesController.emptyPlotData
                )}"
            ></edux-plot>

            <edux-date-range-slider
                exportparts="slider:date-range-slider__slider"
                min-date=${this.collectionBeginningDateTime}
                max-date=${this.collectionEndingDateTime}
                start-date=${this.startDate}
                end-date=${this.endDate}
                @edux-date-range-change="${this.#handleDateRangeSliderChangeEvent}"
            ></edux-date-range-slider>

            <dialog
                open
                class="${this.#timeSeriesController.task.status === TaskStatus.PENDING
                    ? 'open'
                    : ''}"
            >
                <edux-loader indeterminate></edux-loader>
                <p>Plotting ${this.collection} ${this.variable}...</p>
                <edux-button @click=${this.#abortDataLoad}>Cancel</edux-button>
            </dialog>
        `
    }
}
