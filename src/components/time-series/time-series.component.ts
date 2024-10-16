import { TaskStatus } from '@lit/task'
import { nothing } from 'lit'
import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone.js'
import utc from 'dayjs/plugin/utc.js'
import type { CSSResultGroup } from 'lit'
import { html } from 'lit'
import { property, query, state } from 'lit/decorators.js'
import type { TerraDateRangeChangeEvent } from '../../events/terra-date-range-change.js'
import TerraElement from '../../internal/terra-element.js'
import { watch } from '../../internal/watch.js'
import componentStyles from '../../styles/component.styles.js'
import type { TerraComboboxChangeEvent } from '../../terra-ui-components.js'
import TerraButton from '../button/button.component.js'
import TerraDateRangeSlider from '../date-range-slider/date-range-slider.component.js'
import TerraIcon from '../icon/icon.component.js'
import TerraLoader from '../loader/loader.component.js'
import TerraPlot from '../plot/plot.component.js'
import TerraSpatialPicker from '../spatial-picker/spatial-picker.js'
import TerraVariableCombobox from '../variable-combobox/variable-combobox.component.js'
import { TimeSeriesController } from './time-series.controller.js'
import styles from './time-series.styles.js'
import { downloadImage } from 'plotly.js-dist-min'
import type { MenuItems } from './time-series.types.js'

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.tz.setDefault('Etc/GMT')

/**
 * @summary A component for visualizing time series data using the GES DISC Giovanni API.
 * @documentation https://disc.gsfc.nasa.gov/components/time-series
 * @status mvp
 * @since 1.0
 *
 * @dependency terra-plot
 * @dependency terra-date-range-slider
 * @dependency terra-variable-combobox
 */
export default class TerraTimeSeries extends TerraElement {
    static styles: CSSResultGroup = [componentStyles, styles]
    static dependencies = {
        'terra-plot': TerraPlot,
        'terra-date-range-slider': TerraDateRangeSlider,
        'terra-spatial-picker': TerraSpatialPicker,
        'terra-variable-combobox': TerraVariableCombobox,
        'terra-loader': TerraLoader,
        'terra-icon': TerraIcon,
        'terra-button': TerraButton,
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

    /**
     * Units
     */
    @property({
        reflect: true,
    })
    units?: string

    @query('terra-date-range-slider') dateRangeSlider: TerraDateRangeSlider
    @query('terra-plot') plot: TerraPlot
    @query('terra-spatial-picker') spatialPicker: TerraSpatialPicker
    @query('terra-variable-combobo') variableCombobox: TerraVariableCombobox
    @query('#menu') menu: HTMLMenuElement

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

    /**
     *
     */
    @state()
    activeMenuItem: MenuItems = null

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

    @watch('activeMenuItem')
    handleFocus(_oldValue: MenuItems, newValue: MenuItems) {
        if (newValue === null) {
            return
        }

        this.menu.focus()
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

    #handleVariableChange(event: TerraComboboxChangeEvent) {
        this.collectionBeginningDateTime = dayjs
            .utc()
            .format(event.detail.collectionBeginningDateTime)
        this.collectionEndingDateTime = dayjs
            .utc()
            .format(event.detail.collectionEndingDateTime)

        this.#maybeSliceTimeForStartEnd()

        this.collection = `${event.detail.collectionShortName}_${event.detail.collectionVersion}`
        this.variable = event.detail.name as string
        this.units = event.detail.name as string
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
    #handleDateRangeSliderChangeEvent(event: TerraDateRangeChangeEvent) {
        this.startDate = event.detail.startDate
        this.endDate = event.detail.endDate
    }

    /**
     * aborts the underlying data loading task, which cancels the network request
     */
    #abortDataLoad() {
        this.#timeSeriesController.task?.abort()
    }

