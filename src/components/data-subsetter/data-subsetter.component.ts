import { html, nothing } from 'lit'
import componentStyles from '../../styles/component.styles.js'
import TerraElement from '../../internal/terra-element.js'
import styles from './data-subsetter.styles.js'
import type { CSSResultGroup, TemplateResult } from 'lit'
import { property, query, state } from 'lit/decorators.js'
import { DataSubsetterController } from './data-subsetter.controller.js'
import TerraAccordion from '../accordion/accordion.component.js'
import { Status } from '../../data-services/types.js'
import TerraDatePicker from '../date-picker/date-picker.component.js'
import TerraIcon from '../icon/icon.component.js'
import TerraInput from '../input/input.component.js'
import TerraSpatialPicker from '../spatial-picker/spatial-picker.component.js'
import type { TerraMapChangeEvent } from '../../events/terra-map-change.js'
import { getBasePath } from '../../utilities/base-path.js'
import {
    defaultSubsetFileMimeType,
    getFriendlyNameForMimeType,
} from '../../utilities/mimetypes.js'
import { watch } from '../../internal/watch.js'
import type { LatLng, LatLngBounds } from 'leaflet'
import { MapEventType } from '../map/type.js'
import { AuthController } from '../../auth/auth.controller.js'
import TerraLogin from '../login/login.component.js'
import TerraLoader from '../loader/loader.component.js'
import { sendDataToJupyterNotebook } from '../../lib/jupyter.js'
import { getNotebook } from './notebooks/subsetter-notebook.js'
import TerraDataAccess from '../data-access/data-access.component.js'
import type { TerraDateRangeChangeEvent } from '../../events/terra-date-range-change.js'
import TerraDialog from '../dialog/dialog.component.js'
import TerraDropdown from '../dropdown/dropdown.component.js'
import TerraMenu from '../menu/menu.component.js'
import TerraMenuItem from '../menu-item/menu-item.component.js'
import TerraButton from '../button/button.component.js'
import type { TerraSelectEvent } from '../../events/terra-select.js'
import { TaskStatus } from '@lit/task'
import { extractHarmonyError } from '../../utilities/harmony.js'
import TerraAlert from '../alert/alert.component.js'
import { convertVariableEntryIdToGiovanniFormat } from '../../utilities/giovanni.js'
import { QueryController } from '../../queries/query.controller.js'
import { QueryClientMixin } from '../../queries/query-client.mixin.js'
import {
    queryCmrCollection,
    queryCmrGranules,
    queryCmrVariables,
} from '../../queries/nasa-cmr.queries.js'
import { queryHarmonyCapabilities } from '../../queries/nasa-harmony.queries.js'
import type { Variable } from '../../types/harmony.js'
import DataSubsetterService from './data-subsetter.service.js'
import { queryGiovanniConfiguredVariables } from '../../queries/giovanni.queries.js'
import { accessModeTabs } from './components/access-mode-tabs.js'
import type { SelectedSubsetOptions, ConfiguredSubsetOptions } from './types.js'

/**
 * @summary Easily allow users to select, subset, and download NASA Earth science data collections with spatial, temporal, and variable filters.
 * @documentation https://terra-ui.netlify.app/components/data-subsetter
 * @status stable
 * @since 1.0
 *
 * @dependency terra-accordion
 * @dependency terra-date-picker
 * @dependency terra-icon
 * @dependency terra-spatial-picker
 *
 * @event terra-subset-job-complete - called when a subset job enters a final state (e.g. successful, failed, completed_with_errors)
 */
export default class TerraDataSubsetter extends QueryClientMixin(TerraElement) {
    static styles: CSSResultGroup = [componentStyles, styles]
    static dependencies: Record<string, typeof TerraElement> = {
        'terra-accordion': TerraAccordion,
        'terra-date-picker': TerraDatePicker,
        'terra-icon': TerraIcon,
        'terra-input': TerraInput,
        'terra-spatial-picker': TerraSpatialPicker,
        'terra-login': TerraLogin,
        'terra-loader': TerraLoader,
        'terra-data-access': TerraDataAccess,
        'terra-dialog': TerraDialog,
        'terra-dropdown': TerraDropdown,
        'terra-menu': TerraMenu,
        'terra-menu-item': TerraMenuItem,
        'terra-button': TerraButton,
        'terra-alert': TerraAlert,
    }

    @property({ reflect: true, attribute: 'collection-entry-id' })
    collectionEntryId?: string

    @property({ reflect: true, attribute: 'short-name' })
    shortName?: string

    @property({ reflect: true, attribute: 'version' })
    version?: string

    @property({ reflect: true, type: Boolean, attribute: 'show-history-panel' })
    showHistoryPanel?: boolean = true

    @property({ reflect: true, attribute: 'job-id' })
    jobId?: string

    @property({ attribute: 'bearer-token' })
    bearerToken?: string

    /**
     * Optional dialog ID. When set, the subsetter will render inside a dialog with this ID.
     */
    @property({ reflect: true }) dialog?: string

    @property({ reflect: true, type: Boolean, attribute: 'is-history-view' })
    isHistoryView: boolean = false

    service = new DataSubsetterService()
    controller = new DataSubsetterController(this)
    #authController = new AuthController(this)

    // store the results of collectionQuery in state so that we can watch for changes and update the component accordingly
    @state()
    collectionQueryResult?: TerraDataSubsetter['collectionQuery']['result']

    /**
     * a query to get the collection (UMM-C) record from CMR
     */
    collectionQuery = new QueryController(
        this,
        () => queryCmrCollection(this.collectionEntryId),
        'collectionQueryResult'
    )

    /**
     * a query to get the capabilities for the collection from Harmony.
     * This includes information about available output formats, subsetting options, and more.
     */
    capabilitiesQuery = new QueryController(this, () =>
        queryHarmonyCapabilities(
            this.collectionQuery.result?.data?.meta['concept-id'],
            {
                bearerToken: this.bearerToken,
            }
        )
    )

    /**
     * a query to get all variables for the collection
     * we use this to get more detailed variable information than what Harmony gives us in the capabilities query,
     * such as the variable's long name and units
     */
    collectionVariablesQuery = new QueryController(this, () =>
        queryCmrVariables({
            collectionConceptId:
                this.collectionQuery.result?.data?.meta['concept-id'],
        })
    )

    /**
     * a query to get the first granule in this collection
     * we get the first granule for a few things:
     *   - it gives us the true start date of the collection (we can't always trust the temporal extent in the collection metadata)
     *   - it gives us the granule count for the collection
     */
    firstGranuleQuery = new QueryController(this, () =>
        queryCmrGranules({
            collectionEntryId: this.collectionEntryId,
            pageSize: 1,
            sortBy: 'start_date',
            sortDirection: 'asc',
        })
    )

    /**
     * a query to get the last granule in this collection
     * we get the last granule to get the true end date of the collection (we can't always trust the temporal extent in the collection metadata)
     */
    lastGranuleQuery = new QueryController(this, () =>
        queryCmrGranules({
            collectionEntryId: this.collectionEntryId,
            pageSize: 1,
            sortBy: 'start_date',
            sortDirection: 'desc',
        })
    )

    /**
     * For Giovanni-enabled collections, this query will return the list of variables that are configured for Giovanni subsetting.
     * This is used to filter the list of variables shown in the variable selection section.
     * TODO: review and remove this one day when Giovanni uses UMM-Var
     */
    giovanniConfiguredVariablesQuery = new QueryController(this, () =>
        queryGiovanniConfiguredVariables()
    )

    @state()
    selectedSubsetOptions: SelectedSubsetOptions = {
        variables: [],
        spatial: null,
        dateRange: { startDate: null, endDate: null },
    }

    @state()
    expandedVariableGroups: Set<string> = new Set()

    @state()
    variableFilterText: string = ''

    @state()
    touchedFields: Set<string> = new Set()

    @state()
    cancelingGetData: boolean = false

    @state()
    selectedTab: 'web-links' | 'selected-params' = 'web-links'

    @state()
    refineParameters: boolean = false

    @state()
    collectionLoading: boolean = false

    @state()
    collectionAccordionOpen: boolean = true

    @state()
    dataAccessMode: 'original' | 'subset' = 'original'

    @state()
    validationError?: string

    @state()
    configuredSubsetOptions?: ConfiguredSubsetOptions

    @query('[part~="spatial-picker"]')
    spatialPicker: TerraSpatialPicker

    @query('terra-dialog')
    dialogElement?: TerraDialog

