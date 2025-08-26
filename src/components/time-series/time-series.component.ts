import componentStyles from '../../styles/component.styles.js'
import styles from './time-series.styles.js'
import TerraButton from '../button/button.component.js'
import TerraAlert from '../alert/alert.component.js'
import TerraElement from '../../internal/terra-element.js'
import TerraIcon from '../icon/icon.component.js'
import TerraLoader from '../loader/loader.component.js'
import TerraPlot from '../plot/plot.component.js'
import { html } from 'lit'
import { property, query, state } from 'lit/decorators.js'
import { Task, TaskStatus } from '@lit/task'
import { TimeSeriesController } from './time-series.controller.js'
import type { CSSResultGroup } from 'lit'
import type { Variable } from '../browse-variables/browse-variables.types.js'
import { GiovanniVariableCatalog } from '../../metadata-catalog/giovanni-variable-catalog.js'
import type { TerraPlotRelayoutEvent } from '../../events/terra-plot-relayout.js'
import { formatDate } from '../../utilities/date.js'
import TerraPlotToolbar from '../plot-toolbar/plot-toolbar.component.js'
import { AuthController } from '../../auth/auth.controller.js'
import { cache } from 'lit/directives/cache.js'

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
        'terra-plot-toolbar': TerraPlotToolbar,
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
     * Or the bounding box in "west,south,east,north" format.
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
    bearerToken?: string

    @query('terra-plot') plot: TerraPlot
    @query('terra-plot-toolbar') plotToolbar: TerraPlotToolbar

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

    #catalog = new GiovanniVariableCatalog()
    _authController = new AuthController(this)

    // @ts-expect-error
    #fetchVariableTask = new Task(this, {
        task: async (_args, { signal }) => {
            const variableEntryId = this.getVariableEntryId()

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
        this.#timeSeriesController = new TimeSeriesController(this)
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

    #handleComponentLeave(event: MouseEvent) {
        // Check if we're actually leaving the component by checking if the related target is outside
        const relatedTarget = event.relatedTarget as HTMLElement
        if (!this.contains(relatedTarget)) {
            this.plotToolbar?.closeMenu()
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
                        ? html`<terra-plot-toolbar
                              .catalogVariable=${this.catalogVariable}
                              .plot=${this.plot}
                              .timeSeriesData=${this.#timeSeriesController
                                  .lastTaskValue ??
                              this.#timeSeriesController.emptyPlotData}
                              .location=${this.location}
                              .startDate=${this.startDate}
                              .endDate=${this.endDate}
                              .cacheKey=${this.#timeSeriesController.getCacheKey()}
                              .variableEntryId=${this.variableEntryId}
                          ></terra-plot-toolbar>`
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

    getVariableEntryId() {
        if (!this.variableEntryId && !(this.collection && this.variable)) {
            return
        }

        return this.variableEntryId ?? `${this.collection}_${this.variable}`
    }

    #getYAxisLabel() {
        if (!this.catalogVariable) {
            return
        }

        return [this.catalogVariable.dataFieldUnits].filter(Boolean).join(', ')
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
