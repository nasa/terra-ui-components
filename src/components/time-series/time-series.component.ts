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
import { TaskStatus } from '@lit/task'
import { TimeSeriesController } from './time-series.controller.js'
import type { CSSResultGroup } from 'lit'
import type { Variable } from '../browse-variables/browse-variables.types.js'
import type { TerraPlotRelayoutEvent } from '../../events/terra-plot-relayout.js'
import { formatDate } from '../../utilities/date.js'
import TerraPlotToolbar from '../plot-toolbar/plot-toolbar.component.js'
import { AuthController } from '../../auth/auth.controller.js'
import { cache } from 'lit/directives/cache.js'
import { getFetchVariableTask } from '../../metadata-catalog/tasks.js'

/**
 * @summary A component for visualizing time series data using the GES DISC Giovanni API.
 * @documentation https://terra-ui.netlify.app/components/time-series
 * @status stable
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

    @property({ type: Boolean, attribute: 'show-citation' }) showCitation: boolean =
        false

    /**
     * if you include an application citation, it will be displayed in the citation panel alongside the dataset citation
     */
    @property({ attribute: 'application-citation' }) applicationCitation?: string

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
     * stores error information from time series requests
     */
    @state() private timeSeriesError: {
        code: string
        message?: string
        context?: string
    } | null = null

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

    _authController = new AuthController(this)

    _fetchVariableTask = getFetchVariableTask(this)

    connectedCallback(): void {
        super.connectedCallback()

        this.addEventListener(
            'terra-time-series-error',
            this.#handleQuotaError as EventListener
        )

        //* instantiate the time series contoller maybe with a token
        this.#timeSeriesController = new TimeSeriesController(this)
    }

    updated(changedProps: Map<string, unknown>) {
        super.updated(changedProps)

        const taskStatus = this.#timeSeriesController.task.status

        // Clear error when a new request starts
        if (taskStatus === TaskStatus.PENDING && this.timeSeriesError) {
            this.timeSeriesError = null
        }

        // Check if task has an error and we haven't already captured it via event
        if (taskStatus === TaskStatus.ERROR && !this.timeSeriesError) {
            const taskError = this.#timeSeriesController.task.error
            if (taskError) {
                // Try to extract error information from the error message
                // Error messages from fetch might contain status codes
                const errorMessage =
                    (taskError instanceof Error ? taskError.message : undefined) ||
                    String(taskError)
                let errorCode = '500'
                let errorContext: string | undefined

                // Try to extract status code from error message
                const statusMatch = errorMessage.match(/status[:\s]+(\d+)/i)
                if (statusMatch) {
                    errorCode = statusMatch[1]
                }

                // Check if error message contains JSON-like structure
                if (
                    errorMessage.includes('code') ||
                    errorMessage.includes('context')
                ) {
                    try {
                        const parsed = JSON.parse(errorMessage)
                        errorCode = parsed.code || errorCode
                        errorContext = parsed.context
                    } catch {
                        // Not JSON, use the message as context
                        errorContext = errorMessage
                    }
                } else {
                    errorContext = errorMessage
                }

                this.timeSeriesError = {
                    code: errorCode,
                    message: errorMessage,
                    context: errorContext,
                }
            }
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
        const { status, code, message, context } = event.detail

        // Store error information
        this.timeSeriesError = {
            code: code || String(status),
            message,
            context,
        }

        // Keep the old quota handler for backward compatibility
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
        console.log('Aborting data load')
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
                              .showCitation=${this.showCitation}
                          >
                              <slot name="help-links" slot="help-links"></slot>
                          </terra-plot-toolbar>`
                        : html`<div class="spacer"></div>`
                )}
                ${this.#hasNoData()
                    ? html`
                          <terra-alert
                              class="no-data-alert"
                              variant="warning"
                              open
                              closable
                          >
                              <terra-icon
                                  slot="icon"
                                  name="outline-information-circle"
                                  library="heroicons"
                              ></terra-icon>
                              We couldn't find available data for your selection. Try
                              widening your area or changing the date range to find
                              more results.
                          </terra-alert>
                      `
                    : ''}
                ${this.#isVariableNotFound()
                    ? html`
                          <terra-alert
                              class="no-data-alert"
                              variant="danger"
                              open
                              closable
                          >
                              <terra-icon
                                  slot="icon"
                                  name="outline-exclamation-triangle"
                                  library="heroicons"
                              ></terra-icon>
                              The selected variable was not found in the catalog
                          </terra-alert>
                      `
                    : ''}
                ${this.timeSeriesError
                    ? html`
                          <terra-alert
                              class="error-alert"
                              variant="danger"
                              open
                              closable
                              @terra-after-hide=${() => (this.timeSeriesError = null)}
                          >
                              <terra-icon
                                  slot="icon"
                                  name="outline-exclamation-triangle"
                                  library="heroicons"
                              ></terra-icon>
                              ${this.#getErrorMessage(this.timeSeriesError)}
                          </terra-alert>
                      `
                    : ''}

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
                ?open=${this.#timeSeriesController.task.status ===
                    TaskStatus.PENDING ||
                this._fetchVariableTask.status === TaskStatus.PENDING}
            >
                <terra-loader indeterminate></terra-loader>

                ${this.#timeSeriesController.task.status === TaskStatus.PENDING
                    ? html`<p>
                          Plotting ${this.catalogVariable?.dataFieldId}&hellip;
                      </p>`
                    : html`<p>Preparing plot&hellip;</p>`}

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

    #getYAxisLabel() {
        if (!this.catalogVariable) {
            return
        }

        return [this.catalogVariable.dataFieldUnits].filter(Boolean).join(', ')
    }

    #hasNoData(): boolean {
        const taskStatus = this.#timeSeriesController.task.status

        if (taskStatus !== TaskStatus.COMPLETE) {
            return false
        }

        const plotData =
            this.#timeSeriesController.lastTaskValue ??
            this.#timeSeriesController.emptyPlotData

        // Check if we have any data points
        if (plotData.length === 0) {
            return true
        }

        // Check if the first data series has empty arrays
        const firstSeries = plotData[0]
        const x = 'x' in firstSeries ? firstSeries.x : undefined
        const y = 'y' in firstSeries ? firstSeries.y : undefined

        if (
            !x ||
            !y ||
            (Array.isArray(x) && x.length === 0) ||
            (Array.isArray(y) && y.length === 0)
        ) {
            return true
        }

        return false
    }

    #isVariableNotFound(): boolean {
        const variableTaskStatus = this._fetchVariableTask.status
        // Only show "variable not found" if the variable fetch task has completed
        if (variableTaskStatus !== TaskStatus.COMPLETE) {
            return false
        }

        // Check if user has provided variable information
        const hasVariableRequest = Boolean(
            this.variableEntryId || (this.collection && this.variable)
        )

        // If user requested a variable but catalogVariable is not set, variable was not found
        return hasVariableRequest && !this.catalogVariable
    }

    #getErrorMessage(error: {
        code: string
        message?: string
        context?: string
    }): any {
        const errorCode = error.code

        // Handle 429 - Quota exceeded
        if (errorCode === '429') {
            return html`
                You have reached your quota for the month. Please reach out using the
                "Help" menu above for help
            `
        }

        // Handle 400 - Bad request, show the error message from the API
        if (errorCode === '400') {
            const errorText = error.context || error.message || 'Bad or missing input'
            return html`${errorText}`
        }

        // If we have a specific error message/context, show it instead of generic message
        const errorText = error.context || error.message
        if (errorText && errorText !== 'An error occurred') {
            return html`${errorText}`
        }

        // Handle all other errors with generic message
        return html`
            There was a problem making this request. For help, please
            <a
                href="https://forum.earthdata.nasa.gov/viewforum.php?f=7&DAAC=3"
                target="_blank"
                rel="noopener noreferrer"
                >contact us using the Earthdata Forum</a
            >
        `
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