    // TODO: review and remove if needed
    @watch('collectionQueryResult')
    collectionQueryResultChanged() {
        console.log(this.collectionQueryResult?.data)

        /*
        const { startDate, endDate } = this.#getCollectionDateRange()
        this.selectedDateRange = { startDate, endDate }

        const formats = Array.from(
            new Set(this.capabilitiesQuery.result?.data?.outputFormats || [])
        )

        // Consolidate NetCDF formats - if both exist, only keep netcdf4
        const hasNetcdf4 = formats.includes('application/x-netcdf4')
        const hasNetcdfClassic = formats.includes('application/netcdf')

        let displayFormats = formats
        if (hasNetcdf4 && hasNetcdfClassic) {
            displayFormats = formats.filter(f => f !== 'application/netcdf')
        }

        // auto-select default format
        if (displayFormats.length === 1) {
            this.selectedFormat = displayFormats[0] // only one option
        } else {
            // Prefer NetCDF if available, otherwise first option
            this.selectedFormat =
                displayFormats.find(f => f === 'application/x-netcdf4') ||
                displayFormats[0]
        }

        this.collectionLoading = false
        this.collectionAccordionOpen = false
        */
    }

    // TODO: review and remove if needed
    @watch(['granuleMinDate', 'granuleMaxDate'])
    granuleDatesChanged() {
        /*
        const newRange = {
            ...(this.granuleMinDate && { startDate: this.granuleMinDate }),
            ...(this.granuleMaxDate && { endDate: this.granuleMaxDate }),
        }

        if (Object.keys(newRange).length > 0) {
            this.selectedDateRange = {
                ...this.selectedDateRange,
                ...newRange,
            }
        }*/
    }

    @watch(['jobId'], { waitUntilFirstUpdate: true })
    jobIdChanged() {
        if (this.jobId) {
            this.controller.fetchJobByID(this.jobId)
            this.dataAccessMode = 'subset'
        }
    }

    @watch(['shortName', 'version'])
    shortNameAndVersionChanged() {
        if (this.shortName && this.version) {
            this.collectionEntryId = `${this.shortName}_${this.version}`
        }
    }

    firstUpdated() {
        if (this.jobId) {
            this.controller.fetchJobByID(this.jobId)
            this.dataAccessMode = 'subset'
        }

        this.renderHistoryPanel()

        this.collectionQuery.result?.data
    }

    updated(changedProps: Map<string, unknown>) {
        super.updated(changedProps)

        const taskStatus = this.controller?.jobStatusTask?.status

        // Check if task has an error and handle it
        if (taskStatus === TaskStatus.ERROR) {
            const taskError = this.controller?.jobStatusTask?.error
            if (taskError) {
                // Extract error information using the utility
                const errorDetails = extractHarmonyError(taskError)

                // Don't show errors for user-initiated cancellations
                if (errorDetails.isCancellation) {
                    return
                }

                // Set the job to failed state with the error message
                if (this.controller.currentJob) {
                    this.controller.currentJob = {
                        ...this.controller.currentJob,
                        status: Status.FAILED,
                        message:
                            errorDetails.message || 'Failed to create subset job',
                    }
                }
            }
        }
    }

    // TODO: review and replace
    @watch('selectedFormat')
    selectedFormatChanged() {
        /*
        // When switching to Giovanni format, keep only the first selected variable
        if (this.#isGiovanniFormat() && this.selectedVariables.length > 1) {
            this.selectedVariables = [this.selectedVariables[0]]
        }*/
    }

    showDialog() {
        this.dialogElement?.show()
    }

    render() {
        const collection = this.collectionQuery.result?.data
        const capabilities = this.capabilitiesQuery.result?.data

        const showJobStatus = this.controller.currentJob && !this.refineParameters
        const showTabs = !this.isHistoryView && capabilities?.services?.length
        const title = collection?.umm.EntryTitle ?? 'Download Data'

        const isError =
            this.capabilitiesQuery.result?.isError ||
            this.collectionQuery.result?.isError

        const content = html`
            <div class="container">
                ${!this.dialog
                    ? html`
                          <div class="header">
                              <h1>
                                  <svg
                                      class="download-icon"
                                      viewBox="0 0 24 24"
                                      fill="currentColor"
                                  >
                                      <path
                                          d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"
                                      />
                                  </svg>
                                  ${title}
                              </h1>
                          </div>
                      `
                    : nothing}
                ${showTabs
                    ? html`
                          <div class="section">
                              ${accessModeTabs({
                                  mode: this.dataAccessMode,
                                  onModeChange: (mode: 'original' | 'subset') =>
                                      (this.dataAccessMode = mode),
                              })}
                          </div>
                      `
                    : nothing}
                ${this.dataAccessMode === 'original'
                    ? this.#renderDataAccessMode()
                    : showJobStatus
                      ? this.#renderJobStatus()
                      : this.#renderSubsetOptions()}
            </div>
        `

        if (!capabilities) {
            if (isError) {
                return html`
                    <terra-alert open variant="danger" appearance="white">
                        ${this.collectionQuery.result?.error?.message ||
                        this.capabilitiesQuery.result?.error?.message ||
                        'An unknown error occurred while loading the collection, please try again later.'}
                    </terra-alert>
                `
            }
        }

        if (this.dialog) {
            // rendering subsetter in a dialog
            return this.#renderSubsetterInDialog(title, content)
        } else {
            // rendering subsetter inline
            return content
        }
    }

