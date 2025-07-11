import componentStyles from '../../styles/component.styles.js'
import styles from './time-series.styles.js'
import TerraButton from '../button/button.component.js'
import TerraAlert from '../alert/alert.component.js'
import TerraElement from '../../internal/terra-element.js'
import TerraIcon from '../icon/icon.component.js'
import TerraLoader from '../loader/loader.component.js'
import TerraPlot from '../plot/plot.component.js'
import { cache } from 'lit/directives/cache.js'
import { downloadImage } from 'plotly.js-dist-min'
import { html } from 'lit'
import { property, query, state } from 'lit/decorators.js'
import { Task, TaskStatus } from '@lit/task'
import { TimeSeriesController } from './time-series.controller.js'
import { watch } from '../../internal/watch.js'
import type { CSSResultGroup } from 'lit'
import type { Plot } from '../plot/plot.types.js'
import type { MenuNames } from './time-series.types.js'
import type { Variable } from '../browse-variables/browse-variables.types.js'
import { GiovanniVariableCatalog } from '../../variable-catalog/giovanni-variable-catalog.js'
import { DB_NAME, getDataByKey, IndexedDbStores } from '../../internal/indexeddb.js'
import type { VariableDbEntry } from './time-series.types.js'
import type { TerraPlotRelayoutEvent } from '../../events/terra-plot-relayout.js'
import { formatDate } from '../../utilities/date.js'

/**
 * @summary A component for visualizing time series data using the GES DISC Giovanni API.
 * @documentation https://disc.gsfc.nasa.gov/components/time-series
 * @status mvp
 * @since 1.0
 *
 * @dependency terra-plot
 *
 * @event terra-date-range-change - Emitted whenever the date range is modified
 * @event terra-time-series-data-change - Emitted whenever time series data has been fetched from Giovanni
 */
export default class TerraTimeSeries extends TerraElement {
    static styles: CSSResultGroup = [componentStyles, styles]
    static dependencies = {
        'terra-plot': TerraPlot,
        'terra-loader': TerraLoader,
        'terra-icon': TerraIcon,
        'terra-button': TerraButton,
        'terra-alert': TerraAlert,
    }

    #timeSeriesController: TimeSeriesController

    /**
     * a variable entry ID (ex: GPM_3IMERGHH_06_precipitationCal)
     */
    @property({ attribute: 'variable-entry-id', reflect: true })
    variableEntryId?: string

    /**
     * a collection entry id (ex: GPM_3IMERGHH_06)
     * only required if you don't include a variableEntryId
     */
    @property({ reflect: true })
    collection?: string

    /**
     * a variable short name to plot (ex: precipitationCal)
     * only required if you don't include a variableEntryId
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
     * The token to be used for authentication with remote servers.
     * The component provides the header "Authorization: Bearer" (the request header and authentication scheme).
     * The property's value will be inserted after "Bearer" (the authentication scheme).
     */
    @property({ attribute: 'bearer-token', reflect: false })
    bearerToken: string

    @query('terra-plot') plot: TerraPlot
    @query('#menu') menu: HTMLMenuElement

    @state() catalogVariable: Variable

    /**
     * user quota reached maximum request
     */
    @state() private quotaExceededOpen = false

    /**
     * if true, we'll show a warning to the user about them requesting a large number of data points
     */
    @state()
    showDataPointWarning = false

    /**
     * stores the estimated
     */
    @state()
    estimatedDataPoints = 0

    /**
     *
     */
    @state()
    activeMenuItem: MenuNames = null

    @watch('activeMenuItem')
    handleFocus(_oldValue: MenuNames, newValue: MenuNames) {
        if (newValue === null) {
            return
        }

        this.menu.focus()
    }

    #catalog = new GiovanniVariableCatalog()