    /**
     * TODO:
     * [ ]
     * [x] So maybe what I do is pass in a configuration to disable the download button.
     * I make the toolbar here (don't pass in title), and add the information button and the download button. I'll have to lift up the download functionality.
     * - Add an information icon and an information panel. Panel should contain variable longname, shortname, units, dataset link, and a full citation for the variable and the data rods hydrology tool itself (perhaps this thing should have a DOI)
     * - Add a download icon and a download panel. The panel should contain the option to get the CSV and to get a PNG of the panel. I'll need to pull up the download CSV function to this component.
     * For the panel, maybe animate the height of the grid row?
     */

    #downloadCSV(_event: Event) {
        //
        //     let plotData: Array<Plot> = []
        //
        //     // convert data object to plot object to resolve property references
        //     this.data.forEach((plot, index) => {
        //         plotData[index] = plot as unknown as Plot
        //     })
        //
        //     // Return x and y values for every data point in each plot line
        //     const csvData = plotData
        //         .map(trace => {
        //             return trace.x.map((x: any, i: number) => {
        //                 return {
        //                     x: x,
        //                     y: trace.y[i],
        //                 }
        //             })
        //         })
        //         .flat()
        //
        //     // Create CSV format, make it a Blob file and generate a link to it.
        //     const csv = this.#convertToCSV(csvData)
        //     const blob = new Blob([csv], { type: 'text/csv' })
        //     const url = window.URL.createObjectURL(blob)
        //     const a = document.createElement('a')
        //
        //     // Create a hidden link element and click it to download the CSV, then remove the link.
        //     a.setAttribute('href', url)
        //     a.setAttribute('download', 'chart_data.csv')
        //     a.style.display = 'none'
        //     document.body.appendChild(a)
        //     a.click()
        //     document.body.removeChild(a)
    }

    // #convertToCSV(data: any[]): string {
    //     const header = Object.keys(data[0]).join(',') + '\n'
    //     const rows = data.map(obj => Object.values(obj).join(',')).join('\n')
    //     return header + rows
    // }

    #downloadPNG(_event: Event) {
        downloadImage(this.plot?.base, {
            filename: `${this.collection}_${this.variable}`,
            format: 'png',
            width: 1920,
            height: 1080,
        })
    }

    #handleActiveMenuItem(event: Event) {
        const button = event.currentTarget as HTMLButtonElement
        const menuItem = button.dataset.menuItem as MenuItems

        // Tooggle to `null` or set the menu item as active.
        this.activeMenuItem = menuItem === this.activeMenuItem ? null : menuItem
        console.dir(
            this.#timeSeriesController.lastTaskValue ??
                this.#timeSeriesController.emptyPlotData
        )
    }

    render() {
        console.log(this.collection)
        console.log(this.variable)
        return html`
            <terra-variable-combobox
                exportparts="base:variable-combobox__base, combobox:variable-combobox__combobox, button:variable-combobox__button, listbox:variable-combobox__listbox"
                value=${`${this.collection}_${this.variable}`}
                @terra-combobox-change="${this.#handleVariableChange}"
            ></terra-variable-combobox>

            <terra-spatial-picker
                initial-value=${this.location}
                exportparts="map:spatial-picker__map, leaflet-bbox:spatial-picker__leaflet-bbox, leaflet-point:spatial-picker__leaflet-point"
                label="Select Point"
                @terra-map-change=${this.#handleMapChange}
            ></terra-spatial-picker>

            <div class="plot-container">
                <header>
                    <h2 class="title">
                        ${this.collection && this.variable
                            ? `${this.collection}_${this.variable}`
                            : nothing}
                    </h2>

                    <div class="toggles">
                        <terra-button
                            circle
                            outline
                            aria-expanded=${this.activeMenuItem === 'information'}
                            aria-controls="menu"
                            aria-haspopup="true"
                            class="toggle"
                            @click=${this.#handleActiveMenuItem}
                            data-menu-item="information"
                        >
                            <span class="sr-only">
                                Information for
                                ${this.collection}_${this.variable}</span
                            >
                            <terra-icon
                                name="outline-information-circle"
                                library="heroicons"
                                font-size="1.5em"
                            ></terra-icon>
                        </terra-button>

                        <terra-button
                            circle
                            outline
                            aria-expanded=${this.activeMenuItem === 'download'}
                            aria-controls="menu"
                            aria-haspopup="true"
                            role="menuitem"
                            class="toggle"
                            @click=${this.#handleActiveMenuItem}
                            data-menu-item="download"
                        >
                            <span class="sr-only">
                                Download options for
                                ${this.collection}_${this.variable}</span
                            >
                            <terra-icon
                                name="outline-arrow-down-tray"
                                library="heroicons"
                                font-size="1.5em"
                            ></terra-icon>
                        </terra-button>
                    </div>
                </header>

                <menu
                    role="menu"
                    id="menu"
                    data-expanded=${this.activeMenuItem !== null}
                    tabindex="-1"
                >
                    <li
                        role="menuitem"
                        ?hidden=${this.activeMenuItem !== 'information'}
                    >
                        <dl>
                            <dt>variable longname</dt>
                            <dd>
                                I think we pass in the shortname, so this needs to be
                                gathered from elsewhere?
                            </dd>

                            <dt>variable shortname</dt>
                            <dd>${this.variable}</dd>

                            <dt>units</dt>
                            <dd>What units?</dd>

                            <dt>dataset link</dt>
                            <dd>To the DSL?</dd>

                            <dt>citation</dt>
                            <dd>
                                for both variable and data rods hydrology tool itself
                            </dd>

                            <dt>
                                <abbr title="Digital Object Identifier">DOI</abbr>
                            </dt>
                            <dd>This needs to be gathered from elsewhere.</dd>
                        </dl>
                    </li>

                    <li role="none" ?hidden=${this.activeMenuItem !== 'download'}>
                        <p>Plot data can be downloaded as either a PNG or CSV.</p>

                        <terra-button
                            outline
                            variant="default"
                            role="menuitem"
                            @click=${this.#downloadPNG}
                        >
                            <span class="sr-only">Download Plot Data as </span>
                            PNG
                            <terra-icon
                                slot="prefix"
                                name="outline-photo"
                                library="heroicons"
                                font-size="1.5em"
                            ></terra-icon>
                        </terra-button>

                        <terra-button
                            outline
                            variant="default"
                            role="menuitem"
                            @click=${this.#downloadCSV}
                        >
                            <span class="sr-only">Download Plot Data as </span>
                            CSV
                            <terra-icon
                                slot="prefix"
                                name="outline-document"
                                library="heroicons"
                                font-size="1.5em"
                            ></terra-icon>
                        </terra-button>
                    </li>
                </menu>

                <terra-plot
                    exportparts="base:plot__base"
                    .data=${this.#timeSeriesController.lastTaskValue ??
                    this.#timeSeriesController.emptyPlotData}
                    .layout="${{
                        xaxis: {
                            title: 'Time',
                            showgrid: false,
                            zeroline: false,
                        },
                        yaxis: {
                            title: this.units,
                            showline: false,
                        },
                    }}"
                    .config=${{
                        displayModeBar: true,
                        displaylogo: false,
                        modeBarButtonsToRemove: ['toImage', 'zoom2d'],
                        responsive: true,
                    }}
                ></terra-plot>
            </div>

            <terra-date-range-slider
                exportparts="slider:date-range-slider__slider"
                min-date=${this.collectionBeginningDateTime}
                max-date=${this.collectionEndingDateTime}
                start-date=${this.startDate}
                end-date=${this.endDate}
                @terra-date-range-change="${this.#handleDateRangeSliderChangeEvent}"
            ></terra-date-range-slider>

            <dialog
                open
                class="${this.#timeSeriesController.task.status === TaskStatus.PENDING
                    ? 'open'
                    : ''}"
            >
                <terra-loader indeterminate></terra-loader>
                <p>Plotting ${this.collection} ${this.variable}...</p>
                <terra-button @click=${this.#abortDataLoad}>Cancel</terra-button>
            </dialog>
        `
    }
}