    #renderSubsetterInDialog(title: string, content: TemplateResult) {
        return html`
            <terra-dialog id=${this.dialog} style="--title-font-size: 16px;">
                <span
                    slot="label"
                    style="display: flex; align-items: center; gap: 8px; color: #0066cc; font-weight: 600;"
                >
                    <svg
                        class="download-icon"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        style="width: 16px; height: 16px; display: inline-block; vertical-align: middle; flex-shrink: 0;"
                    >
                        <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
                    </svg>
                    ${title}
                </span>

                ${content} ${this.#renderFooterForDialog()}
            </terra-dialog>
        `
    }

    #renderDataAccessMode() {
        const collection = this.collectionQuery.result?.data

        return html`
            <!-- Data Access Mode -->
            <div class="section">
                <terra-data-access
                    short-name=${this.shortName ?? collection?.umm.ShortName}
                    version=${this.version ?? collection?.umm.Version}
                    ?footer-slot=${!!this.dialog}
                >
                    ${this.dialog
                        ? html`
                              <div slot="footer" style="margin-top: 15px;">
                                  <slot name="data-access-footer"></slot>
                              </div>
                          `
                        : nothing}
                </terra-data-access>
            </div>
        `
    }

    #renderFooterForDialog() {
        const showJobStatus = this.controller.currentJob && !this.refineParameters

        if (showJobStatus && this.controller.currentJob) {
            // Job status footer - return the footer content with slot="footer"
            return html`
                <div slot="footer" class="footer">
                    ${this.controller.currentJob.status === Status.SUCCESSFUL ||
                    this.controller.currentJob.status === Status.COMPLETE_WITH_ERRORS
                        ? html`
                              <div
                                  style="display: flex; align-items: center; gap: 8px;"
                              >
                                  <terra-dropdown
                                      @terra-select=${this.#handleDownloadSelect}
                                  >
                                      <terra-button slot="trigger" caret>
                                          Download Options
                                      </terra-button>
                                      <terra-menu>
                                          <terra-menu-item value="file-list">
                                              <svg
                                                  slot="prefix"
                                                  viewBox="0 0 24 24"
                                                  width="16"
                                                  height="16"
                                                  style="width: 16px; height: 16px;"
                                              >
                                                  <path
                                                      fill="currentColor"
                                                      d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"
                                                  />
                                              </svg>
                                              File List
                                          </terra-menu-item>
                                          <terra-menu-item value="python-script">
                                              <svg
                                                  slot="prefix"
                                                  viewBox="0 0 128 128"
                                                  width="16"
                                                  height="16"
                                                  style="width: 16px; height: 16px;"
                                              >
                                                  <path
                                                      fill="currentColor"
                                                      d="M49.33 62h29.159C86.606 62 93 55.132 93 46.981V19.183c0-7.912-6.632-13.856-14.555-15.176-5.014-.835-10.195-1.215-15.187-1.191-4.99.023-9.612.448-13.805 1.191C37.098 6.188 35 10.758 35 19.183V30h29v4H23.776c-8.484 0-15.914 5.108-18.237 14.811-2.681 11.12-2.8 17.919 0 29.53C7.614 86.983 12.569 93 21.054 93H31V79.952C31 70.315 39.428 62 49.33 62zm-1.838-39.11c-3.026 0-5.478-2.479-5.478-5.545 0-3.079 2.451-5.581 5.478-5.581 3.015 0 5.479 2.502 5.479 5.581-.001 3.066-2.465 5.545-5.479 5.545zm74.789 25.921C120.183 40.363 116.178 34 107.682 34H97v12.981C97 57.031 88.206 65 78.489 65H49.33C41.342 65 35 72.326 35 80.326v27.8c0 7.91 6.745 12.564 14.462 14.834 9.242 2.717 17.994 3.208 29.051 0C85.862 120.831 93 116.549 93 108.126V97H64v-4h43.682c8.484 0 11.647-5.776 14.599-14.66 3.047-9.145 2.916-17.799 0-29.529zm-41.955 55.606c3.027 0 5.479 2.479 5.479 5.547 0 3.076-2.451 5.579-5.479 5.579-3.015 0-5.478-2.502-5.478-5.579 0-3.068 2.463-5.547 5.478-5.547z"
                                                  ></path>
                                              </svg>
                                              Python Script
                                          </terra-menu-item>
                                          <terra-menu-item value="earthdata-download">
                                              <svg
                                                  slot="prefix"
                                                  viewBox="0 0 64 64"
                                                  fill="none"
                                                  width="16"
                                                  height="16"
                                                  style="width: 16px; height: 16px;"
                                              >
                                                  <circle
                                                      cx="32"
                                                      cy="32"
                                                      r="28"
                                                      fill="currentColor"
                                                  />
                                                  <path
                                                      d="M32 14v26M32 40l-9-9M32 40l9-9"
                                                      stroke="#fff"
                                                      stroke-width="4"
                                                      stroke-linecap="round"
                                                      stroke-linejoin="round"
                                                      fill="none"
                                                  />
                                              </svg>
                                              Earthdata Download
                                          </terra-menu-item>
                                      </terra-menu>
                                  </terra-dropdown>

                                  <!--
                                  <terra-button
                                      outline
                                      @click=${() =>
                                      this.#handleJupyterNotebookClick()}
                                  >
                                      <terra-icon
                                          name="outline-code-bracket"
                                          library="heroicons"
                                          font-size="1.5em"
                                          style="margin-right: 5px;"
                                      ></terra-icon>
                                      Open in Jupyter Notebook
                                  </terra-button>
                                    -->
                              </div>
                          `
                        : nothing}
                    ${this.controller.currentJob.status === 'running'
                        ? html`<button
                              class="btn btn-success"
                              @click=${this.#cancelJob}
                              ?disabled=${this.cancelingGetData}
                          >
                              ${this.cancelingGetData
                                  ? 'Canceling...'
                                  : 'Cancel request'}
                          </button>`
                        : nothing}

                    <div class="job-info">
                        Job ID:
                        <span class="job-id">
                            ${this.bearerToken
                                ? html`<a
                                      href="https://harmony.earthdata.nasa.gov/jobs/${this
                                          .controller.currentJob.jobID}"
                                      target="_blank"
                                      >${this.controller.currentJob.jobID}</a
                                  >`
                                : this.controller.currentJob.jobID}
                        </span>
                        <span class="info-icon">?</span>
                    </div>
                </div>
            `
        } else if (this.dataAccessMode === 'subset') {
            // Get Data footer
            return html`
                <div slot="footer" class="footer">
                    <button class="btn btn-secondary">Reset All</button>
                    <div>
                        <button class="btn btn-primary" @click=${this.#getData}>
                            Get Data
                        </button>
                            ${
                                this.jobId
                                    ? html`
                                          <terra-button
                                              variant="default"
                                              @click=${this.#viewRunningJob}
                                          >
                                              View Running Job
                                          </terra-button>
                                      `
                                    : nothing
                            }
                            </div>
                        </div>
                    </div>
                </div>
            `
        }

        return nothing
    }

    minimizeDialog() {
        this.closest('terra-dialog')?.hide()
    }

    #renderSizeInfo(estimates: { days: number; links: number }) {
        if (
            !this.#authController.state.isLoading &&
            !this.#authController.state.user
        ) {
            return html`
                <div class="size-info warning">
                    <terra-login>
                        <h2 slot="logged-out">Limited access as a guest.</h2>

                        <p slot="logged-out">
                            Your results will be capped at 10 links. Log in for full
                            access to all data.
                        </p>
                    </terra-login>
                </div>
            `
        }

        return html`<div
            class="size-info ${estimates.links >= 150 ? 'warning' : 'neutral'}"
        >
            <h2>Estimated size of results</h2>
            <div class="size-stats">
                ${estimates.days.toLocaleString()} days,
                ${estimates.links.toLocaleString()} links
            </div>
            ${estimates.links >= 150
                ? html`<div class="size-warning">
                      You are about to retrieve ${estimates.links.toLocaleString()}
                      file links from the archive. You may
                      <strong>speed up the request</strong> by limiting the scope of
                      your search.
                  </div>`
                : nothing}
        </div>`
    }

    #renderSubsetOptions() {
        const configuredSubsetOptions = this.service.getConfiguredSubsetOptions(
            this.selectedSubsetOptions,
            this.firstGranuleQuery.result?.data,
            this.lastGranuleQuery.result?.data,
            this.capabilitiesQuery.result?.data,
            this.collectionQuery.result?.data
        )

        // Store in state so other render methods can access it
        this.configuredSubsetOptions = configuredSubsetOptions

        console.log(configuredSubsetOptions)

        const estimates = configuredSubsetOptions.estimatedJobSize
        const hasSubsetOption =
            configuredSubsetOptions.spatialSubsetting.enabled ||
            configuredSubsetOptions.temporalSubsetting.enabled ||
            configuredSubsetOptions.variableSubsetting.enabled
        const collection = this.collectionQuery.result?.data
        const capabilities = this.capabilitiesQuery.result?.data
        const temporalExtents = collection?.umm.TemporalExtents
        const spatialExtent = collection?.umm.SpatialExtent

        const showTemporalSection = temporalExtents && temporalExtents.length
        const showSpatialSection =
            spatialExtent &&
            spatialExtent.HorizontalSpatialDomain?.Geometry?.BoundingRectangles

        return html`
            ${this.dataAccessMode === 'original'
                ? nothing
                : hasSubsetOption
                  ? html`
                        ${hasSubsetOption && estimates
                            ? this.#renderSizeInfo(estimates)
                            : nothing}
                        ${capabilities?.outputFormats?.length && hasSubsetOption
                            ? html`
                                  <div class="section">
                                      <h2 class="section-title">Output Format</h2>

                                      ${this.#renderOutputFormatSelection()}
                                  </div>
                              `
                            : nothing}
                        <div class="section">
                            <h2 class="section-title">Subset Options</h2>
                            <p style="color: #666; margin-bottom: 16px;">
                                Generate file links that support spatial subsetting,
                                date/time range selection, and variable selection.
                            </p>

                            ${capabilities?.temporalSubset
                                ? this.#renderDateRangeSelection()
                                : nothing}
                            ${this.#hasSpatialSubset()
                                ? this.#renderSpatialSelection()
                                : nothing}
                            ${capabilities?.variableSubset
                                ? this.#renderVariableSelection()
                                : nothing}
                        </div>
                    `
                  : html`
                        ${showTemporalSection && !capabilities?.temporalSubset
                            ? this.#renderAvailableTemporalRangeSection()
                            : nothing}
                        ${showSpatialSection && !this.#hasSpatialSubset()
                            ? this.#renderAvailableSpatialRangeSection()
                            : nothing}
                    `}
            ${!hasSubsetOption && estimates
                ? html`
                      <div
                          class="neutral-info"
                          style="margin-top: 24px; padding: 16px 20px; border-radius: 6px; background: #f8f9fa; color: #555; border: 1px solid #ccc;"
                      >
                          <strong>Estimated result size:</strong><br />
                          Your request will return approximately
                          <b>${estimates.links.toLocaleString()}</b> files covering
                          <b>${estimates.days.toLocaleString()}</b> days.
                      </div>
                  `
                : nothing}
            ${this.dataAccessMode === 'subset' && !this.dialog
                ? html`
                      <div class="footer">
                          <button class="btn btn-secondary">Reset All</button>
                          <div>
                          <button
                              class="btn btn-primary"
                              @click=${this.#getData}
                          >
                              Get Data
                          </button>
                                  ${
                                      this.jobId
                                          ? html`
                                                <terra-button
                                                    variant="default"
                                                    @click=${this.#viewRunningJob}
                                                >
                                                    View Running Job
                                                </terra-button>
                                            `
                                          : nothing
                                  }
                              </div>
                                </div>
                          </div>
                      </div>
                  `
                : nothing}
        `
    }

    #renderOutputFormatSelection() {
        // TODO: refactor component to use output formats from individual services, then each service can have a map of output format friendly names
        const hasGiovanniService = this.capabilitiesQuery.result?.data?.services.some(
            s => s.name.indexOf('giovanni') !== -1
        )

        return html`
            <terra-accordion>
                <div slot="summary">
                    <span class="accordion-title">File Format:</span>
                </div>

                <div
                    slot="summary-right"
                    style="display: flex; align-items: center; gap: 10px;"
                >
                    <span
                        >${getFriendlyNameForMimeType(
                            this.selectedSubsetOptions.format ?? '',
                            hasGiovanniService
                        )}</span
                    >

                    <button class="reset-btn" @click=${this.#resetFormatSelection}>
                        Reset
                    </button>
                </div>

                <div class="accordion-content" style="margin-top: 12px;">
                    ${(() => {
                        const allFormats =
                            this.capabilitiesQuery.result?.data?.outputFormats || []
                        const uniqueFormats = Array.from(new Set(allFormats))

                        // Consolidate NetCDF formats - if both exist, only show netcdf4
                        const hasNetcdf4 = uniqueFormats.includes(
                            'application/x-netcdf4'
                        )
                        const hasNetcdfClassic =
                            uniqueFormats.includes('application/netcdf')

                        let displayFormats = uniqueFormats
                        if (hasNetcdf4 && hasNetcdfClassic) {
                            // Both exist - remove netcdf classic, keep netcdf4
                            displayFormats = uniqueFormats.filter(
                                f => f !== 'application/netcdf'
                            )
                        }

                        return displayFormats.map(
                            format => html`
                                <label
                                    style="display: flex; align-items: center; gap: 8px; padding: 5px;"
                                >
                                    <input
                                        type="radio"
                                        name="output-format"
                                        value="${format}"
                                        .checked=${this.selectedSubsetOptions
                                            .format === format}
                                        @change=${() =>
                                            (this.selectedSubsetOptions.format =
                                                format)}
                                    />
                                    ${getFriendlyNameForMimeType(
                                        format,
                                        hasGiovanniService
                                    )}
                                </label>
                            `
                        )
                    })()}
                </div>
            </terra-accordion>
        `
    }

    #renderDateRangeSelection() {
        const { startDate: defaultStartDate, endDate: defaultEndDate } =
            this.#getCollectionDateRange()

        const startDate =
            this.selectedSubsetOptions.dateRange?.startDate ??
            this.configuredSubsetOptions?.temporalSubsetting?.granuleMinDate ??
            defaultStartDate
        const endDate =
            this.selectedSubsetOptions.dateRange?.endDate ??
            this.configuredSubsetOptions?.temporalSubsetting?.granuleMaxDate ??
            defaultEndDate
        const showError =
            this.touchedFields.has('date') &&
            (!this.selectedSubsetOptions.dateRange?.startDate ||
                !this.selectedSubsetOptions.dateRange?.endDate)

        return html`
            <terra-accordion>
                <div slot="summary">
                    <span class="accordion-title">Refine Date Range:</span>
                </div>

                <div
                    slot="summary-right"
                    style="display: flex; align-items: center; gap: 10px;"
                >
                    ${showError
                        ? html`<span class="accordion-value error"
                              >Please select a date range</span
                          >`
                        : this.touchedFields.has('date') && startDate && endDate
                          ? html`<span class="accordion-value"
                                >${startDate} to ${endDate}</span
                            >`
                          : nothing}
                    <button class="reset-btn" @click=${this.#resetDateRangeSelection}>
                        Reset
                    </button>
                </div>

                <div style="width: 300px">
                    <terra-date-picker
                        allow-input
                        inline
                        range
                        split-inputs
                        show-presets
                        ?enable-time=${this.configuredSubsetOptions
                            ?.temporalSubsetting?.timePickerEnabled}
                        start-label="Start Date"
                        end-label="End Date"
                        .minDate=${this.configuredSubsetOptions?.temporalSubsetting
                            ?.granuleMinDate ?? defaultStartDate}
                        .maxDate=${this.configuredSubsetOptions?.temporalSubsetting
                            ?.granuleMaxDate ?? defaultEndDate}
                        .startDate=${this.selectedSubsetOptions.dateRange
                            ?.startDate ??
                        this.configuredSubsetOptions?.temporalSubsetting
                            ?.granuleMinDate}
                        .endDate=${this.selectedSubsetOptions.dateRange?.endDate ??
                        this.configuredSubsetOptions?.temporalSubsetting
                            ?.granuleMaxDate}
                        .useEndOfDay=${this.#isGiovanniFormat() ? false : true}
                        @terra-date-range-change=${this.#handleDateChange}
                    ></terra-date-picker>
                </div>

                <div
                    style="display: flex; gap: 16px; margin-top: 15px; color: #31708f;"
                >
                    <span
                        ><strong>Available Range:</strong> ${defaultStartDate} to
                        ${defaultEndDate}</span
                    >
                    ${this.configuredSubsetOptions?.temporalSubsetting
                        ?.timePickerEnabled
                        ? html`<span
                              ><strong>Note:</strong> All dates and times are in
                              UTC.</span
                          >`
                        : nothing}
                </div>
            </terra-accordion>
        `
    }

    #handleDateChange = (e: TerraDateRangeChangeEvent) => {
        this.#markFieldTouched('date')
        this.selectedSubsetOptions = {
            ...this.selectedSubsetOptions,
            dateRange: {
                startDate: e.detail.startDate,
                endDate: e.detail.endDate,
            },
        }
    }

    #resetDateRangeSelection = () => {
        this.selectedSubsetOptions = {
            ...this.selectedSubsetOptions,
            dateRange: { startDate: null, endDate: null },
        }
    }

    #resetFormatSelection = () => {
        // Reset to NetCDF if available, otherwise first available format from collection, or fall back to default
        if (this.capabilitiesQuery.result?.data?.outputFormats?.length) {
            const netcdfFormat =
                this.capabilitiesQuery.result.data.outputFormats.find(
                    format =>
                        format === 'application/x-netcdf4' ||
                        format === 'application/netcdf'
                )
            this.selectedSubsetOptions = {
                ...this.selectedSubsetOptions,
                format:
                    netcdfFormat ||
                    this.capabilitiesQuery.result.data.outputFormats[0],
            }
        } else {
            this.selectedSubsetOptions = {
                ...this.selectedSubsetOptions,
                format: defaultSubsetFileMimeType,
            }
        }
    }

    // TODO: remove this
    #getCollectionDateRange() {
        return this.service.getEffectiveDateRange(
            this.firstGranuleQuery.result?.data,
            this.lastGranuleQuery.result?.data,
            this.collectionQuery.result?.data
        )
    }

    #handleRegionAccordionToggle() {
        // sometimes the map will show up kind of wonky when it's in an accordion
        // this makes sure it resets itself if that occurs
        this.spatialPicker?.invalidateSize()
    }

    isLatLng(value: any): value is LatLng {
        return value && typeof value.lat === 'number' && typeof value.lng === 'number'
    }

    isLatLngBounds(value: any): value is LatLngBounds {
        return (
            value &&
            typeof value.getSouthWest === 'function' &&
            typeof value.getNorthEast === 'function'
        )
    }

    #renderSpatialSelection() {
        const showError =
            this.touchedFields.has('spatial') && !this.selectedSubsetOptions.spatial
        let boundingRects: any =
            this.collectionQuery.result?.data?.umm.SpatialExtent
                ?.HorizontalSpatialDomain?.Geometry?.BoundingRectangles

        if (boundingRects && !Array.isArray(boundingRects)) {
            boundingRects = [boundingRects]
        }

        let spatialString = ''

        // convert spatial to string
        if (this.isLatLng(this.selectedSubsetOptions.spatial)) {
            spatialString = `${this.selectedSubsetOptions.spatial.lat}, ${this.selectedSubsetOptions.spatial.lng}`
        } else if (this.isLatLngBounds(this.selectedSubsetOptions.spatial)) {
            spatialString = `${this.selectedSubsetOptions.spatial.getSouthWest().lat}, ${this.selectedSubsetOptions.spatial.getSouthWest().lng}, ${this.selectedSubsetOptions.spatial.getNorthEast().lat}, ${this.selectedSubsetOptions.spatial.getNorthEast().lng}`
        } else if (
            this.selectedSubsetOptions.spatial &&
            'w' in this.selectedSubsetOptions.spatial &&
            's' in this.selectedSubsetOptions.spatial &&
            'e' in this.selectedSubsetOptions.spatial &&
            'n' in this.selectedSubsetOptions.spatial
        ) {
            spatialString = `${this.selectedSubsetOptions.spatial.w}, ${this.selectedSubsetOptions.spatial.s}, ${this.selectedSubsetOptions.spatial.e}, ${this.selectedSubsetOptions.spatial.n}`
        } else if (
            this.selectedSubsetOptions.spatial &&
            typeof this.selectedSubsetOptions.spatial === 'string'
        ) {
            spatialString = this.selectedSubsetOptions.spatial
        }

        return html`
            <terra-accordion
                @terra-accordion-toggle=${this.#handleRegionAccordionToggle}
            >
                <div slot="summary">
                    <span class="accordion-title">Refine Region:</span>
                </div>

                <div
                    slot="summary-right"
                    style="display: flex; align-items: center; gap: 10px;"
                >
                    ${showError
                        ? html`<span class="accordion-value error"
                              >Please select a region</span
                          >`
                        : spatialString
                          ? html`<span class="accordion-value"
                                >${spatialString}</span
                            >`
                          : nothing}
                    <button class="reset-btn" @click=${this.#resetSpatialSelection}>
                        Reset
                    </button>
                </div>
                <div class="accordion-content">
                    <terra-spatial-picker
                        part="spatial-picker"
                        inline
                        hide-label
                        hide-point-selection
                        no-world-wrap
                        .spatialConstraints=${this.configuredSubsetOptions
                            ?.spatialSubsetting?.spatialConstraints?.coordinatesStr ||
                        '-180, -90, 180, 90'}
                        .initialValue=${spatialString}
                        @terra-map-change=${this.#handleSpatialChange}
                    ></terra-spatial-picker>
                    <div
                        style="display: flex; gap: 16px; margin-top: 15px; color: #31708f;"
                    >
                        <span
                            ><strong>Available Range:</strong> ${this
                                .configuredSubsetOptions?.spatialSubsetting
                                ?.spatialConstraints?.coordinatesStr}</span
                        >
                    </div>
                </div>
            </terra-accordion>
        `
    }

    #handleSpatialChange = (e: TerraMapChangeEvent) => {
        this.#markFieldTouched('spatial')
        const round2 = (n: number) => parseFloat(Number(n).toFixed(2))

        if (e.detail.type === MapEventType.BBOX) {
            this.selectedSubsetOptions = {
                ...this.selectedSubsetOptions,
                spatial: {
                    e: round2(e.detail.bounds.getNorthEast().lng),
                    n: round2(e.detail.bounds.getNorthEast().lat),
                    w: round2(e.detail.bounds.getSouthWest().lng),
                    s: round2(e.detail.bounds.getSouthWest().lat),
                },
            }
        } else if (e.detail.type === MapEventType.POINT) {
            this.selectedSubsetOptions = {
                ...this.selectedSubsetOptions,
                spatial: e.detail.latLng,
            }
        } else {
            this.selectedSubsetOptions = {
                ...this.selectedSubsetOptions,
                spatial: null,
            }
        }
    }

    #resetSpatialSelection = () => {
        this.selectedSubsetOptions = {
            ...this.selectedSubsetOptions,
            spatial: null,
        }
    }

    #renderVariableSelection() {
        const variables = this.capabilitiesQuery.result?.data?.variables || []
        const giovanniError =
            this.touchedFields.has('variables') && this.#getGiovanniValidationError()
        const basicError =
            this.touchedFields.has('variables') &&
            (this.selectedSubsetOptions.variables?.length ?? 0) === 0
        const showError = giovanniError || basicError
        const errorMessage =
            giovanniError || (basicError ? 'Please select at least one variable' : '')

        const tree = this.#buildVariableTree(variables)
        const allGroups = this.#getAllGroupPaths(tree)
        const allExpanded =
            allGroups.length > 0 &&
            allGroups.every(g => this.expandedVariableGroups.has(g))

        return html`
            <terra-accordion>
                <div slot="summary">
                    <span class="accordion-title">Select Variables:</span>
                </div>
                <div
                    slot="summary-right"
                    style="display: flex; align-items: center; gap: 10px;"
                >
                    ${showError
                        ? html`<span class="accordion-value error"
                              >${errorMessage}</span
                          >`
                        : (this.selectedSubsetOptions.variables?.length ?? 0) > 0
                          ? html`<span class="accordion-value"
                                >${this.selectedSubsetOptions.variables?.length}
                                selected</span
                            >`
                          : nothing}

                    <button class="reset-btn" @click=${this.#resetVariableSelection}>
                        Reset
                    </button>
                </div>
                <div class="accordion-content">
                    <terra-input
                        label="Filter variables"
                        placeholder="Search by variable name..."
                        .value=${this.variableFilterText}
                        @input=${(e: Event) => {
                            const input = e.target as HTMLInputElement
                            this.variableFilterText = input.value
                            this.#handleVariableFilterChange()
                        }}
                        style="margin-bottom: 10px;"
                    ></terra-input>
                    <button
                        class="reset-btn"
                        style="margin-bottom: 10px;"
                        @click=${() => this.#toggleExpandCollapseAll(tree)}
                    >
                        ${allExpanded ? 'Collapse Tree' : 'Expand Tree'}
                    </button>

                    ${this.#isGiovanniFormat() &&
                    this.giovanniConfiguredVariablesQuery.result?.data
                        ? html`
                              <terra-alert
                                  open
                                  appearance="white"
                                  style="margin: 10px 0"
                              >
                                  <terra-icon
                                      slot="icon"
                                      name="outline-information-circle"
                                      library="heroicons"
                                  ></terra-icon>
                                  Only certain variables are supported for the
                                  selected output format. (Giovanni service)
                              </terra-alert>
                          `
                        : nothing}
                    ${variables.length === 0
                        ? html`<p style="color: #666; font-style: italic;">
                              No variables available for this collection.
                          </p>`
                        : this.#renderVariableTree(
                              this.#filterVariableTree(tree),
                              []
                          )}
                </div>
            </terra-accordion>
        `
    }

    #filterVariableTree(tree: Record<string, any>): Record<string, any> {
        if (!this.variableFilterText.trim()) {
            return tree
        }

        const filterText = this.variableFilterText.toLowerCase().trim()

        const filterNode = (node: Record<string, any>): Record<string, any> => {
            const result: Record<string, any> = {}
            for (const [key, value] of Object.entries(node)) {
                if (value.__isLeaf) {
                    // Check if variable name matches filter
                    const variableName = value.__variable.name.toLowerCase()
                    if (variableName.includes(filterText)) {
                        result[key] = value
                    }
                } else {
                    // Recursively filter children
                    const filteredChildren = filterNode(value.__children)
                    // Include group if it has matching children or if group name matches
                    if (
                        Object.keys(filteredChildren).length > 0 ||
                        key.toLowerCase().includes(filterText)
                    ) {
                        result[key] = {
                            ...value,
                            __children: filteredChildren,
                        }
                    }
                }
            }
            return result
        }

        return filterNode(tree)
    }

    #handleVariableFilterChange() {
        if (!this.variableFilterText.trim()) {
            return
        }

        const variables = this.capabilitiesQuery.result?.data?.variables || []
        const tree = this.#buildVariableTree(variables)
        const filterText = this.variableFilterText.toLowerCase().trim()

        // Find all groups that contain matching variables and auto-expand them
        const groupsToExpand = new Set<string>()

        const findMatchingGroups = (
            node: Record<string, any>,
            path: string[] = []
        ) => {
            for (const [key, value] of Object.entries(node)) {
                if (value.__isLeaf) {
                    const variableName = value.__variable.name.toLowerCase()
                    if (variableName.includes(filterText)) {
                        // Add all parent groups to the expand set
                        for (let i = 0; i < path.length; i++) {
                            const groupPath = path.slice(0, i + 1).join('/')
                            groupsToExpand.add(groupPath)
                        }
                    }
                } else {
                    const groupPath = [...path, key].join('/')
                    findMatchingGroups(value.__children, [...path, key])
                    // Also check if group name matches
                    if (key.toLowerCase().includes(filterText)) {
                        groupsToExpand.add(groupPath)
                    }
                }
            }
        }

        findMatchingGroups(tree)

        // Update expanded groups
        if (groupsToExpand.size > 0) {
            this.expandedVariableGroups = new Set([
                ...this.expandedVariableGroups,
                ...groupsToExpand,
            ])
        }
    }

    #buildVariableTree(variables: Variable[]): Record<string, any> {
        const collection = this.collectionQuery.result?.data
        let filteredVariables = variables

        if (
            this.#isGiovanniFormat() &&
            this.giovanniConfiguredVariablesQuery.result?.data
        ) {
            const originalCount = variables.length

            filteredVariables = variables.filter(v => {
                // Convert internal format (dots) to Giovanni format (underscores)
                // Example: M2T1NXSLV_5.12.4_CLDPRS -> M2T1NXSLV_5_12_4_CLDPRS
                const shortName = collection?.umm.ShortName
                const version = collection?.umm.Version

                if (!shortName || !version) {
                    return false
                }

                const giovanniVariableName = convertVariableEntryIdToGiovanniFormat(
                    shortName,
                    version,
                    v.name
                )

                const giovanniConfiguredVars = this.giovanniConfiguredVariablesQuery
                    .result?.data as Set<string> | undefined
                return giovanniConfiguredVars?.has(giovanniVariableName) ?? false
            })

            console.log(
                `Filtered ${originalCount - filteredVariables.length} variables for Giovanni format. Showing ${filteredVariables.length} of ${originalCount}.`
            )
        }

        const root: Record<string, any> = {}
        for (const v of filteredVariables) {
            const parts = v.name.split('/')
            let node = root
            for (let i = 0; i < parts.length; i++) {
                const part = parts[i]
                if (!node[part]) node[part] = { __children: {}, __isLeaf: false }
                if (i === parts.length - 1) {
                    node[part].__isLeaf = true
                    node[part].__variable = v
                }
                node = node[part].__children
            }
        }
        return root
    }

    #renderVariableTree(node: Record<string, any>, path: string[]): unknown {
        const isGiovanni = this.#isGiovanniFormat()
        const variableDetails = this.collectionVariablesQuery.result?.data?.items

        return html`
            <div style="margin-left: ${path.length * 20}px;">
                ${Object.entries(node).map(([key, value]: [string, any]) => {
                    const groupPath = [...path, key].join('/')
                    if (value.__isLeaf) {
                        // Leaf node (variable)
                        // Look up the long name from variableDetails
                        const variableDetail = variableDetails?.find(
                            v =>
                                v.umm.Name === value.__variable.name &&
                                v.umm.LongName !== value.__variable.name // if the long name is the same as the variable name, we'll just use the variable name
                        )
                        const variableName = variableDetail?.umm.LongName
                            ? `${key} = ${variableDetail.umm.LongName}${variableDetail.umm.Units && variableDetail.umm.Units !== 'NoUnits' ? ` (${variableDetail.umm.Units})` : ''}`
                            : key
                        return html`
                            <div class="option-row">
                                <label class="checkbox-option">
                                    <input
                                        type="${isGiovanni ? 'radio' : 'checkbox'}"
                                        name="${isGiovanni
                                            ? 'variable-selection'
                                            : ''}"
                                        .checked=${this.selectedSubsetOptions.variables?.some(
                                            (v: Variable) =>
                                                v.name === value.__variable.name
                                        )}
                                        @change=${(e: Event) =>
                                            this.#toggleVariableSelection(
                                                e,
                                                value.__variable
                                            )}
                                    />
                                    <span>${variableName}</span>
                                </label>
                            </div>
                        `
                    } else {
                        // Group node
                        const expanded = this.expandedVariableGroups.has(groupPath)
                        return html`
                            <div class="option-row" style="align-items: flex-start;">
                                <span
                                    style="cursor: pointer; display: flex; align-items: center;"
                                    @click=${() => this.#toggleGroupExpand(groupPath)}
                                >
                                    <terra-icon
                                        library="heroicons"
                                        name="${expanded
                                            ? 'outline-minus-circle'
                                            : 'outline-plus-circle'}"
                                        style="margin-right: 4px;"
                                    ></terra-icon>
                                    <span style="font-weight: 500;">${key}</span>
                                </span>
                            </div>
                            ${expanded
                                ? this.#renderVariableTree(value.__children, [
                                      ...path,
                                      key,
                                  ])
                                : ''}
                        `
                    }
                })}
            </div>
        `
    }

    #getAllGroupPaths(node: Record<string, any>, path: string[] = []): string[] {
        let groups: string[] = []
        for (const [key, value] of Object.entries(node)) {
            if (!value.__isLeaf) {
                const groupPath = [...path, key].join('/')
                groups.push(groupPath)
                groups = groups.concat(
                    this.#getAllGroupPaths(value.__children, [...path, key])
                )
            }
        }
        return groups
    }

    #toggleGroupExpand(groupPath: string) {
        const set = new Set(this.expandedVariableGroups)
        if (set.has(groupPath)) {
            set.delete(groupPath)
        } else {
            set.add(groupPath)
        }
        this.expandedVariableGroups = set
    }

    #toggleExpandCollapseAll(tree: Record<string, any>) {
        const allGroups = this.#getAllGroupPaths(tree)
        const allExpanded =
            allGroups.length > 0 &&
            allGroups.every((g: string) => this.expandedVariableGroups.has(g))
        if (allExpanded) {
            this.expandedVariableGroups = new Set()
        } else {
            this.expandedVariableGroups = new Set(allGroups)
        }
    }

    #toggleVariableSelection(e: Event, variable: Variable) {
        this.#markFieldTouched('variables')
        const checked = (e.target as HTMLInputElement).checked

        if (this.#isGiovanniFormat()) {
            // Radio button behavior for Giovanni - replace selection with only this variable
            if (checked) {
                this.selectedSubsetOptions = {
                    ...this.selectedSubsetOptions,
                    variables: [variable],
                }
            }
        } else {
            // Checkbox behavior for non-Giovanni - allow multiple selections
            if (checked) {
                if (
                    !this.selectedSubsetOptions.variables?.some(
                        v => v.name === variable.name
                    )
                ) {
                    this.selectedSubsetOptions = {
                        ...this.selectedSubsetOptions,
                        variables: [
                            ...(this.selectedSubsetOptions.variables ?? []),
                            variable,
                        ],
                    }
                }
            } else {
                this.selectedSubsetOptions = {
                    ...this.selectedSubsetOptions,
                    variables: (this.selectedSubsetOptions.variables ?? []).filter(
                        v => v.name !== variable.name
                    ),
                }
            }
        }
    }

    #markFieldTouched(field: string) {
        this.touchedFields = new Set(this.touchedFields).add(field)
    }

    #resetVariableSelection = () => {
        this.selectedSubsetOptions = {
            ...this.selectedSubsetOptions,
            variables: [],
        }
    }

    #renderJobStatus() {
        if (!this.controller.currentJob?.jobID) {
            return html`<div class="results-section" id="job-status-section">
                <div
                    style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;"
                >
                    <h2 class="results-title" style="margin: 0;">Results:</h2>
                    ${!this.isHistoryView
                        ? html`
                              <terra-button
                                  variant="default"
                                  size="small"
                                  @click=${this.#backToSubsetOptions}
                              >
                                  ← Back to Subset Options
                              </terra-button>
                          `
                        : nothing}
                </div>

                <div class="progress-container">
                    <div class="progress-text">
                        <span class="spinner"></span>
                        <span class="status-running">Searching for data...</span>
                    </div>

                    <div class="progress-bar">
                        <div class="progress-fill" style="width: 0%"></div>
                    </div>
                </div>

                ${this.#renderJobMessage()}
            </div>`
        }

        return html`
            <div class="results-section" id="job-status-section">
                <div
                    style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;"
                >
                    <h2 class="results-title" style="margin: 0;">Results:</h2>
                    ${!this.isHistoryView
                        ? html`
                              <terra-button
                                  variant="default"
                                  size="small"
                                  @click=${this.#backToSubsetOptions}
                              >
                                  ← Back to Subset Options
                              </terra-button>
                          `
                        : nothing}
                </div>

                ${this.controller.currentJob!.status !== 'canceled' &&
                this.controller.currentJob!.status !== 'failed'
                    ? html` <div class="progress-container">
                          <div class="progress-text">
                              ${this.controller.currentJob!.progress >= 100
                                  ? html`
                                        <span class="status-complete"
                                            >✓ Search complete</span
                                        >
                                    `
                                  : html`
                                        <span class="spinner"></span>
                                        <span class="status-running"
                                            >Searching for data...
                                            (${this.controller.currentJob!
                                                .progress}%)</span
                                        >
                                    `}
                          </div>

                          <div class="progress-bar">
                              <div
                                  class="progress-fill"
                                  style="width: ${this.controller.currentJob!
                                      .progress}%"
                              ></div>
                          </div>
                      </div>`
                    : nothing}

                <div class="search-status">
                    <span class="file-count"
                        >Found ${this.#numberOfFilesFoundEstimate()} files</span
                    >
                    out of estimated
                    <span class="estimated-total"
                        >${this.controller.currentJob!.numInputGranules.toLocaleString()}</span
                    >
                </div>

                ${this.#renderJobMessage()}
                ${this.controller.currentJob!.errors?.length
                    ? html`
                          <terra-accordion>
                              <div slot="summary">
                                  <span
                                      class="accordion-title"
                                      style="color: #dc3545;"
                                      >Errors
                                      (${this.controller.currentJob!.errors
                                          .length})</span
                                  >
                              </div>
                              <div class="accordion-content">
                                  <ul
                                      style="color: #dc3545; font-size: 14px; padding-left: 20px;"
                                  >
                                      ${this.controller.currentJob!.errors.map(
                                          (err: {
                                              url: string
                                              message: string
                                          }) => html`
                                              <li style="margin-bottom: 12px;">
                                                  <a
                                                      href="${err.url}"
                                                      target="_blank"
                                                      style="word-break: break-all; color: #dc3545; text-decoration: underline;"
                                                  >
                                                      ${err.url}
                                                  </a>
                                                  <div style="margin-top: 2px;">
                                                      ${err.message}
                                                  </div>
                                              </li>
                                          `
                                      )}
                                  </ul>
                              </div>
                          </terra-accordion>
                      `
                    : nothing}

                <div class="tabs">
                    <button
                        class="tab ${this.selectedTab === 'web-links'
                            ? 'active'
                            : ''}"
                        @click=${() => (this.selectedTab = 'web-links')}
                    >
                        Web Links
                    </button>

                    ${!this.isHistoryView
                        ? html`
                              <button
                                  class="tab ${this.selectedTab === 'selected-params'
                                      ? 'active'
                                      : ''}"
                                  @click=${() =>
                                      (this.selectedTab = 'selected-params')}
                              >
                                  Selected Parameters
                              </button>
                          `
                        : nothing}
                </div>
                <div
                    id="web-links"
                    class="tab-content ${this.selectedTab === 'web-links'
                        ? 'active'
                        : ''}"
                >
                    ${this.#getDocumentationLinks().length
                        ? html`
                              <div class="documentation-links">
                                  ${this.#getDocumentationLinks().map(
                                      link => html`
                                          <a href="${link.href}" class="doc-link"
                                              >${link.title}</a
                                          >
                                      `
                                  )}
                              </div>
                          `
                        : nothing}

                    <ul class="file-list">
                        ${this.#getDataLinks().map(
                            link => html`
                                <li class="file-item">
                                    <a
                                        href="${link.href}"
                                        class="file-link"
                                        target="_blank"
                                    >
                                        ${link.title}
                                    </a>
                                </li>
                            `
                        )}
                    </ul>
                </div>

                <div
                    id="selected-params"
                    class="tab-content ${this.selectedTab === 'selected-params'
                        ? 'active'
                        : ''}"
                >
                    ${this.#renderSelectedParams()}
                </div>
            </div>

            ${!this.dialog
                ? html`
                      <div class="footer">
                          ${this.controller.currentJob!.status ===
                              Status.SUCCESSFUL ||
                          this.controller.currentJob!.status ===
                              Status.COMPLETE_WITH_ERRORS
                              ? html`
                                    <div
                                        style="display: flex; align-items: center; gap: 8px;"
                                    >
                                        <terra-dropdown
                                            @terra-select=${this
                                                .#handleDownloadSelect}
                                        >
                                            <terra-button slot="trigger" caret>
                                                Download Options
                                            </terra-button>
                                            <terra-menu>
                                                <terra-menu-item value="file-list">
                                                    <svg
                                                        slot="prefix"
                                                        viewBox="0 0 24 24"
                                                        width="16"
                                                        height="16"
                                                        style="width: 16px; height: 16px;"
                                                    >
                                                        <path
                                                            fill="currentColor"
                                                            d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"
                                                        />
                                                    </svg>
                                                    File List
                                                </terra-menu-item>
                                                <terra-menu-item
                                                    value="python-script"
                                                >
                                                    <svg
                                                        slot="prefix"
                                                        viewBox="0 0 128 128"
                                                        width="16"
                                                        height="16"
                                                        style="width: 16px; height: 16px;"
                                                    >
                                                        <path
                                                            fill="currentColor"
                                                            d="M49.33 62h29.159C86.606 62 93 55.132 93 46.981V19.183c0-7.912-6.632-13.856-14.555-15.176-5.014-.835-10.195-1.215-15.187-1.191-4.99.023-9.612.448-13.805 1.191C37.098 6.188 35 10.758 35 19.183V30h29v4H23.776c-8.484 0-15.914 5.108-18.237 14.811-2.681 11.12-2.8 17.919 0 29.53C7.614 86.983 12.569 93 21.054 93H31V79.952C31 70.315 39.428 62 49.33 62zm-1.838-39.11c-3.026 0-5.478-2.479-5.478-5.545 0-3.079 2.451-5.581 5.478-5.581 3.015 0 5.479 2.502 5.479 5.581-.001 3.066-2.465 5.545-5.479 5.545zm74.789 25.921C120.183 40.363 116.178 34 107.682 34H97v12.981C97 57.031 88.206 65 78.489 65H49.33C41.342 65 35 72.326 35 80.326v27.8c0 7.91 6.745 12.564 14.462 14.834 9.242 2.717 17.994 3.208 29.051 0C85.862 120.831 93 116.549 93 108.126V97H64v-4h43.682c8.484 0 11.647-5.776 14.599-14.66 3.047-9.145 2.916-17.799 0-29.529zm-41.955 55.606c3.027 0 5.479 2.479 5.479 5.547 0 3.076-2.451 5.579-5.479 5.579-3.015 0-5.478-2.502-5.478-5.579 0-3.068 2.463-5.547 5.478-5.547z"
                                                        ></path>
                                                    </svg>
                                                    Python Script
                                                </terra-menu-item>
                                                <terra-menu-item
                                                    value="earthdata-download"
                                                >
                                                    <svg
                                                        slot="prefix"
                                                        viewBox="0 0 64 64"
                                                        fill="none"
                                                        width="16"
                                                        height="16"
                                                        style="width: 16px; height: 16px;"
                                                    >
                                                        <circle
                                                            cx="32"
                                                            cy="32"
                                                            r="28"
                                                            fill="currentColor"
                                                        />
                                                        <path
                                                            d="M32 14v26M32 40l-9-9M32 40l9-9"
                                                            stroke="#fff"
                                                            stroke-width="4"
                                                            stroke-linecap="round"
                                                            stroke-linejoin="round"
                                                            fill="none"
                                                        />
                                                    </svg>
                                                    Earthdata Download
                                                </terra-menu-item>
                                            </terra-menu>
                                        </terra-dropdown>

                                        <!--
                                        <terra-button
                                            outline
                                            @click=${() =>
                                            this.#handleJupyterNotebookClick()}
                                        >
                                            <terra-icon
                                                name="outline-code-bracket"
                                                library="heroicons"
                                                font-size="1.5em"
                                                style="margin-right: 5px;"
                                            ></terra-icon>
                                            Open in Jupyter Notebook
                                        </terra-button>
--></div>
                                `
                              : nothing}
                          ${this.controller.currentJob!.status === 'running'
                              ? html`<button
                                    class="btn btn-success"
                                    @click=${this.#cancelJob}
                                    ?disabled=${this.cancelingGetData}
                                >
                                    ${this.cancelingGetData
                                        ? 'Canceling...'
                                        : 'Cancel request'}
                                </button>`
                              : nothing}

                          <div class="job-info">
                              Job ID:
                              <span class="job-id">
                                  ${this.bearerToken
                                      ? html`<a
                                            href="https://harmony.earthdata.nasa.gov/jobs/${this
                                                .controller.currentJob!.jobID}"
                                            target="_blank"
                                            >${this.controller.currentJob!.jobID}</a
                                        >`
                                      : this.controller.currentJob!.jobID}
                              </span>
                              <span class="info-icon">?</span>
                          </div>
                      </div>
                  `
                : nothing}
        `
    }

    #renderSelectedParams() {
        const collection = this.collectionQuery.result?.data
        const variables =
            (this.selectedSubsetOptions.variables?.length ?? 0) > 0
                ? this.selectedSubsetOptions.variables!.map(v => v.name)
                : ['All']
        const dateRange =
            this.selectedSubsetOptions.dateRange?.startDate &&
            this.selectedSubsetOptions.dateRange?.endDate
                ? `${this.selectedSubsetOptions.dateRange.startDate} to ${this.selectedSubsetOptions.dateRange.endDate}`
                : '—'
        let spatial = '—'

        if (this.selectedSubsetOptions.spatial) {
            if ('w' in this.selectedSubsetOptions.spatial) {
                spatial = `Bounding Box: ${this.selectedSubsetOptions.spatial.w}, ${this.selectedSubsetOptions.spatial.s}, ${this.selectedSubsetOptions.spatial.e}, ${this.selectedSubsetOptions.spatial.n}`
            } else if (
                'lat' in this.selectedSubsetOptions.spatial &&
                'lng' in this.selectedSubsetOptions.spatial
            ) {
                spatial = `Point: ${this.selectedSubsetOptions.spatial.lat}, ${this.selectedSubsetOptions.spatial.lng}`
            }
        }

        return html`
            <dl class="params-summary">
                <div>
                    <dt><strong>Dataset</strong></dt>
                    <dd>${collection?.umm.EntryTitle ?? '—'}</dd>
                </div>
                <div>
                    <dt><strong>Variables</strong></dt>
                    <dd>${variables.map((v: string) => html`<div>${v}</div>`)}</dd>
                </div>
                <div>
                    <dt><strong>Date Range</strong></dt>
                    <dd>${dateRange}</dd>
                </div>
                <div>
                    <dt><strong>Spatial</strong></dt>
                    <dd>${spatial}</dd>
                </div>
            </dl>

            <terra-button @click=${this.#refineParameters}
                >Refine Parameters</terra-button
            >
        `
    }

    #cancelJob() {
        this.cancelingGetData = true
        this.controller.cancelCurrentJob()
    }

    #getData() {
        // Validate before proceeding
        const validationError = this.#getGiovanniValidationError()
        if (validationError) {
            this.validationError = validationError
            this.#markFieldTouched('variables')
            return
        }

        // Clear any previous validation errors
        this.validationError = undefined

        this.cancelingGetData = false
        this.#touchAllFields() // touch all fields, so errors will show if fields are invalid

        // cancel any existing running job
        this.controller.cancelCurrentJob()
        this.controller.currentJob = null

        // Clear the jobId so we can create a new job
        this.jobId = undefined

        this.controller.jobStatusTask.run().then(() => {
            // After job is created, update jobId
            if (this.controller.currentJob?.jobID) {
                this.jobId = this.controller.currentJob.jobID
            }
        })

        // scroll the job-status-section into view
        setTimeout(() => {
            const el = this.renderRoot.querySelector('#job-status-section')
            el?.scrollIntoView({ behavior: 'smooth' })
        }, 100)

        this.refineParameters = false // reset refine parameters, if the user had previously clicked that button
        this.isHistoryView = false // this is a new job being created, not viewing from history
    }

    #touchAllFields() {
        this.touchedFields = new Set(['variables', 'spatial'])
    }

    #numberOfFilesFoundEstimate() {
        return Math.floor(
            (this.controller.currentJob!.numInputGranules *
                this.controller.currentJob!.progress) /
                100
        )
    }

    #getDocumentationLinks() {
        return this.controller.currentJob!.links.filter(
            link => link.rel === 'stac-catalog-json'
        )
    }

    #getDataLinks() {
        return this.controller.currentJob!.links.filter(link => link.rel === 'data')
    }

    #hasSpatialSubset() {
        const capabilities = this.capabilitiesQuery.result?.data

        return capabilities?.bboxSubset || capabilities?.shapeSubset
    }

    #renderJobMessage() {
        const warningStatuses = [
            Status.CANCELED,
            Status.COMPLETE_WITH_ERRORS,
            Status.RUNNING_WITH_ERRORS,
        ]
        const errorStatuses = [Status.FAILED]

        let type = 'normal'
        if (warningStatuses.includes(this.controller.currentJob!.status)) {
            type = 'warning'
        } else if (errorStatuses.includes(this.controller.currentJob!.status)) {
            type = 'error'
        }

        let color, bg
        if (type === 'error') {
            color = '#dc3545'
            bg = '#f8d7da'
        } else if (type === 'warning') {
            color = '#856404'
            bg = '#fff3cd'
        } else {
            color = '#555'
            bg = '#f8f9fa'
        }

        return html`
            <div
                style="
                margin: 24px 0 16px 0;
                padding: 16px 20px;
                border-radius: 6px;
                background: ${bg};
                color: ${color};
                border: 1px solid ${color}22;
            "
            >
                ${this.#getJobMessageText()}
            </div>
        `
    }

    #getJobMessageText() {
        return this.controller.currentJob?.message.replace(
            /\b(The job|the job|job|Job)\b/g,
            match => {
                switch (match) {
                    case 'The job':
                        return 'Your request'
                    case 'the job':
                        return 'Your Request'
                    case 'job':
                        return 'request'
                    case 'Job':
                        return 'Request'
                }
                return match
            }
        )
    }

    #refineParameters() {
        this.refineParameters = true
    }

    #backToSubsetOptions() {
        this.refineParameters = true
        // Scroll to the top of the component
        setTimeout(() => {
            const container = this.renderRoot.querySelector('.container')
            container?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }, 100)
    }

    #viewRunningJob() {
        this.refineParameters = false
        // Scroll to job status section
        setTimeout(() => {
            const el = this.renderRoot.querySelector('#job-status-section')
            el?.scrollIntoView({ behavior: 'smooth' })
        }, 100)
    }

    #handleDownloadSelect(event: TerraSelectEvent) {
        const item = event.detail.item
        const value = item.value || item.getTextLabel()

        if (value === 'file-list') {
            this.#downloadLinksAsTxt(event)
        } else if (value === 'python-script') {
            this.#downloadPythonScript(event)
        } else if (value === 'earthdata-download') {
            this.#downloadEarthdataDownload(event)
        }
    }

    #downloadLinksAsTxt(event: Event) {
        event.stopPropagation()
        if (!this.controller.currentJob?.links) {
            return
        }

        const dataLinks = this.#getDataLinks()

        if (dataLinks.length === 0) {
            return
        }

        const content = dataLinks.map(link => link.href).join('\n')
        const blob = new Blob([content], { type: 'text/plain' })
        const url = URL.createObjectURL(blob)

        // Create a temporary link element and trigger download
        const a = document.createElement('a')
        a.href = url
        a.download = `subset_links_${this.controller.currentJob!.jobID}.txt`
        document.body.appendChild(a)
        a.click()

        document.body.removeChild(a)
        URL.revokeObjectURL(url)
    }

    async #downloadPythonScript(event: Event) {
        event.stopPropagation()
        if (!this.controller.currentJob?.links) {
            return
        }

        const response = await fetch(
            getBasePath('assets/data-subsetter/download_subset_files.py.txt')
        )

        if (!response.ok) {
            alert(
                'Sorry, there was a problem generating the Python script. We are investigating the issue.\nYou could try using the Jupyter Notebook in the meantime'
            )
        }

        const content = (await response.text())
            .replace(/{{jobId}}/gi, this.controller.currentJob!.jobID)
            .replace(
                /{{HARMONY_ENV}}/gi,
                `Environment.${this.environment?.toUpperCase()}`
            )
            .replace(
                /{{EARTHACCESS_ENV}}/gi,
                `earthaccess.${this.environment?.toUpperCase()}`
            )

        const blob = new Blob([content], { type: 'text/plain' })
        const url = URL.createObjectURL(blob)

        // Create a temporary link element and trigger download
        const a = document.createElement('a')
        a.href = url
        a.download = `download_subset_files_${this.controller.currentJob!.jobID}.py`
        document.body.appendChild(a)
        a.click()

        document.body.removeChild(a)
        URL.revokeObjectURL(url)
    }

    async #downloadEarthdataDownload(event: Event) {
        event.stopPropagation()
        if (!this.controller.currentJob?.links) {
            return
        }

        alert('Sorry, Earthdata Download is not currently supported')
    }

    #handleJupyterNotebookClick() {
        const notebook = getNotebook(this)

        console.log('sending data to JupyterLite')

        sendDataToJupyterNotebook('load-notebook', {
            filename: `subset_${this.controller.currentJob?.jobID}.ipynb`,
            notebook,
            bearerToken: this.bearerToken,
        })
    }

    renderHistoryPanel() {
        const existingHistoryPanel = document.querySelector(
            'terra-data-subsetter-history'
        )

        if (!existingHistoryPanel && this.bearerToken) {
            // let's add a history panel to the page
            const historyPanel = document.createElement(
                'terra-data-subsetter-history'
            )

            if (this.bearerToken) {
                historyPanel.setAttribute('bearer-token', this.bearerToken)
            }

            if (this.environment) {
                historyPanel.setAttribute('environment', this.environment)
            }

            document.body.appendChild(historyPanel)
        }
    }

    #renderAvailableTemporalRangeSection() {
        const { startDate, endDate } = this.#getCollectionDateRange()
        if (!startDate || !endDate) return nothing
        return html`
            <div class="section" style="margin-bottom: 16px;">
                <h2 class="section-title">Available Date Range</h2>
                <div style="color: #31708f; margin-top: 8px;">
                    <strong>${startDate}</strong> to <strong>${endDate}</strong>
                </div>
                <div style="font-size: 0.95em; color: #666;">
                    This collection does not support temporal subsetting.
                </div>
            </div>
        `
    }

    #renderAvailableSpatialRangeSection() {
        const collection = this.collectionQuery.result?.data

        const boundingRects =
            collection?.umm.SpatialExtent?.HorizontalSpatialDomain?.Geometry
                ?.BoundingRectangles
        if (!boundingRects || !Array.isArray(boundingRects) || !boundingRects.length)
            return nothing
        return html`
            <div class="section" style="margin-bottom: 16px;">
                <h2 class="section-title">Available Spatial Area</h2>
                <div style="color: #31708f; margin-top: 8px;">
                    ${boundingRects.map(
                        (rect: any) =>
                            html`<div>
                                <strong>Bounding Box:</strong>
                                ${rect.WestBoundingCoordinate},
                                ${rect.SouthBoundingCoordinate},
                                ${rect.EastBoundingCoordinate},
                                ${rect.NorthBoundingCoordinate}
                            </div>`
                    )}
                </div>
                <div style="font-size: 0.95em; color: #666;">
                    This collection does not support spatial subsetting.
                </div>
            </div>
        `
    }

    #isGiovanniFormat(): boolean {
        return (
            this.selectedSubsetOptions.format === 'text/csv' ||
            this.selectedSubsetOptions.format === 'image/tiff'
        )
    }

    #getGiovanniValidationError(): string | null {
        if (!this.#isGiovanniFormat()) {
            return null
        }

        if ((this.selectedSubsetOptions.variables?.length ?? 0) === 0) {
            return 'Please select a variable to subset.'
        }

        if ((this.selectedSubsetOptions.variables?.length ?? 0) > 1) {
            return 'The selected format only supports subsetting one variable at a time.'
        }

        return null
    }
}
