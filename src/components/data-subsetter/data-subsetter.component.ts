import type { CSSResultGroup } from 'lit'
import { html, nothing } from 'lit'
import { property, query, state } from 'lit/decorators.js'
import { AuthController } from '../../auth/auth.controller.js'
import {
    CollectionController,
    type CollectionWithAvailableServices,
} from '../../controllers/collection.controller.js'
import type { TerraDateRangeChangeEvent } from '../../events/terra-date-range-change.js'
import type { TerraMapChangeEvent } from '../../events/terra-map-change.js'
import type { TerraSelectEvent } from '../../events/terra-select.js'
import type { TerraSliderChangeEvent } from '../../events/terra-slider-change.js'
import { debounce } from '../../internal/debounce.js'
import TerraElement from '../../internal/terra-element.js'
import { watch } from '../../internal/watch.js'
import { sendDataToJupyterNotebook } from '../../lib/jupyter.js'
import type { CmrSearchResult } from '../../metadata-catalog/types.js'
import { QueryClientMixin } from '../../mixins/query-client.mixin.js'

import cmrVariableService from '../../services/cmr-variable.service.js'
import componentStyles from '../../styles/component.styles.js'
import { getBasePath } from '../../utilities/base-path.js'
import { convertVariableEntryIdToGiovanniFormat } from '../../utilities/giovanni.js'
import {
    isFeatureEnabled,
    KnownFeatureFlags,
} from '../../utilities/feature-flags.js'
import TerraAccordion from '../accordion/accordion.component.js'
import TerraAlert from '../alert/alert.component.js'
import TerraButton from '../button/button.component.js'
import TerraDataAccess from '../data-access/data-access.component.js'
import TerraDatePicker from '../date-picker/date-picker.component.js'
import TerraDialog from '../dialog/dialog.component.js'
import TerraDropdown from '../dropdown/dropdown.component.js'
import TerraIcon from '../icon/icon.component.js'
import TerraInput from '../input/input.component.js'
import TerraLoader from '../loader/loader.component.js'
import TerraLogin from '../login/login.component.js'
import type { LatLng } from '../map/models/LatLng.js'
import type { LatLngBounds } from '../map/models/LatLngBounds.js'
import { MapEventType } from '../map/type.js'
import TerraMenu from '../menu/menu.component.js'
import TerraMenuItem from '../menu-item/menu-item.component.js'
import TerraSlider from '../slider/slider.component.js'
import TerraSpatialPicker from '../spatial-picker/spatial-picker.component.js'
import styles from './data-subsetter.styles.js'
import { getNotebook } from './notebooks/subsetter-notebook.js'
import { HarmonyRequest } from '../../lib/harmony/harmony.request.js'
import { getUTCDate } from '../../utilities/date.js'
import { HarmonyRequestController } from '../../controllers/harmony-request.controller.js'
import {
    Status,
    type ConfiguredOutputFormat,
    type Variable,
} from '../../apis/harmony.api.js'

