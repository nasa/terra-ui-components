import componentStyles from '../../styles/component.styles.js'
import dayjs from 'dayjs'
import styles from './time-series.styles.js'
import TerraButton from '../button/button.component.js'
import TerraDateRangeSlider from '../date-range-slider/date-range-slider.component.js'
import TerraElement from '../../internal/terra-element.js'
import TerraIcon from '../icon/icon.component.js'
import TerraLoader from '../loader/loader.component.js'
import TerraPlot from '../plot/plot.component.js'
import TerraSpatialPicker from '../spatial-picker/spatial-picker.js'
import TerraVariableCombobox from '../variable-combobox/variable-combobox.component.js'
import timezone from 'dayjs/plugin/timezone.js'
import utc from 'dayjs/plugin/utc.js'
import { cache } from 'lit/directives/cache.js'
import { downloadImage } from 'plotly.js-dist-min'
import { html } from 'lit'
import { property, query, state } from 'lit/decorators.js'
import { TaskStatus } from '@lit/task'
import { TimeSeriesController } from './time-series.controller.js'
import { watch } from '../../internal/watch.js'
import type { CSSResultGroup } from 'lit'
import type { TerraDateRangeChangeEvent } from '../../events/terra-date-range-change.js'
import type { TerraComboboxChangeEvent } from '../../terra-ui-components.js'
import type { Plot } from '../plot/plot.types.js'
import type { MenuNames } from './time-series.types.js'

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
 *
 * @event terra-time-series-data-change - Emitted whenever time series data has been fetched from Giovanni
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

    #timeSeriesController: TimeSeriesController

    /**
     * a collection entry id (ex: GPM_3IMERGHH_06)
     */
    @property({ reflect: true })
    collection?: string

    /**
     * the dataset landing page for the collection
     */
    @property({ reflect: true })
    datasetLandingPage?: string // TODO: support multiple variables (non-MVP feature)

    /**
     * a variable short name to plot (ex: precipitationCal)
     */
    @property({ reflect: true })
    variable?: string // TODO: support multiple variables (non-MVP feature)

    /**
     * the variable landing page
     */
    @property({ reflect: true })
    variableLandingPage?: string // TODO: support multiple variables (non-MVP feature)

    /**
     * a variable long name to plot (e.g., "Longwave radiation flux downwards (surface)")
     */
    @property({ reflect: true })
    variableLongName?: string // TODO: support multiple variables (non-MVP feature)

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

    /**
     * The token to be used for authentication with remote servers.
     * The component provides the header "Authorization: Bearer" (the request header and authentication scheme).
     * The property's value will be inserted after "Bearer" (the authentication scheme).
     */
    @property({ attribute: 'bearer-token', reflect: false })
    bearerToken: string

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
    activeMenuItem: MenuNames = null

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
    handleFocus(_oldValue: MenuNames, newValue: MenuNames) {
        if (newValue === null) {
            return
        }

        this.menu.focus()
    }

    connectedCallback(): void {
        super.connectedCallback()

        //* instantiate the time series contoller maybe with a token
        this.#timeSeriesController = new TimeSeriesController(this, this.bearerToken)
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
        this.datasetLandingPage = event.detail.datasetLandingPage
        this.units = event.detail.units
        this.variable = event.detail.name
        this.variableLandingPage = event.detail.variableLandingPage
        this.variableLongName = event.detail.longName
    }

    #handleMapChange(event: CustomEvent) {
        const type = event.detail.geoJson.geometry.type

        //* The map emits types for bbox and point-based drawing.
        if (type === 'Point') {
            const { latLng } = event.detail

            // TODO: we may want to pick a `toFixed()` length in the spatial picker and stick with it.
            this.location = `${latLng.lat.toFixed(4)},${latLng.lng.toFixed(4)}`
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
     * [x] re-enable downloads here
     * [x] get live data from Giovanni
     * [x] display required information in information menuitem
     * [x] ask about adding help links
     * [ ] see what can be simplified from downloadCSV
     */

    #downloadCSV(_event: Event) {
        // const controllerData = this.#timeSeriesController.toPlotlyData()
        const controllerData =
            this.#timeSeriesController.lastTaskValue ??
            this.#timeSeriesController.emptyPlotData

        let plotData: Array<Plot> = []

        // console.log(controllerData)

        // convert data object to plot object to resolve property references
        controllerData.forEach((plot: any, index: number) => {
            plotData[index] = plot as unknown as Plot
        })

        // Return x and y values for every data point in each plot line
        const csvData = plotData
            .map(trace => {
                return trace.x.map((x: any, i: number) => {
                    return {
                        x: x,
                        y: trace.y[i],
                    }
                })
            })
            .flat()

        // console.log(csvData)

        // Create CSV format, make it a Blob file and generate a link to it.
        const csv = this.#convertToCSV(csvData)
        csv
        // console.log(csv)
        // const blob = new Blob([csv], { type: 'text/csv' })
        // const url = window.URL.createObjectURL(blob)
        // const a = document.createElement('a')
        //
        // // Create a hidden link element and click it to download the CSV, then remove the link.
        // a.setAttribute('href', url)
        // a.setAttribute('download', `${this.collection}_${this.variable}.csv`)
        // a.style.display = 'none'
        // document.body.appendChild(a)
        // a.click()
        // document.body.removeChild(a)
    }

    #convertToCSV(data: any[]): string {
        const header = Object.keys(data[0]).join(',') + '\n'
        const rows = data.map(obj => Object.values(obj).join(',')).join('\n')
        return header + rows
    }

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
        const menuName = button.dataset.menuName as MenuNames

        // Tooggle to `null` or set the menu item as active.
        this.activeMenuItem = menuName === this.activeMenuItem ? null : menuName
    }

    render() {
        // console.log(this.#timeSeriesController.task.value)
        return html`
            <terra-variable-combobox
                exportparts="base:variable-combobox__base, combobox:variable-combobox__combobox, button:variable-combobox__button, listbox:variable-combobox__listbox"
                value=${`${this.collection}_${this.variable}`}
                .bearerToken=${this.bearerToken ?? null}
                @terra-combobox-change="${this.#handleVariableChange}"
            ></terra-variable-combobox>

            <terra-spatial-picker
                initial-value=${this.location}
                exportparts="map:spatial-picker__map, leaflet-bbox:spatial-picker__leaflet-bbox, leaflet-point:spatial-picker__leaflet-point"
                label="Select Point"
                @terra-map-change=${this.#handleMapChange}
            ></terra-spatial-picker>

            <div class="plot-container">
                ${cache(
                    this.variable
                        ? html`
                              <header>
                                  <h2 class="title">
                                      ${this.variableLongName}
                                  </h2>

                                  <div class="toggles">
                                      <terra-button
                                          circle
                                          outline
                                          aria-expanded=${
                                              this.activeMenuItem === 'information'
                                          }
                                          aria-controls="menu"
                                          aria-haspopup="true"
                                          class="toggle"
                                          @click=${this.#handleActiveMenuItem}
                                          data-menu-name="information"
                                      >
                                          <span class="sr-only">Information for ${this.variableLongName}</span>

                                          <terra-icon
                                              name="outline-information-circle"
                                              library="heroicons"
                                              font-size="1.5em"
                                          ></terra-icon>
                                      </terra-button>

                                      <terra-button
                                          circle
                                          outline
                                          aria-expanded=${
                                              this.activeMenuItem === 'download'
                                          }
                                          aria-controls="menu"
                                          aria-haspopup="true"
                                          class="toggle"
                                          @click=${this.#handleActiveMenuItem}
                                          data-menu-name="download"
                                      >
                                          <span class="sr-only">Download options for ${this.variableLongName}</span>

                                          <terra-icon
                                              name="outline-arrow-down-tray"
                                              library="heroicons"
                                              font-size="1.5em"
                                          ></terra-icon>
                                      </terra-button>

                                      <terra-button
                                          circle
                                          outline
                                          aria-expanded=${
                                              this.activeMenuItem === 'help'
                                          }
                                          aria-controls="menu"
                                          aria-haspopup="true"
                                          class="toggle"
                                          @click=${this.#handleActiveMenuItem}
                                          data-menu-name="help"
                                      >
                                          <span class="sr-only">Help link for ${this.variableLongName}</span>

                                          <terra-icon
                                              name="outline-question-mark-circle"
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
                                      <h3 class="sr-only">Information</h3>

                                      <dl>
                                          <dt>Variable Longname</dt>
                                          <dd>${this.variableLongName}</dd>

                                          <dt>Variable Shortname</dt>
                                          <dd>${this.variable}</dd>

                                          <dt>Units</dt>
                                          <dd>
                                              <code>${this.units}</code>
                                          </dd>

                                          <dt>Dataset Information</dt>
                                          <dd>
                                              <a
                                                  href=${this.datasetLandingPage}
                                                  rel="noopener noreffer"
                                                  target="_blank"
                                                  >Dataset Summary

                                                  <terra-icon
                                                      name="outline-arrow-top-right-on-square"
                                                      library="heroicons"
                                                  ></terra-icon>
                                              </a>
                                          </dd>

                                          <dt>Variable Information</dt>
                                          <dd>
                                              <a
                                                  href=${this.variableLandingPage}
                                                  rel="noopener noreffer"
                                                  target="_blank"
                                                  >Variable Glossary

                                                  <terra-icon
                                                      name="outline-arrow-top-right-on-square"
                                                      library="heroicons"
                                                  ></terra-icon>
                                              </a>
                                          </dd>
                                      </dl>
                                  </li>

                                  <li
                                      role="menuitem"
                                      ?hidden=${this.activeMenuItem !== 'download'}
                                  >
                                      <h3 class="sr-only">Download Options</h3>

                                      <p>
                                          This plot can be downloaded as either a
                                          <abbr title="Portable Network Graphic"
                                              >PNG</abbr
                                          >
                                          image or
                                          <abbr title="Comma-Separated Value"
                                              >CSV</abbr
                                          >
                                          data.
                                      </p>

                                      <terra-button
                                          outline
                                          variant="default"
                                          @click=${this.#downloadPNG}
                                      >
                                          <span class="sr-only"
                                              >Download Plot Data as
                                          </span>
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
                                          @click=${this.#downloadCSV}
                                      >
                                          <span class="sr-only"
                                              >Download Plot Data as
                                          </span>
                                          CSV
                                          <terra-icon
                                              slot="prefix"
                                              name="outline-document-chart-bar"
                                              library="heroicons"
                                              font-size="1.5em"
                                          ></terra-icon>
                                      </terra-button>
                                  </li>

                                  <li
                                      role="menuitem"
                                      ?hidden=${this.activeMenuItem !== 'help'}
                                  >
                                      <h3 class="sr-only">Help Links</h3>
                                      <ul>
                                          <li>
                                              <a href="https://forum.earthdata.nasa.gov/viewforum.php?f=7&DAAC=3" rel"noopener noreffer">Earthdata User Forum
                                                  <terra-icon
                                                      name="outline-arrow-top-right-on-square"
                                                      library="heroicons"
                                                  ></terra-icon>
                                              </a>
                                          </li>
                                      </ul>
                                  </li>
                              </menu>
                          `
                        : html`<div class="spacer"></div>`
                )}

                <terra-plot
                    exportparts="base:plot__base, plot-title:plot__title"
                    .data=${this.#timeSeriesController.lastTaskValue ??
                    this.#timeSeriesController.emptyPlotData}
                    .layout="${{
                        xaxis: {
                            title: 'Time',
                            showgrid: false,
                            zeroline: false,
                        },
                        yaxis: {
                            title:
                                this.variableLongName && this.units
                                    ? `${this.variableLongName}, ${this.units}`
                                    : null,
                            showline: false,
                        },
                        title: {
                            text:
                                this.collection && this.location
                                    ? `${this.collection} @ ${this.location}`
                                    : null,
                        },
                    }}"
                    .config=${{
                        displayModeBar: true,
                        displaylogo: false,
                        modeBarButtonsToRemove: ['toImage', 'zoom2d', 'resetScale2d'],
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
                ?open=${this.#timeSeriesController.task.status === TaskStatus.PENDING}
            >
                <terra-loader indeterminate></terra-loader>
                <p>Plotting ${this.collection} ${this.variable}&hellip;</p>
                <terra-button @click=${this.#abortDataLoad}>Cancel</terra-button>
            </dialog>
        `
    }
}