    // @ts-expect-error
    #fetchVariableTask = new Task(this, {
        task: async (_args, { signal }) => {
            const variableEntryId = this.#getVariableEntryId()

            console.debug('fetch variable ', variableEntryId)

            if (!variableEntryId) {
                return
            }

            const variable = await this.#catalog.getVariable(variableEntryId, {
                signal,
            })

            console.debug('found variable ', variable)

            if (!variable) {
                return
            }

            this.startDate =
                this.startDate ?? variable.exampleInitialStartDate?.toISOString()
            this.endDate =
                this.endDate ?? variable.exampleInitialEndDate?.toISOString()

            this.catalogVariable = variable
        },
        args: () => [this.variableEntryId, this.collection, this.variable],
    })

    connectedCallback(): void {
        super.connectedCallback()

        this.addEventListener(
            'terra-time-series-error',
            this.#handleQuotaError as EventListener
        )

        //* instantiate the time series contoller maybe with a token
        this.#timeSeriesController = new TimeSeriesController(this, this.bearerToken)

        // Add JupyterLite warmup iframe if it doesn't exist
        if (!document.getElementById('terra-jupyterlite-warmup-iframe')) {
            const iframe = document.createElement('iframe')
            iframe.id = 'terra-jupyterlite-warmup-iframe'
            iframe.src =
                'https://gesdisc.github.io/jupyterlite/lab/index.html?path=warmup.ipynb'
            iframe.style.cssText =
                'width:1px; height:1px; opacity:0.01; pointer-events: none; border: 0; position: fixed; top: 0; left: 0;'
            iframe.title = 'Notebook Warm-Up Frame'
            iframe.setAttribute('aria-hidden', 'true')
            document.body.appendChild(iframe)
        }
    }

    disconnectedCallback(): void {
        super.disconnectedCallback()
        this.removeEventListener(
            'terra-time-series-error',
            this.#handleQuotaError as EventListener
        )
    }

    #handleQuotaError = (event: CustomEvent) => {
        const { status } = event.detail

        if (status === 429) {
            this.quotaExceededOpen = true
        }
    }

    #confirmDataPointWarning() {
        this.#timeSeriesController.confirmDataPointWarning()
        this.#timeSeriesController.task.run()
    }

    #cancelDataPointWarning() {
        this.showDataPointWarning = false
    }

    /**
     * aborts the underlying data loading task, which cancels the network request
     */
    #abortDataLoad() {
        this.#timeSeriesController.task?.abort()
    }

    #downloadCSV(_event: Event) {
        const controllerData =
            this.#timeSeriesController.lastTaskValue ??
            this.#timeSeriesController.emptyPlotData

        let plotData: Array<Plot> = []

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

        // Create CSV format, make it a Blob file and generate a link to it.
        const csv = this.#convertToCSV(csvData)
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.setAttribute('href', url)

        // Create filename with variable, location, and date range
        const variableName = this.catalogVariable?.dataFieldId || 'time-series-data'
        const locationStr = this.location
            ? `_${this.location.replace(/,/g, '_')}`
            : ''
        const dateRange =
            this.startDate && this.endDate
                ? `_${this.startDate.split('T')[0]}_to_${this.endDate.split('T')[0]}`
                : ''

        const filename = `${variableName}${locationStr}${dateRange}.csv`
        link.setAttribute('download', filename)

        link.style.visibility = 'hidden'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    #convertToCSV(data: any[]): string {
        const header = Object.keys(data[0]).join(',') + '\n'
        const rows = data.map(obj => Object.values(obj).join(',')).join('\n')
        return header + rows
    }

    #downloadPNG(_event: Event) {
        downloadImage(this.plot?.base, {
            filename: this.catalogVariable!.dataFieldId,
            format: 'png',
            width: 1920,
            height: 1080,
        })
    }

    #handleActiveMenuItem(event: Event) {
        const button = event.currentTarget as HTMLButtonElement
        const menuName = button.dataset.menuName as MenuNames

        // Set the menu item as active.
        this.activeMenuItem = menuName
    }

    #handleComponentLeave(event: MouseEvent) {
        // Check if we're actually leaving the component by checking if the related target is outside
        const relatedTarget = event.relatedTarget as HTMLElement
        if (!this.contains(relatedTarget)) {
            this.activeMenuItem = null
        }
    }

    #handleMenuLeave(event: MouseEvent) {
        // Only close if we're not moving to another element within the component
        const relatedTarget = event.relatedTarget as HTMLElement
        if (!this.contains(relatedTarget)) {
            this.activeMenuItem = null
        }
    }

    render() {
        return html`
            <div class="plot-container" @mouseleave=${this.#handleComponentLeave}>
                ${this.quotaExceededOpen
                    ? html`
                          <terra-alert
                              variant="warning"
                              duration="10000"
                              open=${this.quotaExceededOpen}
                              closable
                              @terra-after-hide=${() =>
                                  (this.quotaExceededOpen = false)}
                          >
                              <terra-icon
                                  slot="icon"
                                  name="outline-exclamation-triangle"
                                  library="heroicons"
                              ></terra-icon>
                              You've exceeded your request quota. Please
                              <a
                                  href="https://disc.gsfc.nasa.gov/information/documents?title=Contact%20Us"
                                  >contact the help desk</a
                              >
                              for further assistance.
                          </terra-alert>
                      `
                    : ''}
                ${cache(
                    this.catalogVariable
                        ? html`
                              <header>
                                  <h2 class="title">
                                      ${this.catalogVariable.dataFieldLongName}
                                  </h2>

                                  <div class="toggles">
                                      <terra-button
                                          circle
                                          outline
                                          aria-expanded=${this.activeMenuItem ===
                                          'information'}
                                          aria-controls="menu"
                                          aria-haspopup="true"
                                          class="toggle"
                                          @mouseenter=${this.#handleActiveMenuItem}
                                          data-menu-name="information"
                                      >
                                          <span class="sr-only"
                                              >Information for
                                              ${this.catalogVariable
                                                  .dataFieldLongName}</span
                                          >

                                          <terra-icon
                                              name="info"
                                              font-size="1em"
                                          ></terra-icon>
                                      </terra-button>

                                      <terra-button
                                          circle
                                          outline
                                          aria-expanded=${this.activeMenuItem ===
                                          'download'}
                                          aria-controls="menu"
                                          aria-haspopup="true"
                                          class="toggle"
                                          @mouseenter=${this.#handleActiveMenuItem}
                                          data-menu-name="download"
                                      >
                                          <span class="sr-only"
                                              >Download options for
                                              ${this.catalogVariable
                                                  .dataFieldLongName}</span
                                          >

                                          <terra-icon
                                              name="outline-arrow-down-tray"
                                              library="heroicons"
                                              font-size="1.5em"
                                          ></terra-icon>
                                      </terra-button>

                                      <terra-button
                                          circle
                                          outline
                                          aria-expanded=${this.activeMenuItem ===
                                          'help'}
                                          aria-controls="menu"
                                          aria-haspopup="true"
                                          class="toggle"
                                          @mouseenter=${this.#handleActiveMenuItem}
                                          data-menu-name="help"
                                      >
                                          <span class="sr-only"
                                              >Help link for
                                              ${this.catalogVariable
                                                  .dataFieldLongName}</span
                                          >

                                          <terra-icon
                                              name="question"
                                              font-size="1em"
                                          ></terra-icon>
                                      </terra-button>

                                      <terra-button
                                          circle
                                          outline
                                          aria-expanded=${this.activeMenuItem ===
                                          'jupyter'}
                                          aria-controls="menu"
                                          aria-haspopup="true"
                                          class="toggle"
                                          @mouseenter=${this.#handleActiveMenuItem}
                                          data-menu-name="jupyter"
                                      >
                                          <span class="sr-only"
                                              >Open in Jupyter Notebook for
                                              ${this.catalogVariable
                                                  .dataFieldLongName}</span
                                          >

                                          <terra-icon
                                              name="outline-code-bracket"
                                              library="heroicons"
                                              font-size="1.5em"
                                          ></terra-icon>
                                      </terra-button>
                                  </div>

                                  <menu
                                      role="menu"
                                      id="menu"
                                      data-expanded=${this.activeMenuItem !== null}
                                      tabindex="-1"
                                      @mouseleave=${this.#handleMenuLeave}
                                  >
                                      <li
                                          role="menuitem"
                                          ?hidden=${this.activeMenuItem !==
                                          'information'}
                                      >
                                          ${this.#renderInfoPanel()}
                                      </li>

                                      <li
                                          role="menuitem"
                                          ?hidden=${this.activeMenuItem !==
                                          'download'}
                                      >
                                          ${this.#renderDownloadPanel()}
                                      </li>

                                      <li
                                          role="menuitem"
                                          ?hidden=${this.activeMenuItem !== 'help'}
                                      >
                                          ${this.#renderHelpPanel()}
                                      </li>

                                      <li
                                          role="menuitem"
                                          ?hidden=${this.activeMenuItem !== 'jupyter'}
                                      >
                                          ${this.#renderJupyterNotebookPanel()}
                                      </li>
                                  </menu>
                              </header>
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
                            range:
                                // manually set the range as we may adjust it when we fetch new data as a user pans/zooms the plot
                                this.startDate && this.endDate
                                    ? [this.startDate, this.endDate]
                                    : undefined,
                        },
                        yaxis: {
                            title: this.#getYAxisLabel(),
                            showline: false,
                        },
                        title: {
                            text:
                                this.catalogVariable && this.location
                                    ? `${this.catalogVariable.dataProductShortName} @ ${this.location}`
                                    : null,
                        },
                    }}"
                    .config=${{
                        displayModeBar: true,
                        displaylogo: false,
                        modeBarButtonsToRemove: ['toImage', 'zoom2d', 'resetScale2d'],
                        responsive: true,
                    }}
                    @terra-plot-relayout=${this.#handlePlotRelayout}
                ></terra-plot>
            </div>

            <dialog
                ?open=${this.#timeSeriesController.task.status === TaskStatus.PENDING}
            >
                <terra-loader indeterminate></terra-loader>
                <p>Plotting ${this.catalogVariable?.dataFieldId}&hellip;</p>
                <terra-button @click=${this.#abortDataLoad}>Cancel</terra-button>
            </dialog>

            <dialog ?open=${this.showDataPointWarning} class="quota-dialog">
                <h2>This is a large request</h2>

                <p>
                    You are requesting approximately
                    ${this.estimatedDataPoints.toLocaleString()} data points.
                </p>

                <p>
                    Requesting large amounts of data may cause you to reach your
                    monthly quota limit.
                </p>

                <p>Would you still like to proceed with this request?</p>

                <div class="dialog-buttons">
                    <terra-button
                        @click=${this.#cancelDataPointWarning}
                        variant="default"
                    >
                        Cancel
                    </terra-button>

                    <terra-button
                        @click=${this.#confirmDataPointWarning}
                        variant="primary"
                    >
                        Proceed
                    </terra-button>
                </div>
            </dialog>
        `
    }

    #getVariableEntryId() {
        if (!this.variableEntryId && !(this.collection && this.variable)) {
            return
        }

        return this.variableEntryId ?? `${this.collection}_${this.variable}`
    }

    #getYAxisLabel() {
        if (!this.catalogVariable) {
            return
        }

        return [
            this.catalogVariable.dataFieldLongName,
            this.catalogVariable.dataFieldUnits,
        ]
            .filter(Boolean)
            .join(', ')
    }

    #renderInfoPanel() {
        return html`
            <h3 class="sr-only">Information</h3>

            <dl>
                <dt>Variable Longname</dt>
                <dd>${this.catalogVariable.dataFieldLongName}</dd>

                <dt>Variable Shortname</dt>
                <dd>
                    ${this.catalogVariable.dataFieldShortName ??
                    this.catalogVariable.dataFieldAccessName}
                </dd>

                <dt>Units</dt>
                <dd>
                    <code>${this.catalogVariable.dataFieldUnits}</code>
                </dd>

                <dt>Dataset Information</dt>
                <dd>
                    <a
                        href=${this.catalogVariable.dataProductDescriptionUrl}
                        rel="noopener noreffer"
                        target="_blank"
                        >${this.catalogVariable.dataProductLongName}

                        <terra-icon
                            name="outline-arrow-top-right-on-square"
                            library="heroicons"
                        ></terra-icon>
                    </a>
                </dd>

                <dt>Variable Information</dt>
                <dd>
                    <a
                        href=${this.catalogVariable.dataFieldDescriptionUrl}
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
        `
    }

    #renderDownloadPanel() {
        return html`
            <h3 class="sr-only">Download Options</h3>

            <p>
                This plot can be downloaded as either a
                <abbr title="Portable Network Graphic">PNG</abbr>
                image or
                <abbr title="Comma-Separated Value">CSV</abbr>
                data.
            </p>

            <terra-button outline variant="default" @click=${this.#downloadPNG}>
                <span class="sr-only">Download Plot Data as </span>
                PNG
                <terra-icon
                    slot="prefix"
                    name="outline-photo"
                    library="heroicons"
                    font-size="1.5em"
                ></terra-icon>
            </terra-button>

            <terra-button outline variant="default" @click=${this.#downloadCSV}>
                <span class="sr-only">Download Plot Data as </span>
                CSV
                <terra-icon
                    slot="prefix"
                    name="outline-document-chart-bar"
                    library="heroicons"
                    font-size="1.5em"
                ></terra-icon>
            </terra-button>
        `
    }

    #renderHelpPanel() {
        return html`
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
        `
    }

    #renderJupyterNotebookPanel() {
        return html`
            <h3 class="sr-only">Jupyter Notebook Options</h3>
            <p>Open this plot in a Jupyter Notebook to explore the data further.</p>
            <a
                href="#"
                @click=${(e: Event) => {
                    e.preventDefault()
                    this.#handleJupyterNotebookClick()
                }}
            >
                Open in Jupyter Notebook
                <terra-icon
                    name="outline-arrow-top-right-on-square"
                    library="heroicons"
                ></terra-icon>
            </a>
        `
    }

    #handleJupyterNotebookClick() {
        const jupyterLiteUrl = 'https://gesdisc.github.io/jupyterlite/lab/index.html'
        const jupyterWindow = window.open(jupyterLiteUrl, '_blank')

        if (!jupyterWindow) {
            console.error('Failed to open JupyterLite!')
            return
        }

        // Fetch the time series data from IndexedDB
        getDataByKey<VariableDbEntry>(
            IndexedDbStores.TIME_SERIES,
            this.#timeSeriesController.getCacheKey()
        ).then(timeSeriesData => {
            // we don't have an easy way of knowing when JupyterLite finishes loading, so we'll wait a bit and then post our notebook
            setTimeout(() => {
                const notebook = [
                    {
                        id: '2733501b-0de4-4067-8aff-864e1b4c76cb',
                        cell_type: 'code',
                        source: '%pip install -q terra_ui_components',
                        metadata: {
                            trusted: true,
                        },
                        outputs: [],
                        execution_count: null,
                    },
                    {
                        id: '870c1384-e706-48ee-ba07-fd552a949869',
                        cell_type: 'code',
                        source: `from terra_ui_components import TerraTimeSeries\ntimeseries = TerraTimeSeries()\n\ntimeseries.variableEntryId = '${this.#getVariableEntryId()}'\ntimeseries.startDate = '${this.startDate}'\ntimeseries.endDate = '${this.endDate}'\ntimeseries.location = '${this.location}'\n\ntimeseries`,
                        metadata: {
                            trusted: true,
                        },
                        outputs: [],
                        execution_count: null,
                    },
                ]

                jupyterWindow.postMessage(
                    {
                        type: 'load-notebook',
                        filename: `${encodeURIComponent(this.#getVariableEntryId() ?? 'plot')}.ipynb`,
                        notebook,
                        timeSeriesData,
                        databaseName: DB_NAME,
                        storeName: IndexedDbStores.TIME_SERIES,
                    },
                    '*'
                )
            }, 500)
        })
    }

    #handlePlotRelayout(e: TerraPlotRelayoutEvent) {
        let changed = false
        if (e.detail.xAxisMin) {
            this.startDate = formatDate(e.detail.xAxisMin)
            changed = true
        }

        if (e.detail.xAxisMax) {
            this.endDate = formatDate(e.detail.xAxisMax)
            changed = true
        }

        if (changed) {
            this.dispatchEvent(
                new CustomEvent('terra-date-range-change', {
                    detail: {
                        startDate: this.startDate,
                        endDate: this.endDate,
                    },
                    bubbles: true,
                    composed: true,
                })
            )
        }
    }
}