const defaultOutputFormat: ConfiguredOutputFormat = {
    key: 'application/x-netcdf4',
    label: 'NetCDF',
    description: 'Download data in NetCDF format',
}

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
        'terra-slider': TerraSlider,
    }

    @property({ reflect: true, attribute: 'collection-entry-id' })
    collectionEntryId?: string

    @property({ reflect: true, attribute: 'short-name' })
    shortName?: string

    @property({ reflect: true, attribute: 'version' })
    version?: string

    @property({
        reflect: true,
        type: Boolean,
        attribute: 'show-collection-search',
    })
    showCollectionSearch?: boolean = true

    @property({ reflect: true, type: Boolean, attribute: 'show-history-panel' })
    showHistoryPanel?: boolean = true

    @property({ reflect: true, attribute: 'job-id' })
    jobId?: string

    @property({ attribute: 'bearer-token' })
    bearerToken?: string

    /**
     * Comma-separated list of feature flags to enable.
     * Features can also be enabled via the `?terra-features=flag1,flag2` URL parameter.
     *
     * Supported flags:
     * - `dimension-subset` — shows the dimension subsetting accordion
     *
     * @example
     * <terra-data-subsetter features="dimension-subset"></terra-data-subsetter>
     */
    @property()
    features?: string

    /**
     * Optional dialog ID. When set, the subsetter will render inside a dialog with this ID.
     */
    @property({ reflect: true }) dialog?: string

    @property({ reflect: true, type: Boolean, attribute: 'is-history-view' })
    isHistoryView: boolean = false

    @state()
    collectionWithServices?: CollectionWithAvailableServices

    @state()
    selectedVariables: Variable[] = []

    @state()
    selectedDimensionIndexes: Record<string, { start: number; end: number }> =
        {}

    @state()
    expandedVariableGroups: Set<string> = new Set()

    @state()
    variableFilterText: string = ''

    @state()
    touchedFields: Set<string> = new Set()

    @state()
    spatialSelection?: LatLng | LatLngBounds

    @state()
    selectedDateRange: { startDate: string | null; endDate: string | null } = {
        startDate: null,
        endDate: null,
    }

    @state()
    selectedFormat: ConfiguredOutputFormat = defaultOutputFormat

    @state()
    cancelingGetData: boolean = false

    @state()
    selectedTab: 'web-links' | 'selected-params' = 'web-links'

    @state()
    refineParameters: boolean = false

    @state()
    collectionSearchType: 'collection' | 'variable' | 'all' = 'all'

    @state()
    collectionSearchQuery?: string

    @state()
    collectionSearchLoading: boolean = false

    @state()
    collectionSearchResults?: Array<CmrSearchResult>

    @state()
    collectionLoading: boolean = false

    @state()
    collectionAccordionOpen: boolean = true

    @state()
    dataAccessMode: 'original' | 'subset' = 'original'

    @state()
    validationError?: string

    @state()
    granuleMinDate?: string

    @state()
    granuleMaxDate?: string

    @state()
    giovanniConfiguredVariables?: Set<string>

    @query('[part~="spatial-picker"]')
    spatialPicker: TerraSpatialPicker

    @query('terra-dialog')
    dialogElement?: TerraDialog

    #collectionController = new CollectionController(this, {
        getCollectionEntryId: () => this.collectionEntryId,
        getBearerToken: () => this.bearerToken,
    })

    #authController = new AuthController(this)
    #harmonyRequestController = new HarmonyRequestController(this)

    @watch(['jobId'], { waitUntilFirstUpdate: true })
    jobIdChanged() {
        if (this.jobId) {
            this.#harmonyRequestController.startPollForJobStatus(this.jobId)
            this.dataAccessMode = 'subset'
        }
    }

    @watch(['shortName', 'version'])
    shortNameAndVersionChanged() {
        if (this.shortName && this.version) {
            this.collectionEntryId = `${this.shortName}_${this.version}`
        }
    }

    @watch('collectionEntryId', { waitUntilFirstUpdate: true })
    collectionEntryIdChanged() {
        if (this.collectionEntryId) {
            this.showCollectionSearch = false
        } else {
            this.showCollectionSearch = true
        }
    }

    firstUpdated() {
        if (this.collectionEntryId) {
            this.showCollectionSearch = false
        }

        if (this.jobId) {
            this.#harmonyRequestController.startPollForJobStatus(this.jobId)
            this.dataAccessMode = 'subset'
        }

        this.renderHistoryPanel()
    }

    updated(changedProps: Map<string, unknown>) {
        super.updated(changedProps)

        // Sync collection data from CollectionController into @state properties so
        // existing @watch decorators fire as before.
        const newCollectionInfo = this.#collectionController.collectionInfo
        if (newCollectionInfo !== this.collectionWithServices) {
            this.collectionWithServices = newCollectionInfo
        }

        const sampling = this.#collectionController.sampling?.data
        if (sampling?.minDate !== this.granuleMinDate) {
            this.granuleMinDate = sampling?.minDate
        }
        if (sampling?.maxDate !== this.granuleMaxDate) {
            this.granuleMaxDate = sampling?.maxDate
        }

        const newGiovanni = this.#collectionController.giovanniVariables
        if (
            newGiovanni.size !== (this.giovanniConfiguredVariables?.size ?? 0)
        ) {
            this.giovanniConfiguredVariables = newGiovanni
        }
    }

    /** True if the collection contains sub-daily granules. Used by DataSubsetterController to format dates. */
    get isSubDaily() {
        return this.#collectionController.isSubDaily
    }

    @watch(['collectionWithServices'])
    collectionChanged() {
        const { startDate, endDate } = this.#getCollectionDateRange()
        this.selectedDateRange = { startDate, endDate }

        this.#resetFormatSelection()

        this.collectionLoading = false
        this.collectionAccordionOpen = false
    }

    @watch(['granuleMinDate', 'granuleMaxDate'])
    granuleDatesChanged() {
        const newRange = {
            ...(this.granuleMinDate && { startDate: this.granuleMinDate }),
            ...(this.granuleMaxDate && { endDate: this.granuleMaxDate }),
        }

        if (Object.keys(newRange).length > 0) {
            this.selectedDateRange = {
                ...this.selectedDateRange,
                ...newRange,
            }
        }
    }

    @watch('selectedFormat')
    selectedFormatChanged() {
        // When switching to Giovanni format, keep only the first selected variable
        if (
            this.selectedFormat.isGiovanniFormat &&
            this.selectedVariables.length > 1
        ) {
            this.selectedVariables = [this.selectedVariables[0]]
        }
    }

    showDialog() {
        this.dialogElement?.show()
    }

    render() {
        const showJobStatus =
            this.#harmonyRequestController.jobId && !this.refineParameters
        const showMinimizeButton = showJobStatus && !!this.dialog
        const title =
            this.collectionWithServices?.collection?.EntryTitle ??
            'Download Data'

        if (!this.collectionWithServices) {
            if (this.#collectionController.hasCapabilitiesError) {
                return html`
                    <terra-alert open variant="danger" appearance="white">
                        Failed to find the requested collection.
                    </terra-alert>
                `
            }
        }

        const content = html`
            <div class="container">
                ${
                    !this.dialog
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

                              ${
                                  showMinimizeButton
                                      ? html`<button
                                        class="minimize-btn"
                                        @click=${() => this.minimizeDialog()}
                                    >
                                        -
                                    </button>`
                                      : nothing
                              }
                          </div>
                      `
                        : nothing
                }
                ${
                    !this.isHistoryView &&
                    this.collectionWithServices?.services?.length
                        ? html`
                          <div class="section">
                              ${this.#renderDataAccessModeSelection()}
                          </div>
                      `
                        : nothing
                }
                ${
                    this.dataAccessMode === 'original'
                        ? html`
                          <div class="section">
                              <terra-data-access
                                  short-name=${
                                      this.shortName ??
                                      this.collectionWithServices?.collection
                                          ?.ShortName
                                  }
                                  version=${
                                      this.version ??
                                      this.collectionWithServices?.collection
                                          ?.Version
                                  }
                                  ?footer-slot=${!!this.dialog}
                              >
                                  ${
                                      this.dialog
                                          ? html`
                                            <div
                                                slot="footer"
                                                style="margin-top: 15px;"
                                            >
                                                <slot
                                                    name="data-access-footer"
                                                ></slot>
                                            </div>
                                        `
                                          : nothing
                                  }
                              </terra-data-access>
                          </div>
                      `
                        : showJobStatus
                          ? this.#renderJobStatus()
                          : this.#renderSubsetOptions()
                }
            </div>
        `

        // If dialog is set, wrap content in dialog with slots for header/footer
        if (this.dialog) {
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
                    ${
                        showMinimizeButton
                            ? html`
                              <button
                                  slot="header-actions"
                                  class="minimize-btn"
                                  @click=${() => this.dialogElement?.hide()}
                                  aria-label="Minimize"
                              >
                                  -
                              </button>
                          `
                            : nothing
                    }
                    <slot name="dialog-header-content"></slot>
                    ${content} ${this.#renderFooterForDialog()}
                </terra-dialog>
            `
        }

        // Otherwise render normally with internal header
        return html`
            <div class="container">
                <div class="header">
                    <h1>
                        <svg
                            class="download-icon"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                        >
                            <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
                        </svg>
                        ${title}
                    </h1>

                    ${
                        showMinimizeButton
                            ? html`<button
                              class="minimize-btn"
                              @click=${() => this.minimizeDialog()}
                          >
                              -
                          </button>`
                            : nothing
                    }
                </div>
                ${
                    !this.isHistoryView &&
                    this.collectionWithServices?.services?.length
                        ? html`
                          <div class="section">
                              ${this.#renderDataAccessModeSelection()}
                          </div>
                      `
                        : nothing
                }
                ${
                    this.dataAccessMode === 'original'
                        ? html`
                          <div class="section">
                              <terra-data-access
                                  short-name=${
                                      this.shortName ??
                                      this.collectionWithServices?.collection
                                          ?.ShortName
                                  }
                                  version=${
                                      this.version ??
                                      this.collectionWithServices?.collection
                                          ?.Version
                                  }
                                  ?footer-slot=${!!this.dialog}
                              >
                                  ${
                                      this.dialog
                                          ? html`
                                            <div
                                                slot="footer"
                                                style="margin-top: 15px;"
                                            >
                                                <slot
                                                    name="data-access-footer"
                                                ></slot>
                                            </div>
                                        `
                                          : nothing
                                  }
                              </terra-data-access>
                          </div>
                      `
                        : showJobStatus
                          ? this.#renderJobStatus()
                          : this.#renderSubsetOptions()
                }
            </div>
        `
    }

    #renderFooterForDialog() {
        const showJobStatus =
            this.#harmonyRequestController.jobId && !this.refineParameters

        if (showJobStatus && this.#harmonyRequestController.jobId) {
            // Job status footer - return the footer content with slot="footer"
            return html`
                <div slot="footer" class="footer">
                    ${
                        this.#harmonyRequestController.status ===
                            Status.SUCCESSFUL ||
                        this.#harmonyRequestController.status ===
                            Status.COMPLETE_WITH_ERRORS
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
                            : nothing
                    }
                    ${
                        this.#harmonyRequestController.status === Status.RUNNING
                            ? html`<button
                              class="btn btn-success"
                              @click=${this.#cancelJob}
                              ?disabled=${this.cancelingGetData}
                          >
                              ${
                                  this.cancelingGetData
                                      ? 'Canceling...'
                                      : 'Cancel request'
                              }
                          </button>`
                            : nothing
                    }

                    <div class="job-info">
                        Job ID:
                        <span class="job-id">
                            ${
                                this.bearerToken
                                    ? html`<a
                                      href="https://harmony.earthdata.nasa.gov/jobs/${
                                          this.#harmonyRequestController.jobId
                                      }"
                                      target="_blank"
                                      >${this.#harmonyRequestController.jobId}</a
                                  >`
                                    : this.#harmonyRequestController.jobId
                            }
                        </span>
                        <span class="info-icon">?</span>
                    </div>
                </div>
            `
        } else if (this.dataAccessMode === 'subset') {
            // Get Data footer
            return html`
                <div slot="footer" class="footer">
                    <button class="btn btn-secondary" @click=${this.#resetAllParameters}>Reset All</button>
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
            ${
                estimates.links >= 150
                    ? html`<div class="size-warning">
                      You are about to retrieve ${estimates.links.toLocaleString()}
                      file links from the archive. You may
                      <strong>speed up the request</strong> by limiting the scope of
                      your search.
                  </div>`
                    : nothing
            }
        </div>`
    }

    #renderSubsetOptions() {
        const estimates = this.#estimateJobSize()
        const hasSubsetOption = this.#hasAtLeastOneSubsetOption()
        const collection = this.collectionWithServices?.collection
        const temporalExtents = collection?.TemporalExtents
        const spatialExtent = collection?.SpatialExtent

        const showTemporalSection = temporalExtents?.length
        const showSpatialSection =
            spatialExtent?.HorizontalSpatialDomain?.Geometry?.BoundingRectangles

        return html`
            ${
                this.dataAccessMode === 'original'
                    ? nothing
                    : hasSubsetOption
                      ? html`
                        ${
                            hasSubsetOption && estimates
                                ? this.#renderSizeInfo(estimates)
                                : nothing
                        }
                        ${
                            this.showCollectionSearch
                                ? html`
                                  <div class="section">
                                      <h2 class="section-title">
                                          Select Data Collection
                                      </h2>

                                      ${this.#renderSearchForCollection()}
                                  </div>
                              `
                                : nothing
                        }
                        ${
                            this.collectionWithServices?.summary.outputFormats
                                ?.length && hasSubsetOption
                                ? html`
                                  <div class="section">
                                      <h2 class="section-title">Output Format</h2>

                                      ${this.#renderOutputFormatSelection()}
                                  </div>
                              `
                                : nothing
                        }
                        <div class="section">
                            <h2 class="section-title">Subset Options</h2>
                            <p style="color: #666; margin-bottom: 16px;">
                                Generate file links that support spatial subsetting,
                                date/time range selection, and variable selection.
                            </p>

                            ${
                                this.collectionWithServices?.summary.subsetting
                                    .temporal
                                    ? this.#renderDateRangeSelection()
                                    : nothing
                            }
                            ${
                                this.#hasSpatialSubset()
                                    ? this.#renderSpatialSelection()
                                    : nothing
                            }
                            ${
                                this.collectionWithServices?.summary.subsetting
                                    .variable
                                    ? this.#renderVariableSelection()
                                    : nothing
                            }
                            ${
                                this.collectionWithServices?.summary.subsetting
                                    .variable &&
                                isFeatureEnabled(
                                    KnownFeatureFlags.DIMENSION_SUBSET,
                                    this.features,
                                )
                                    ? this.#renderDimensionSelection()
                                    : nothing
                            }
                        </div>
                    `
                      : html`
                        ${
                            showTemporalSection &&
                            !this.collectionWithServices?.summary.subsetting
                                .temporal
                                ? this.#renderAvailableTemporalRangeSection()
                                : nothing
                        }
                        ${
                            showSpatialSection && !this.#hasSpatialSubset()
                                ? this.#renderAvailableSpatialRangeSection()
                                : nothing
                        }
                    `
            }
            ${
                !hasSubsetOption && estimates
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
                    : nothing
            }
            ${
                this.dataAccessMode === 'subset' && !this.dialog
                    ? html`
                      <div class="footer">
                          <button class="btn btn-secondary" @click=${this.#resetAllParameters}>Reset All</button>
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
                    : nothing
            }
        `
    }

    #resetAllParameters = () => {
        // Reset variables
        this.selectedVariables = []

        // Reset spatial to collection bounds (not null)
        if (this.#hasSpatialSubset()) {
            this.#resetSpatialSelection()
        }

        // Reset date range
        this.selectedDateRange = {
            startDate: null,
            endDate: null,
        }

        // Clear validation state
        this.touchedFields = new Set()
        this.validationError = undefined

        // Collapse variable tree
        this.expandedVariableGroups = new Set()

        this.requestUpdate()
    }

    #renderSearchForCollection() {
        let placeholder =
            'Search all types of resources (e.g. rainfall, GPM, hurricanes, etc.)'

        if (this.collectionSearchType === 'collection') {
            placeholder = 'Search collections (e.g. AQUA, GPM_3IMERGH, etc.)'
        }

        if (this.collectionSearchType === 'variable') {
            placeholder = 'Search variables (e.g. rainfall, hurricanes, etc.)'
        }

        return html`
            <terra-accordion .open=${this.collectionAccordionOpen}>
                <div slot="summary">
                    <span class="accordion-title">Collection:</span>
                </div>

                <div
                    slot="summary-right"
                    style="display: flex; align-items: center; gap: 10px"
                >
                    ${
                        this.collectionEntryId
                            ? html` <span
                                  class="accordion-value"
                                  id="selected-collection-display"
                                  >${this.collectionEntryId}</span
                              >

                              <button
                                  class="reset-btn"
                                  @click=${() => (this.collectionEntryId = undefined)}
                              >
                                  Reset
                              </button>`
                            : nothing
                    }
                </div>

                <div class="search-tabs-mini">
                    <button
                        class="search-tab-mini ${
                            this.collectionSearchType === 'all' ? 'active' : ''
                        }"
                        @click=${() => (this.collectionSearchType = 'all')}
                    >
                        All
                    </button>
                    <button
                        class="search-tab-mini ${
                            this.collectionSearchType === 'collection'
                                ? 'active'
                                : ''
                        }"
                        @click=${() => (this.collectionSearchType = 'collection')}
                    >
                        Collections
                    </button>
                    <button
                        class="search-tab-mini ${
                            this.collectionSearchType === 'variable'
                                ? 'active'
                                : ''
                        }"
                        @click=${() => (this.collectionSearchType = 'variable')}
                    >
                        Variables
                    </button>
                </div>

                <div class="search-container-mini">
                    <input
                        type="text"
                        class="search-input-mini"
                        id="search-input"
                        placeholder=${placeholder}
                        @input="${(e: InputEvent) =>
                            this.handleCollectionSearch(
                                (e.target as HTMLInputElement).value,
                            )}"
                    />

                    <button class="search-button-mini">
                        <svg
                            class="search-icon-mini"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                        >
                            <path
                                d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
                            />
                        </svg>
                        Search
                    </button>
                </div>

                <!-- TODO: it may be nice to have a quick search, perhaps by recent trends? 
                <div class="quick-links-mini">
                    <a href="#" class="quick-link-mini" onclick="quickSearch('GPM')"
                        >GPM Precipitation</a
                    >
                    <a href="#" class="quick-link-mini" onclick="quickSearch('MODIS')"
                        >MODIS Data</a
                    >
                    <a
                        href="#"
                        class="quick-link-mini"
                        onclick="quickSearch('Landsat')"
                        >Landsat Imagery</a
                    >
                    <a href="#" class="quick-link-mini" onclick="quickSearch('AIRS')"
                        >Atmospheric Data</a
                    >
                </div>
                -->

                <div id="search-results-section" class="search-results-section">
                    ${
                        this.collectionSearchLoading
                            ? html`
                              <div id="loading-mini" class="loading-mini">
                                  <div class="spinner-mini"></div>
                                  <div>Searching NASA CMR...</div>
                              </div>
                          `
                            : this.collectionSearchResults?.length
                              ? html` <div
                                id="results-container-mini"
                                class="results-container-mini"
                            >
                                ${this.collectionSearchResults?.map(
                                    (item) => html`
                                        <div
                                            class="result-item-mini"
                                            @click=${() => {
                                                this.collectionEntryId =
                                                    item.collectionEntryId
                                                this.collectionAccordionOpen = false
                                                this.collectionLoading = true

                                                // if this item is a variable, we'll also go ahead and select the variable
                                                if (item.type === 'variable') {
                                                    this.selectedVariables = [
                                                        {
                                                            name: item.entryId,
                                                            href: '',
                                                            conceptId:
                                                                item.conceptId,
                                                        },
                                                    ]
                                                }

                                                this.requestUpdate()
                                            }}
                                            style="cursor: pointer;"
                                        >
                                            <div class="result-title-mini">
                                                ${item.title}
                                            </div>
                                            <div class="result-id-mini">
                                                ${item.entryId}
                                            </div>
                                            <div class="result-description-mini">
                                                ${item.summary || item.title}
                                            </div>
                                            <div class="result-meta-mini">
                                                <span>📅 2000-02-24 - ongoing</span>
                                                <span>🌍 Global</span>
                                                <span>🏢 ${item.provider}</span>
                                                ${
                                                    item.type === 'variable'
                                                        ? html` <span
                                                          >📊
                                                          ${item.collectionEntryId}</span
                                                      >`
                                                        : nothing
                                                }
                                                <span class="tag-mini"
                                                    >${item.type.toUpperCase()}</span
                                                >
                                            </div>
                                        </div>
                                    `,
                                )}
                            </div>`
                              : this.collectionSearchResults &&
                                  this.collectionSearchResults.length === 0
                                ? html`<div id="no-results-mini" class="no-results-mini">
                                  <p>
                                      No results found for
                                      '${this.collectionSearchQuery}'. Try adjusting
                                      your search term.
                                  </p>
                              </div>`
                                : nothing
                    }
                </div>
            </terra-accordion>

            ${
                this.collectionLoading
                    ? html`
                      <div
                          class="collection-loading-bar"
                          style="display: flex; align-items: center; gap: 10px; margin: 16px 0;"
                      >
                          <span
                              class="loading-spinner"
                              style="width: 20px; height: 20px; border: 3px solid #ccc; border-top: 3px solid #31708f; border-radius: 50%; display: inline-block; animation: spin 1s linear infinite;"
                          ></span>
                          Retrieving collection, please wait...
                      </div>
                      <style>
                          @keyframes spin {
                              0% {
                                  transform: rotate(0deg);
                              }
                              100% {
                                  transform: rotate(360deg);
                              }
                          }
                      </style>
                  `
                    : nothing
            }
        `
    }

    @debounce(500)
    handleCollectionSearch(searchTerm: string) {
        this.collectionSearchQuery = searchTerm
    }

    #renderOutputFormatSelection() {
        return html`
            <terra-accordion>
                <div slot="summary">
                    <span class="accordion-title">File Format:</span>
                </div>

                <div
                    slot="summary-right"
                    style="display: flex; align-items: center; gap: 10px;"
                >
                    <span>${this.selectedFormat.label}</span>

                    <button class="reset-btn" @click=${this.#resetFormatSelection}>
                        Reset
                    </button>
                </div>

                <div class="accordion-content" style="margin-top: 12px;">
                    ${(() => {
                        return (
                            this.collectionWithServices
                                ?.configuredOutputFormats || []
                        ).map(
                            (format) => html`
                                <label
                                    style="display: flex; align-items: center; gap: 8px; padding: 5px;"
                                >
                                    <input
                                        type="radio"
                                        name="output-format"
                                        value="${format}"
                                        .checked=${this.selectedFormat === format}
                                        @change=${() =>
                                            (this.selectedFormat = format)}
                                    />
                                    ${format.label}
                                </label>
                            `,
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
            this.selectedDateRange.startDate ??
            this.granuleMinDate ??
            defaultStartDate
        const endDate =
            this.selectedDateRange.endDate ??
            this.granuleMaxDate ??
            defaultEndDate
        const showError =
            this.touchedFields.has('date') &&
            (!this.selectedDateRange.startDate ||
                !this.selectedDateRange.endDate)

        return html`
            <terra-accordion>
                <div slot="summary">
                    <span class="accordion-title">Refine Date Range:</span>
                </div>

                <div
                    slot="summary-right"
                    style="display: flex; align-items: center; gap: 10px;"
                >
                    ${
                        showError
                            ? html`<span class="accordion-value error"
                              >Please select a date range</span
                          >`
                            : this.touchedFields.has('date') &&
                                startDate &&
                                endDate
                              ? html`<span class="accordion-value"
                                >${startDate} to ${endDate}</span
                            >`
                              : nothing
                    }
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
                        ?enable-time=${this.isSubDaily}
                        start-label="Start Date"
                        end-label="End Date"
                        .minDate=${this.granuleMinDate ?? defaultStartDate}
                        .maxDate=${this.granuleMaxDate ?? defaultEndDate}
                        .startDate=${
                            this.selectedDateRange.startDate ??
                            this.granuleMinDate
                        }
                        .endDate=${
                            this.selectedDateRange.endDate ??
                            this.granuleMaxDate
                        }
                        .useEndOfDay=${!this.selectedFormat.isGiovanniFormat}
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
                    ${
                        this.isSubDaily
                            ? html`<span
                              ><strong>Note:</strong> All dates and times are in
                              UTC.</span
                          >`
                            : nothing
                    }
                </div>
            </terra-accordion>
        `
    }

    #handleDateChange = (e: TerraDateRangeChangeEvent) => {
        this.#markFieldTouched('date')
        this.selectedDateRange = {
            ...this.selectedDateRange,
            startDate: e.detail.startDate,
            endDate: e.detail.endDate,
        }
    }

    #resetDateRangeSelection = () => {
        this.selectedDateRange = { startDate: null, endDate: null }
    }

    #resetFormatSelection = () => {
        // Reset to NetCDF if available, otherwise first available format from collection, or fall back to default
        if (this.collectionWithServices?.configuredOutputFormats.length) {
            const netcdfFormat =
                this.collectionWithServices.configuredOutputFormats.find(
                    (f) =>
                        f.key === 'application/x-netcdf4' ||
                        f.key === 'application/netcdf',
                )

            this.selectedFormat =
                netcdfFormat ||
                this.collectionWithServices.configuredOutputFormats[0]
        } else {
            this.selectedFormat = defaultOutputFormat
        }
    }

    #getCollectionDateRange() {
        // Prefer sampling data for accurate date ranges
        const samplingMinDate = this.granuleMinDate
        const samplingMaxDate = this.granuleMaxDate

        if (samplingMinDate && samplingMaxDate) {
            return {
                startDate: samplingMinDate.slice(0, 10),
                endDate: samplingMaxDate.slice(0, 10),
            }
        }

        // Fallback to collection metadata if sampling is not available
        const temporalExtents =
            this.collectionWithServices?.collection?.TemporalExtents
        if (!temporalExtents?.length)
            return {
                startDate: null,
                endDate: null,
            }

        let minStart = null
        let maxEnd = null
        const today = new Date()

        for (const temporal of temporalExtents) {
            for (const range of temporal.RangeDateTimes || []) {
                const start = new Date(range.BeginningDateTime)
                let end: Date
                if (temporal.EndsAtPresentFlag || !range.EndingDateTime) {
                    end = today
                } else {
                    end = new Date(range.EndingDateTime)
                }
                if (!minStart || start < minStart) minStart = start
                if (!maxEnd || end > maxEnd) maxEnd = end
            }
        }

        return {
            startDate: minStart ? minStart.toISOString().slice(0, 10) : null,
            endDate: maxEnd ? maxEnd.toISOString().slice(0, 10) : null,
        }
    }

    #renderSpatialSelection() {
        const showError =
            this.touchedFields.has('spatial') && !this.spatialSelection
        const spatialString =
            this.spatialSelection?.toString() ?? this.spatialSelection

        return html`
            <terra-accordion>
                <div slot="summary">
                    <span class="accordion-title">Refine Region:</span>
                </div>

                <div
                    slot="summary-right"
                    style="display: flex; align-items: center; gap: 10px;"
                >
                    ${
                        showError
                            ? html`<span class="accordion-value error"
                              >Please select a region</span
                          >`
                            : spatialString
                              ? html`<span class="accordion-value"
                                >${spatialString}</span
                            >`
                              : nothing
                    }
                    <button class="reset-btn" @click=${this.#resetSpatialSelection}>
                        Reset
                    </button>
                </div>
                <div class="accordion-content">
                    <terra-spatial-picker
                        part="spatial-picker"
                        inline
                        hide-label
                        .spatialConstraints=${
                            this.#collectionController.spatialConstraints ||
                            '-180, -90, 180, 90'
                        }
                        .initialValue=${spatialString}
                        @terra-map-change=${this.#handleSpatialChange}
                    ></terra-spatial-picker>
                    <div
                        style="display: flex; gap: 16px; margin-top: 15px; color: #31708f;"
                    >
                        <span
                            ><strong>Available Range:</strong> ${
                                this.#collectionController.spatialConstraints
                            }</span
                        >
                    </div>
                </div>
            </terra-accordion>
        `
    }

    #handleSpatialChange = (e: TerraMapChangeEvent) => {
        this.#markFieldTouched('spatial')

        if (e.detail.type === MapEventType.POINT) {
            this.spatialSelection = e.detail.latLng
        } else if (e.detail.type === MapEventType.BBOX) {
            this.spatialSelection = e.detail.bounds
        } else {
            this.spatialSelection = undefined
        }
    }

    /**
     * resets the spatial selection back to the bounds of the collection
     */
    #resetSpatialSelection = () => {
        this.spatialSelection = undefined
        this.spatialPicker.clear()

        this.#markFieldTouched('spatial')
    }

    #renderVariableSelection() {
        const variables = this.collectionWithServices?.variables || []
        const giovanniError =
            this.touchedFields.has('variables') &&
            this.#getGiovanniValidationError()
        const basicError =
            this.touchedFields.has('variables') &&
            this.selectedVariables.length === 0
        const showError = giovanniError || basicError
        const errorMessage =
            giovanniError ||
            (basicError ? 'Please select at least one variable' : '')

        const tree = this.#buildVariableTree(variables)
        const allGroups = this.#getAllGroupPaths(tree)
        const allExpanded =
            allGroups.length > 0 &&
            allGroups.every((g) => this.expandedVariableGroups.has(g))

        return html`
            <terra-accordion>
                <div slot="summary">
                    <span class="accordion-title">Select Variables:</span>
                </div>
                <div
                    slot="summary-right"
                    style="display: flex; align-items: center; gap: 10px;"
                >
                    ${
                        showError
                            ? html`<span class="accordion-value error"
                              >${errorMessage}</span
                          >`
                            : this.selectedVariables.length
                              ? html`<span class="accordion-value"
                                >${this.selectedVariables.length} selected</span
                            >`
                              : nothing
                    }

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

                    ${
                        this.selectedFormat.isGiovanniFormat &&
                        this.giovanniConfiguredVariables
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
                            : nothing
                    }
                    ${
                        variables.length === 0
                            ? html`<p style="color: #666; font-style: italic;">
                              No variables available for this collection.
                          </p>`
                            : this.#renderVariableTree(
                                  this.#filterVariableTree(tree),
                                  [],
                              )
                    }
                </div>
            </terra-accordion>
        `
    }

    #renderDimensionGroup(dim: { name: string; size: number }) {
        const currentValue = this.selectedDimensionIndexes[dim.name] ?? 1

        // dimensions in CMR aren't very user-friendly, they are index-based, but don't show the user what the index stands for
        // it's VERY hard to get the actual values, outside the scope of what a UI should do
        //
        // at least for GES DISC collections we can show better labels for dimensions
        // ideally we would want UMM-Dim or Harmony to give us better labels so we could support all DAACs
        // TODO: can we get these dimension labels elsewhere?
        const dimensions =
            this.#collectionController.gesDiscCollection?.data?.services?.subset?.find(
                (s) => s.dimensions && s.dimensions.length > 0,
            )?.dimensions || []

        return html`
            <div style="margin-bottom: 16px;">
                <div
                    style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;"
                >
                    <span style="font-weight: 600; margin-bottom: 44px"
                        >Dimension: ${dim.name}</span
                    >
                </div>
                <terra-slider
                    class="dimension-slider"
                    mode="range"
                    min="1"
                    .max=${dim.size}
                    step="1"
                    .startValue=${currentValue.start}
                    .endValue=${currentValue.end}
                    has-tooltips
                    show-inputs
                    hide-label
                    .formatTooltip=${
                        dimensions.length > 0
                            ? (value: number) => {
                                  const found = dimensions.find(
                                      (d) => String(d.value) === String(value),
                                  )
                                  return found ? found.label : String(value)
                              }
                            : nothing
                    }
                    @terra-slider-change=${(event: TerraSliderChangeEvent) => {
                        if ('startValue' in event.detail) {
                            const { startValue, endValue } = event.detail
                            this.#setDimensionValue(
                                dim.name,
                                startValue,
                                endValue,
                            )
                        }
                    }}
                ></terra-slider>
            </div>
        `
    }

    #setDimensionValue(dimName: string, startValue: number, endValue?: number) {
        const dimensions = this.#getCommonSelectableDimensions()
        const found = dimensions.find((d) => d.name === dimName)

        if (!found) {
            return
        }

        const normalizedStartValue = Math.min(
            Math.max(Math.round(startValue), 1),
            found.size,
        )
        const normalizedEndValue = Math.min(
            Math.max(Math.round(endValue ?? startValue), 1),
            found.size,
        )

        // if the dimension start and end is the full index range, we won't include that dimension in the request since it's redundant
        if (normalizedStartValue <= 1 && normalizedEndValue >= found.size) {
            delete this.selectedDimensionIndexes[dimName]
            return
        }

        this.selectedDimensionIndexes = {
            ...this.selectedDimensionIndexes,
            [dimName]: { start: normalizedStartValue, end: normalizedEndValue },
        }
    }

    #renderDimensionSelection() {
        const dimensions = this.#getCommonSelectableDimensions()

        if (!dimensions.length) {
            return nothing
        }

        const selectedCount = Object.keys(this.selectedDimensionIndexes).length

        return html`
            <terra-accordion>
                <div slot="summary">
                    <span class="accordion-title">Select Dimensions:</span>
                </div>
                <div
                    slot="summary-right"
                    style="display: flex; align-items: center; gap: 10px;"
                >
                    ${
                        selectedCount
                            ? html`<span class="accordion-value"
                              >${selectedCount}
                              dimension${selectedCount === 1 ? '' : 's'}
                              selected</span
                          >`
                            : nothing
                    }
                    <button class="reset-btn" @click=${this.#resetDimensionSelection}>
                        Reset
                    </button>
                </div>
                <div class="accordion-content">
                    ${dimensions.map((dim) => this.#renderDimensionGroup(dim))}
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

        const variables = this.collectionWithServices?.variables || []
        const tree = this.#buildVariableTree(variables)
        const filterText = this.variableFilterText.toLowerCase().trim()

        // Find all groups that contain matching variables and auto-expand them
        const groupsToExpand = new Set<string>()

        const findMatchingGroups = (
            node: Record<string, any>,
            path: string[] = [],
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
        let filteredVariables = variables

        if (
            this.selectedFormat.isGiovanniFormat &&
            this.giovanniConfiguredVariables
        ) {
            filteredVariables = variables.filter((v) => {
                // Convert internal format (dots) to Giovanni format (underscores)
                // Example: M2T1NXSLV_5.12.4_CLDPRS -> M2T1NXSLV_5_12_4_CLDPRS
                const shortName = this.collectionWithServices?.shortName
                const version = this.collectionWithServices?.collection?.Version

                if (!shortName || !version) {
                    return false
                }

                const giovanniVariableName =
                    convertVariableEntryIdToGiovanniFormat(
                        shortName,
                        version,
                        v.name,
                    )

                return this.giovanniConfiguredVariables!.has(
                    giovanniVariableName,
                )
            })
        }

        const root: Record<string, any> = {}
        for (const v of filteredVariables) {
            const parts = v.name.split('/')
            let node = root
            for (let i = 0; i < parts.length; i++) {
                const part = parts[i]
                if (!node[part])
                    node[part] = { __children: {}, __isLeaf: false }
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
        const isGiovanni = this.selectedFormat.isGiovanniFormat

        return html`
            <div style="margin-left: ${path.length * 20}px;">
                ${Object.entries(node).map(([key, value]: [string, any]) => {
                    const groupPath = [...path, key].join('/')
                    if (value.__isLeaf) {
                        // Leaf node (variable)
                        const ummVar = cmrVariableService.getVariableByName(
                            key,
                            this.#collectionController.variables?.data,
                        )
                        const variableLabel = ummVar
                            ? cmrVariableService.getVariableDisplayLabel(ummVar)
                            : key

                        return html`
                            <div class="option-row">
                                <label class="checkbox-option">
                                    <input
                                        type="${isGiovanni ? 'radio' : 'checkbox'}"
                                        name="${
                                            isGiovanni
                                                ? 'variable-selection'
                                                : ''
                                        }"
                                        .checked=${this.selectedVariables.some(
                                            (v) =>
                                                v.name ===
                                                value.__variable.name,
                                        )}
                                        @change=${(e: Event) =>
                                            this.#toggleVariableSelection(
                                                e,
                                                value.__variable,
                                            )}
                                    />
                                    <span>${variableLabel}</span>
                                </label>
                            </div>
                        `
                    } else {
                        // Group node
                        const expanded =
                            this.expandedVariableGroups.has(groupPath)
                        return html`
                            <div class="option-row" style="align-items: flex-start;">
                                <span
                                    style="cursor: pointer; display: flex; align-items: center;"
                                    @click=${() => this.#toggleGroupExpand(groupPath)}
                                >
                                    <terra-icon
                                        library="heroicons"
                                        name="${
                                            expanded
                                                ? 'outline-minus-circle'
                                                : 'outline-plus-circle'
                                        }"
                                        style="margin-right: 4px;"
                                    ></terra-icon>
                                    <span style="font-weight: 500;">${key}</span>
                                </span>
                            </div>
                            ${
                                expanded
                                    ? this.#renderVariableTree(
                                          value.__children,
                                          [...path, key],
                                      )
                                    : ''
                            }
                        `
                    }
                })}
            </div>
        `
    }

    #getAllGroupPaths(
        node: Record<string, any>,
        path: string[] = [],
    ): string[] {
        let groups: string[] = []
        for (const [key, value] of Object.entries(node)) {
            if (!value.__isLeaf) {
                const groupPath = [...path, key].join('/')
                groups.push(groupPath)
                groups = groups.concat(
                    this.#getAllGroupPaths(value.__children, [...path, key]),
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

        if (this.selectedFormat.isGiovanniFormat) {
            // Radio button behavior for Giovanni - replace selection with only this variable
            if (checked) {
                this.selectedVariables = [variable]
            }
        } else {
            // Checkbox behavior for non-Giovanni - allow multiple selections
            if (checked) {
                if (
                    !this.selectedVariables.some(
                        (v) => v.name === variable.name,
                    )
                ) {
                    this.selectedVariables = [
                        ...this.selectedVariables,
                        variable,
                    ]
                }
            } else {
                this.selectedVariables = this.selectedVariables.filter(
                    (v) => v.name !== variable.name,
                )
            }
        }
    }

    #markFieldTouched(field: string) {
        this.touchedFields = new Set(this.touchedFields).add(field)
    }

    #resetVariableSelection = () => {
        this.selectedVariables = []
        this.#resetDimensionSelection()
    }

    #resetDimensionSelection() {
        this.selectedDimensionIndexes = {}
    }

    #isDimensionExcluded(dim: { Name: string; Type?: string }) {
        const normalizedName = dim.Name?.toLowerCase() ?? ''
        const normalizedType = (dim.Type ?? '').toLowerCase()

        return ['time', 'latitude', 'longitude', 'lat', 'lon', 'x', 'y'].some(
            (value) =>
                normalizedName.includes(value) ||
                normalizedType.includes(value),
        )
    }

    #getCommonSelectableDimensions(): Array<{
        name: string
        type: string
        size: number
    }> {
        const variables = this.#collectionController.variables?.data

        if (!variables) {
            console.log('no variables found, cannot determine dimensions')
            return []
        }

        type DimensionEntry = {
            Name: string
            Size: number | string
            Type?: string
        }

        const allUmmVars = variables.items ?? []

        if (!allUmmVars.length) {
            return []
        }

        const allDimensionSets: DimensionEntry[][] = allUmmVars.map(
            (v) => v.umm.Dimensions ?? [],
        )

        if (!allDimensionSets.length) {
            return []
        }

        const allDimensionNames = Array.from(
            new Set(
                allDimensionSets.flatMap((dimSet) =>
                    dimSet.map((dim) => dim.Name),
                ),
            ),
        )

        const filteredCommon = allDimensionNames
            .map((name) => {
                const dims = allDimensionSets
                    .map((set) => set.find((dim) => dim.Name === name))
                    .filter((d): d is DimensionEntry => Boolean(d))

                if (!dims.length) {
                    return null
                }

                const validSizes = dims
                    .filter(
                        (dim) =>
                            dim.Size !== undefined && dim.Size !== 'Varies',
                    )
                    .map((dim) => Number(dim.Size))
                    .filter((size) => Number.isFinite(size) && size > 0)

                if (!validSizes.length) {
                    return null
                }

                const size = Math.min(...validSizes)

                return {
                    name,
                    type: dims[0]?.Type ?? 'OTHER',
                    size,
                }
            })
            .filter(
                (
                    entry,
                ): entry is { name: string; type: string; size: number } =>
                    Boolean(entry),
            )
            .filter(
                (entry) =>
                    !this.#isDimensionExcluded({
                        Name: entry.name,
                        Type: entry.type,
                    }),
            )

        return filteredCommon
    }

    #renderJobStatus() {
        if (!this.#harmonyRequestController.jobId) {
            return html`<div class="results-section" id="job-status-section">
                <div
                    style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;"
                >
                    <h2 class="results-title" style="margin: 0;">Results:</h2>
                    ${
                        !this.isHistoryView
                            ? html`
                              <terra-button
                                  variant="default"
                                  size="small"
                                  @click=${this.#backToSubsetOptions}
                              >
                                  ← Back to Subset Options
                              </terra-button>
                          `
                            : nothing
                    }
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
                    ${
                        !this.isHistoryView
                            ? html`
                              <terra-button
                                  variant="default"
                                  size="small"
                                  @click=${this.#backToSubsetOptions}
                              >
                                  ← Back to Subset Options
                              </terra-button>
                          `
                            : nothing
                    }
                </div>

                ${
                    this.#harmonyRequestController.status !== 'canceled' &&
                    this.#harmonyRequestController.status !== 'failed'
                        ? html` <div class="progress-container">
                          <div class="progress-text">
                              ${
                                  this.#harmonyRequestController.progress >= 100
                                      ? html`
                                        <span class="status-complete"
                                            >✓ Search complete</span
                                        >
                                    `
                                      : html`
                                        <span class="spinner"></span>
                                        <span class="status-running"
                                            >Searching for data...
                                            (${
                                                this.#harmonyRequestController
                                                    .progress
                                            }%)</span
                                        >
                                    `
                              }
                          </div>

                          <div class="progress-bar">
                              <div class="progress-fill"
                                  style="width: ${
                                      this.#harmonyRequestController.progress
                                  }%"
                              ></div>
                          </div>
                      </div>`
                        : nothing
                }

                <div class="search-status">
                    <span class="file-count"
                        >Found ${this.#numberOfFilesFoundEstimate()} files</span
                    >
                    out of estimated
                    <span class="estimated-total"
                        >${this.#harmonyRequestController.data?.numInputGranules.toLocaleString()}</span
                    >
                </div>

                ${this.#renderJobMessage()}
                ${
                    this.#harmonyRequestController.data?.errors?.length
                        ? html`
                          <terra-accordion>
                              <div slot="summary">
                                  <span
                                      class="accordion-title"
                                      style="color: #dc3545;"
                                      >Errors
                                      (${
                                          this.#harmonyRequestController.data
                                              ?.errors.length
                                      })</span
                                  >
                              </div>
                              <div class="accordion-content">
                                  <ul
                                      style="color: #dc3545; font-size: 14px; padding-left: 20px;"
                                  >
                                      ${this.#harmonyRequestController.data?.errors.map(
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
                                          `,
                                      )}
                                  </ul>
                              </div>
                          </terra-accordion>
                      `
                        : nothing
                }

                <div class="tabs">
                    <button
                        class="tab ${
                            this.selectedTab === 'web-links' ? 'active' : ''
                        }"
                        @click=${() => (this.selectedTab = 'web-links')}
                    >
                        Web Links
                    </button>

                    ${
                        !this.isHistoryView
                            ? html`
                              <button
                                  class="tab ${
                                      this.selectedTab === 'selected-params'
                                          ? 'active'
                                          : ''
                                  }"
                                  @click=${() =>
                                      (this.selectedTab = 'selected-params')}
                              >
                                  Selected Parameters
                              </button>
                          `
                            : nothing
                    }
                </div>
                <div
                    id="web-links"
                    class="tab-content ${
                        this.selectedTab === 'web-links' ? 'active' : ''
                    }"
                >
                    ${
                        this.#getDocumentationLinks().length
                            ? html`
                              <div class="documentation-links">
                                  ${this.#getDocumentationLinks().map(
                                      (link) => html`
                                          <a href="${link.href}" class="doc-link"
                                              >${link.title}</a
                                          >
                                      `,
                                  )}
                              </div>
                          `
                            : nothing
                    }

                    <ul class="file-list">
                        ${this.#getDataLinks().map(
                            (link) => html`
                                <li class="file-item">
                                    <a
                                        href="${link.href}"
                                        class="file-link"
                                        target="_blank"
                                    >
                                        ${link.title}
                                    </a>
                                </li>
                            `,
                        )}
                    </ul>
                </div>

                <div
                    id="selected-params"
                    class="tab-content ${
                        this.selectedTab === 'selected-params' ? 'active' : ''
                    }"
                >
                    ${this.#renderSelectedParams()}
                </div>
            </div>

            ${
                !this.dialog
                    ? html`
                      <div class="footer">
                          ${
                              this.#harmonyRequestController.status ===
                                  Status.SUCCESSFUL ||
                              this.#harmonyRequestController.status ===
                                  Status.COMPLETE_WITH_ERRORS
                                  ? html`
                                    <div
                                        style="display: flex; align-items: center; gap: 8px;"
                                    >
                                        <terra-dropdown
                                            @terra-select=${
                                                this.#handleDownloadSelect
                                            }
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
                                  : nothing
                          }
                          ${
                              this.#harmonyRequestController.status ===
                              Status.RUNNING
                                  ? html`<button
                                    class="btn btn-success"
                                    @click=${this.#cancelJob}
                                    ?disabled=${this.cancelingGetData}
                                >
                                    ${
                                        this.cancelingGetData
                                            ? 'Canceling...'
                                            : 'Cancel request'
                                    }
                                </button>`
                                  : nothing
                          }

                          <div class="job-info">
                              Job ID:
                              <span class="job-id">
                                  ${
                                      this.bearerToken
                                          ? html`<a
                                            href="https://harmony.earthdata.nasa.gov/jobs/${
                                                this.#harmonyRequestController
                                                    .jobId
                                            }"
                                            target="_blank"
                                            >${this.#harmonyRequestController.jobId}</a
                                        >`
                                          : this.#harmonyRequestController.jobId
                                  }
                              </span>
                              <span class="info-icon">?</span>
                          </div>
                      </div>
                  `
                    : nothing
            }
        `
    }

    #renderSelectedParams() {
        const collection = this.collectionWithServices?.collection
        const variables = this.selectedVariables.length
            ? this.selectedVariables.map((v) => v.name)
            : ['All']
        const dateRange =
            this.selectedDateRange.startDate && this.selectedDateRange.endDate
                ? `${this.selectedDateRange.startDate} to ${this.selectedDateRange.endDate}`
                : '—'
        const spatial = this.spatialSelection?.toString() ?? '-'

        return html`
            <dl class="params-summary">
                <div>
                    <dt><strong>Dataset</strong></dt>
                    <dd>${collection?.EntryTitle ?? '—'}</dd>
                </div>
                <div>
                    <dt><strong>Variables</strong></dt>
                    <dd>${variables.map((v) => html`<div>${v}</div>`)}</dd>
                </div>
                <div>
                    <dt><strong>Dimensions</strong></dt>
                    <dd>
                        ${
                            Object.entries(this.selectedDimensionIndexes).length
                                ? Object.entries(
                                      this.selectedDimensionIndexes,
                                  ).map(
                                      ([dimName, value]) =>
                                          html`<div>
                                          <strong>${dimName}:</strong> ${value}
                                      </div>`,
                                  )
                                : '—'
                        }
                    </dd>
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

    async #cancelJob() {
        if (!this.jobId) {
            // no job id, can't cancel
            return
        }

        this.cancelingGetData = true

        try {
            await this.#harmonyRequestController.cancelJob({
                jobId: this.jobId,
                options: { bearerToken: this.bearerToken },
            })
        } finally {
            this.cancelingGetData = false
        }
    }

    async #getData() {
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

        const variables = this.selectedFormat.isGiovanniFormat
            ? this.selectedVariables.map((v) =>
                  // the Giovanni variable catalog uses different variable entry ids, we need to support them
                  // ex. CMR: M2T1NXSLV_5.2.14 in Giovanni uses underscores: M2T1NXSLV_5_2_14
                  convertVariableEntryIdToGiovanniFormat(
                      this.collectionWithServices!.shortName ?? '',
                      this.collectionWithServices!.collection?.Version ?? '',
                      v.name,
                  ),
              )
            : this.selectedVariables.map((v) => v.conceptId)

        const harmonyRequest = new HarmonyRequest({
            collectionConceptId: this.collectionWithServices!.conceptId,
            variables,
            location: this.spatialSelection,
        })

        if (
            this.collectionWithServices?.summary.subsetting.temporal &&
            this.selectedDateRange.startDate &&
            this.selectedDateRange.endDate
        ) {
            // TODO: this is overly complex, we should just store UTC dates by default and can trim before calling Harmony
            harmonyRequest.startDate(
                this.isSubDaily
                    ? this.selectedDateRange.startDate
                    : getUTCDate(
                          this.selectedDateRange.startDate,
                      ).toISOString(),
            )
            harmonyRequest.endDate(
                this.isSubDaily
                    ? this.selectedDateRange.endDate
                    : getUTCDate(this.selectedDateRange.endDate).toISOString(),
            )
        }

        if (this.selectedFormat) {
            // For giovanni services, always use text/csv (not image/tiff)
            // TODO: do we really have to pass text/csv for Giovanni? Should test this
            harmonyRequest.format(
                this.selectedFormat.isGiovanniFormat
                    ? 'text/csv'
                    : this.selectedFormat.key,
            )
        }

        // Add Cloud Giovanni specific average parameters
        // TODO: is their better logic to how these average parameters are applied? I don't see it in the capabilities response
        if (this.selectedFormat.key === 'text/csv') {
            harmonyRequest.average('area')
        }
        if (this.selectedFormat.key === 'image/tiff') {
            harmonyRequest.average('time')
        }

        if (Object.keys(this.selectedDimensionIndexes).length) {
            Object.entries(this.selectedDimensionIndexes).forEach(
                ([dimName, { start, end }]) => {
                    harmonyRequest.dimension({
                        name: dimName,
                        min: start,
                        max: end,
                    })
                },
            )
        }

        // add a label to identify the subsetter as the source
        harmonyRequest.label('terra-data-subsetter')

        console.log('Creating Harmony job with request:', harmonyRequest)

        const job = await this.#harmonyRequestController.startJob({
            harmonyRequest,
            options: { bearerToken: this.bearerToken },
        })

        this.jobId = job.jobID

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
            (this.#harmonyRequestController.data!.numInputGranules *
                this.#harmonyRequestController.progress) /
                100,
        )
    }

    #getDocumentationLinks() {
        return this.#harmonyRequestController.data!.links.filter(
            (link) => link.rel === 'stac-catalog-json',
        )
    }

    #getDataLinks() {
        return this.#harmonyRequestController.data!.links.filter(
            (link) => link.rel === 'data',
        )
    }

    #hasAtLeastOneSubsetOption() {
        return (
            this.collectionWithServices?.summary.subsetting.bbox ||
            this.collectionWithServices?.summary.subsetting.shape ||
            this.collectionWithServices?.summary.subsetting.variable ||
            this.collectionWithServices?.summary.subsetting.temporal
        )
    }

    #hasSpatialSubset() {
        return (
            this.collectionWithServices?.summary.subsetting.bbox ||
            this.collectionWithServices?.summary.subsetting.shape
        )
    }

    #renderJobMessage() {
        const warningStatuses = [
            Status.CANCELED,
            Status.COMPLETE_WITH_ERRORS,
            Status.RUNNING_WITH_ERRORS,
        ]
        const errorStatuses = [Status.FAILED]

        let type = 'normal'
        if (
            warningStatuses.includes(
                this.#harmonyRequestController.data!.status,
            )
        ) {
            type = 'warning'
        } else if (
            errorStatuses.includes(this.#harmonyRequestController.data!.status)
        ) {
            type = 'error'
        }

        let color: string, bg: string
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
        return this.#harmonyRequestController.data?.message.replace(
            /\b(The job|the job|job|Job)\b/g,
            (match) => {
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
            },
        )
    }

    #estimateJobSize() {
        if (!this.collectionWithServices?.granuleCount) return

        const range = this.#getCollectionDateRange()
        let startDate: string | null
        let endDate: string | null
        let links = this.collectionWithServices?.granuleCount ?? 0

        if (
            this.selectedDateRange.startDate &&
            this.selectedDateRange.endDate
        ) {
            // Use the user selected date range if available
            startDate = this.selectedDateRange.startDate
            endDate = this.selectedDateRange.endDate
        } else {
            // fallback to the collection's full date range
            startDate = this.granuleMinDate ?? range.startDate
            endDate = this.granuleMaxDate ?? range.endDate
        }

        if (!startDate || !endDate) return

        const start = new Date(startDate)
        const end = new Date(endDate)
        const days =
            Math.floor(
                (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24),
            ) + 1

        if (range.startDate && range.endDate) {
            const availableDaysInCollection =
                Math.floor(
                    (new Date(range.endDate).getTime() -
                        new Date(range.startDate).getTime()) /
                        (1000 * 60 * 60 * 24),
                ) + 1
            const granulesPerDay = links / availableDaysInCollection

            links = Math.ceil(days * granulesPerDay)
        }

        return { days, links }
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
        if (!this.#harmonyRequestController.data?.links) {
            return
        }

        const dataLinks = this.#getDataLinks()

        if (dataLinks.length === 0) {
            return
        }

        const content = dataLinks.map((link) => link.href).join('\n')
        const blob = new Blob([content], { type: 'text/plain' })
        const url = URL.createObjectURL(blob)

        // Create a temporary link element and trigger download
        const a = document.createElement('a')
        a.href = url
        a.download = `subset_links_${this.#harmonyRequestController.jobId}.txt`
        document.body.appendChild(a)
        a.click()

        document.body.removeChild(a)
        URL.revokeObjectURL(url)
    }

    async #downloadPythonScript(event: Event) {
        event.stopPropagation()
        if (!this.#harmonyRequestController.data?.links) {
            return
        }

        const response = await fetch(
            getBasePath('assets/data-subsetter/download_subset_files.py.txt'),
        )

        if (!response.ok) {
            alert(
                'Sorry, there was a problem generating the Python script. We are investigating the issue.\nYou could try using the Jupyter Notebook in the meantime',
            )
        }

        const content = (await response.text())
            .replace(/{{jobId}}/gi, this.#harmonyRequestController.jobId ?? '')
            .replace(
                /{{HARMONY_ENV}}/gi,
                `Environment.${this.environment?.toUpperCase()}`,
            )
            .replace(
                /{{EARTHACCESS_ENV}}/gi,
                `earthaccess.${this.environment?.toUpperCase()}`,
            )

        const blob = new Blob([content], { type: 'text/plain' })
        const url = URL.createObjectURL(blob)

        // Create a temporary link element and trigger download
        const a = document.createElement('a')
        a.href = url
        a.download = `download_subset_files_${this.#harmonyRequestController.jobId}.py`
        document.body.appendChild(a)
        a.click()

        document.body.removeChild(a)
        URL.revokeObjectURL(url)
    }

    async #downloadEarthdataDownload(event: Event) {
        event.stopPropagation()
        if (!this.#harmonyRequestController.data?.links) {
            return
        }

        alert('Sorry, Earthdata Download is not currently supported')
    }

    #handleJupyterNotebookClick() {
        const notebook = getNotebook(this)

        sendDataToJupyterNotebook('load-notebook', {
            filename: `subset_${this.#harmonyRequestController.jobId}.ipynb`,
            notebook,
            bearerToken: this.bearerToken,
        })
    }

    renderHistoryPanel() {
        const existingHistoryPanel = document.querySelector(
            'terra-data-subsetter-history',
        )

        if (!existingHistoryPanel && this.bearerToken) {
            // let's add a history panel to the page
            const historyPanel = document.createElement(
                'terra-data-subsetter-history',
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
        const boundingRects =
            this.collectionWithServices?.collection?.SpatialExtent
                ?.HorizontalSpatialDomain?.Geometry?.BoundingRectangles
        if (
            !boundingRects ||
            !Array.isArray(boundingRects) ||
            !boundingRects.length
        )
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
                            </div>`,
                    )}
                </div>
                <div style="font-size: 0.95em; color: #666;">
                    This collection does not support spatial subsetting.
                </div>
            </div>
        `
    }

    #renderDataAccessModeSelection() {
        if (!this.#collectionController.hasGranules) {
            return nothing
        }

        return html`
            <div class="mode-selection">
                <div class="mode-options">
                    <label
                        class="mode-option ${
                            this.dataAccessMode === 'original' ? 'selected' : ''
                        }"
                    >
                        <input
                            type="radio"
                            name="data-access-mode"
                            value="original"
                            .checked=${this.dataAccessMode === 'original'}
                            @change=${() => (this.dataAccessMode = 'original')}
                        />
                        <div class="mode-content">
                            <div class="mode-title">Get Original Files</div>
                            <div class="mode-description">
                                Filter file links directly from the archive.
                            </div>
                        </div>
                    </label>

                    <label
                        class="mode-option ${
                            this.dataAccessMode === 'subset' ? 'selected' : ''
                        }"
                    >
                        <input
                            type="radio"
                            name="data-access-mode"
                            value="subset"
                            .checked=${this.dataAccessMode === 'subset'}
                            @change=${() => (this.dataAccessMode = 'subset')}
                        />
                        <div class="mode-content">
                            <div class="mode-title">Transform Data</div>
                            <div class="mode-description">
                                Transform the data to your specific needs.
                            </div>
                        </div>
                    </label>
                </div>
            </div>
        `
    }

    #getGiovanniValidationError(): string | null {
        if (!this.selectedFormat.isGiovanniFormat) {
            return null
        }

        if (this.selectedVariables.length === 0) {
            return 'Please select a variable to subset.'
        }

        if (this.selectedVariables.length > 1) {
            return 'The selected format only supports subsetting one variable at a time.'
        }

        return null
    }
}
