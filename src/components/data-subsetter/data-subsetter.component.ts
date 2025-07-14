import { html, nothing } from 'lit'
import componentStyles from '../../styles/component.styles.js'
import TerraElement from '../../internal/terra-element.js'
import styles from './data-subsetter.styles.js'
import type { CSSResultGroup } from 'lit'
import { property, query, state } from 'lit/decorators.js'
import { DataSubsetterController } from './data-subsetter.controller.js'
import TerraAccordion from '../accordion/accordion.component.js'
import {
    Status,
    type BoundingBox,
    type CollectionWithAvailableServices,
    type Variable,
} from '../../data-services/types.js'
import TerraDatePicker from '../date-picker/date-picker.component.js'
import TerraIcon from '../icon/icon.component.js'
import TerraSpatialPicker from '../spatial-picker/spatial-picker.component.js'
import type { TerraMapChangeEvent } from '../../events/terra-map-change.js'
import type { LatLng } from '../map/type.js'
import { getBasePath } from '../../utilities/base-path.js'
import {
    defaultSubsetFileMimeType,
    getFriendlyNameForMimeType,
} from '../../utilities/mimetypes.js'
import { watch } from '../../internal/watch.js'

/**
 * @summary Short summary of the component's intended use.
 * @documentation https://disc.gsfc.nasa.gov/components/data-subsetter
 * @status experimental
 * @since 1.0
 *
 * @dependency terra-example
 *
 * @slot - The default slot.
 * @slot example - An example slot.
 *
 * @csspart base - The component's base wrapper.
 *
 * @cssproperty --example - An example CSS custom property.
 *
 * @event terra-subset-job-complete - called when a subset job enters a final state (e.g. successful, failed, completed_with_errors)
 */
export default class TerraDataSubsetter extends TerraElement {
    static styles: CSSResultGroup = [componentStyles, styles]
    static dependencies: Record<string, typeof TerraElement> = {
        'terra-accordion': TerraAccordion,
        'terra-date-picker': TerraDatePicker,
        'terra-icon': TerraIcon,
        'terra-spatial-picker': TerraSpatialPicker,
    }

    @property({ reflect: true, attribute: 'collection-entry-id' })
    collectionEntryId?: string

    @property({ reflect: true, type: Boolean, attribute: 'show-collection-search' })
    showCollectionSearch?: boolean = true

    @property({ reflect: true, attribute: 'job-id' })
    jobId?: string

    @property({ attribute: 'bearer-token' })
    bearerToken?: string

    @state()
    collectionWithServices?: CollectionWithAvailableServices

    @state()
    selectedVariables: Variable[] = []

    @state()
    expandedVariableGroups: Set<string> = new Set()

    @state()
    touchedFields: Set<string> = new Set()

    @state()
    spatialSelection: BoundingBox | LatLng | null = null

    @state()
    selectedDateRange: { startDate: string | null; endDate: string | null } = {
        startDate: null,
        endDate: null,
    }

    @state()
    selectedFormat: string = defaultSubsetFileMimeType

    @state()
    cancelingGetData: boolean = false

    @state()
    selectedTab: 'web-links' | 'selected-params' = 'web-links'

    @state()
    refineParameters: boolean = false

    @state()
    showDownloadMenu: boolean = false

    @query('[part~="spatial-picker"]')
    spatialPicker: TerraSpatialPicker

    #controller = new DataSubsetterController(this)

    firstUpdated() {
        if (this.collectionEntryId) {
            this.showCollectionSearch = false
        }

        if (this.jobId) {
            this.#controller.fetchJobByID(this.jobId)
        }

        document.addEventListener('click', this.#handleClickOutside.bind(this))
    }

    disconnectedCallback() {
        super.disconnectedCallback()

        document.removeEventListener('click', this.#handleClickOutside.bind(this))
    }

    @watch(['collectionWithServices'])
    collectionChanged() {
        const { startDate, endDate } = this.#getCollectionDateRange()

        if (startDate && endDate) {
            // We'll default to the last 7 days of a collection's links so that we don't accidentally overwhelm Harmony
            const end = new Date(endDate)
            const start = new Date(startDate)
            const sevenDaysAgo = new Date(end)
            sevenDaysAgo.setDate(end.getDate() - 6) // 7 days including end
            const defaultStart = sevenDaysAgo > start ? sevenDaysAgo : start

            this.selectedDateRange = {
                startDate: defaultStart.toISOString().slice(0, 10),
                endDate: endDate,
            }
        } else {
            this.selectedDateRange = { startDate, endDate }
        }
    }

    render() {
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
                        ${this.collectionWithServices?.collection?.EntryTitle ??
                        html`Download Data`}
                    </h1>
                    <button class="close-btn" onclick="closeDialog()">×</button>
                </div>

                ${this.#controller.currentJob && !this.refineParameters
                    ? this.#renderJobStatus()
                    : this.#renderSubsetOptions()}
            </div>
        `
    }

    #renderSubsetOptions() {
        const estimates = this.#estimateJobSize()

        return html`
            ${estimates
                ? html`<div
                      class="size-info ${estimates.links >= 150
                          ? 'warning'
                          : 'neutral'}"
                  >
                      <h2>Estimated size of results</h2>
                      <div class="size-stats">
                          ${estimates.days.toLocaleString()} days,
                          ${estimates.links.toLocaleString()} links
                      </div>
                      ${estimates.links >= 150
                          ? html`<div class="size-warning">
                                You are about to retrieve
                                ${estimates.links.toLocaleString()} file links from
                                the archive. You may
                                <strong>speed up the request</strong> by limiting the
                                scope of your search.
                            </div>`
                          : nothing}
                  </div>`
                : nothing}
            ${this.showCollectionSearch
                ? html`
                      <div class="section">
                          <h2 class="section-title">
                              Select Data Collection
                              <span class="help-icon">?</span>
                          </h2>

                          ${this.#renderSearchForCollection()}
                      </div>
                  `
                : nothing}
            ${this.#hasAtLeastOneSubsetOption()
                ? html`
                      <div class="section">
                          <h2 class="section-title">
                              Method Options
                              <span class="help-icon">?</span>
                          </h2>

                          ${this.collectionWithServices?.temporalSubset
                              ? this.#renderDateRangeSelection()
                              : nothing}
                          ${this.#hasSpatialSubset()
                              ? this.#renderSpatialSelection()
                              : nothing}
                          ${this.collectionWithServices?.variableSubset
                              ? this.#renderVariableSelection()
                              : nothing}
                      </div>
                  `
                : nothing}
            ${this.collectionWithServices?.outputFormats?.length
                ? html`
                      <div class="section">
                          <h2 class="section-title">
                              Output Format
                              <span class="help-icon">?</span>
                          </h2>

                          ${this.#renderOutputFormatSelection()}
                      </div>
                  `
                : nothing}

            <div class="footer">
                <button class="btn btn-secondary">Reset All</button>
                <button class="btn btn-primary" @click=${this.#getData}>
                    Get Data
                </button>
            </div>
        `
    }

    #renderSearchForCollection() {
        return html`
            <terra-accordion open>
                <div slot="summary">
                    <span class="accordion-title">Data Collection:</span>
                </div>

                <div
                    slot="summary-right"
                    style="display: flex; align-items: center; gap: 10px"
                >
                    <span class="accordion-value" id="selected-collection-display"
                        >Please select a collection</span
                    >
                    <button class="reset-btn">Reset</button>
                </div>

                <!--
                        <div class="search-tabs-mini">
                            <button
                                class="search-tab-mini active"
                                onclick="switchSearchType('all')"
                            >
                                All
                            </button>
                            <button
                                class="search-tab-mini"
                                onclick="switchSearchType('collections')"
                            >
                                Collections
                            </button>
                            <button
                                class="search-tab-mini"
                                onclick="switchSearchType('variables')"
                            >
                                Variables
                            </button>
                        </div>
                        -->

                <div class="search-container-mini">
                    <input
                        type="text"
                        class="search-input-mini"
                        id="search-input"
                        placeholder="Search all types of resources"
                        onkeypress="handleSearchKeypress(event)"
                    />
                    <button class="search-button-mini" onclick="performSearch()">
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

                <!--
                        <div class="quick-links-mini">
                            <a
                                href="#"
                                class="quick-link-mini"
                                onclick="quickSearch('GPM')"
                                >GPM Precipitation</a
                            >
                            <a
                                href="#"
                                class="quick-link-mini"
                                onclick="quickSearch('MODIS')"
                                >MODIS Data</a
                            >
                            <a
                                href="#"
                                class="quick-link-mini"
                                onclick="quickSearch('Landsat')"
                                >Landsat Imagery</a
                            >
                            <a
                                href="#"
                                class="quick-link-mini"
                                onclick="quickSearch('AIRS')"
                                >Atmospheric Data</a
                            >
                        </div>
                        -->

                <div
                    id="search-results-section"
                    class="search-results-section"
                    style="display: none"
                >
                    <div class="results-header-mini">
                        <div class="results-count-mini" id="results-count">
                            Found 0 results
                        </div>
                    </div>

                    <div id="results-container-mini" class="results-container-mini">
                        <!-- Results will be populated here -->
                    </div>

                    <div id="loading-mini" class="loading-mini" style="display: none">
                        <div class="spinner-mini"></div>
                        <div>Searching NASA CMR...</div>
                    </div>

                    <div
                        id="no-results-mini"
                        class="no-results-mini"
                        style="display: none"
                    >
                        <p>
                            No results found. Try adjusting your search terms or
                            browse the quick links above.
                        </p>
                    </div>
                </div>
            </terra-accordion>
        `
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
                    <span>${getFriendlyNameForMimeType(this.selectedFormat)}</span>

                    <button class="reset-btn" @click=${this.#resetFormatSelection}>
                        Reset
                    </button>
                </div>

                <div class="accordion-content" style="margin-top: 12px;">
                    ${(() => {
                        const uniqueFormats = Array.from(
                            new Set(this.collectionWithServices?.outputFormats || [])
                        )

                        return uniqueFormats.map(
                            format => html`
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
                                    ${getFriendlyNameForMimeType(format)}
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
        const startDate = this.selectedDateRange.startDate ?? defaultStartDate
        const endDate = this.selectedDateRange.endDate ?? defaultEndDate
        const showError =
            this.touchedFields.has('date') &&
            (!this.selectedDateRange.startDate || !this.selectedDateRange.endDate)

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

                <div style="display: flex; gap: 16px;">
                    <terra-date-picker
                        label="Start Date"
                        allow-input
                        class="w-full"
                        .minDate=${defaultStartDate}
                        .maxDate=${endDate}
                        .defaultDate=${startDate}
                        @terra-change=${this.#handleStartDateChange}
                    ></terra-date-picker>
                    <terra-date-picker
                        label="End Date"
                        allow-input
                        class="w-full"
                        .minDate=${startDate}
                        .maxDate=${defaultEndDate}
                        .defaultDate=${endDate}
                        @terra-change=${this.#handleEndDateChange}
                    ></terra-date-picker>
                </div>

                <div
                    style="display: flex; gap: 16px; margin-top: 15px; color: #31708f;"
                >
                    <span
                        ><strong>Available Range:</strong> ${defaultStartDate} to
                        ${defaultEndDate}</span
                    >
                    <span
                        ><strong>Note:</strong> All dates and times are in UTC.</span
                    >
                </div>
            </terra-accordion>
        `
    }

    #handleStartDateChange = (e: CustomEvent) => {
        this.#markFieldTouched('date')
        const datePicker = e.currentTarget as TerraDatePicker

        this.selectedDateRange = {
            ...this.selectedDateRange,
            startDate: datePicker.selectedDates.startDate,
        }
    }

    #handleEndDateChange = (e: CustomEvent) => {
        this.#markFieldTouched('date')
        const datePicker = e.currentTarget as TerraDatePicker

        this.selectedDateRange = {
            ...this.selectedDateRange,
            endDate: datePicker.selectedDates.startDate,
        }
    }

    #resetDateRangeSelection = () => {
        this.selectedDateRange = { startDate: null, endDate: null }
    }

    #resetFormatSelection = () => {
        this.selectedFormat = defaultSubsetFileMimeType
    }

    #getCollectionDateRange() {
        const temporalExtents =
            this.collectionWithServices?.collection?.TemporalExtents
        if (!temporalExtents || !temporalExtents.length)
            return {
                startDate: null,
                endDate: null,
            }

        let minStart = null
        let maxEnd = null
        const today = new Date()

        for (const temporal of temporalExtents) {
            for (const range of temporal.RangeDateTimes) {
                const start = new Date(range.BeginningDateTime)
                let end
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
        const showError = this.touchedFields.has('spatial') && !this.spatialSelection
        let boundingRects: any =
            this.collectionWithServices?.collection?.SpatialExtent
                ?.HorizontalSpatialDomain?.Geometry?.BoundingRectangles

        if (boundingRects && !Array.isArray(boundingRects)) {
            boundingRects = [boundingRects]
        }
        return html`
            <terra-accordion>
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
                        : this.spatialSelection && 'w' in this.spatialSelection
                          ? html`<span class="accordion-value"
                                >${this.spatialSelection.w},${this.spatialSelection
                                    .s},${this.spatialSelection.e},${this
                                    .spatialSelection.n}</span
                            >`
                          : this.spatialSelection &&
                              'lat' in this.spatialSelection &&
                              'lng' in this.spatialSelection
                            ? html`<span class="accordion-value"
                                  >${this.spatialSelection.lat},${this
                                      .spatialSelection.lng}</span
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
                        has-shape-selector
                        hide-point-selection
                        .initialValue=${this.spatialSelection ?? ''}
                        @terra-map-change=${this.#handleSpatialChange}
                    ></terra-spatial-picker>
                    ${boundingRects &&
                    Array.isArray(boundingRects) &&
                    boundingRects.length
                        ? html`<div
                              style="display: flex; gap: 16px; margin-top: 15px; color: #31708f;"
                          >
                              ${boundingRects.map(
                                  (rect: any) =>
                                      html`<div>
                                          <strong>Available Range:</strong>
                                          ${rect.WestBoundingCoordinate},
                                          ${rect.SouthBoundingCoordinate},
                                          ${rect.EastBoundingCoordinate},
                                          ${rect.NorthBoundingCoordinate}
                                      </div>`
                              )}
                          </div>`
                        : nothing}
                </div>
            </terra-accordion>
        `
    }

    #handleSpatialChange = (e: TerraMapChangeEvent) => {
        this.#markFieldTouched('spatial')
        const round2 = (n: number) => parseFloat(Number(n).toFixed(2))

        if (e.detail?.bounds) {
            this.spatialSelection = {
                e: round2(e.detail.bounds._northEast.lng),
                n: round2(e.detail.bounds._northEast.lat),
                w: round2(e.detail.bounds._southWest.lng),
                s: round2(e.detail.bounds._southWest.lat),
            }
        } else if (e.detail?.latLng) {
            this.spatialSelection = e.detail.latLng
        } else {
            this.spatialSelection = null
        }
    }

    #resetSpatialSelection = () => {
        this.spatialSelection = null
    }

    #renderVariableSelection() {
        const variables = this.collectionWithServices?.variables || []
        const showError =
            this.touchedFields.has('variables') && this.selectedVariables.length === 0

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
                              >Please select at least one variable</span
                          >`
                        : this.selectedVariables.length
                          ? html`<span class="accordion-value"
                                >${this.selectedVariables.length} selected</span
                            >`
                          : nothing}

                    <button class="reset-btn" @click=${this.#resetVariableSelection}>
                        Reset
                    </button>
                </div>
                <div class="accordion-content">
                    <button
                        class="reset-btn"
                        style="margin-bottom: 10px;"
                        @click=${() => this.#toggleExpandCollapseAll(tree)}
                    >
                        ${allExpanded ? 'Collapse Tree' : 'Expand Tree'}
                    </button>
                    ${variables.length === 0
                        ? html`<p style="color: #666; font-style: italic;">
                              No variables available for this collection.
                          </p>`
                        : this.#renderVariableTree(tree, [])}
                </div>
            </terra-accordion>
        `
    }

    #buildVariableTree(variables: Variable[]): Record<string, any> {
        const root: Record<string, any> = {}
        for (const v of variables) {
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
        return html`
            <div style="margin-left: ${path.length * 20}px;">
                ${Object.entries(node).map(([key, value]: [string, any]) => {
                    const groupPath = [...path, key].join('/')
                    if (value.__isLeaf) {
                        // Leaf node (variable)
                        return html`
                            <div class="option-row">
                                <label class="checkbox-option">
                                    <input
                                        type="checkbox"
                                        .checked=${this.selectedVariables.some(
                                            v => v.name === value.__variable.name
                                        )}
                                        @change=${(e: Event) =>
                                            this.#toggleVariableSelection(
                                                e,
                                                value.__variable
                                            )}
                                    />
                                    <span>${key}</span>
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
        if (checked) {
            if (!this.selectedVariables.some(v => v.name === variable.name)) {
                this.selectedVariables = [...this.selectedVariables, variable]
            }
        } else {
            this.selectedVariables = this.selectedVariables.filter(
                v => v.name !== variable.name
            )
        }
    }

    #markFieldTouched(field: string) {
        this.touchedFields = new Set(this.touchedFields).add(field)
    }

    #resetVariableSelection = () => {
        this.selectedVariables = []
    }

    #renderJobStatus() {
        if (!this.#controller.currentJob?.jobID) {
            return html`<div class="results-section" id="job-status-section">
                <h2 class="results-title">Results:</h2>

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
                <h2 class="results-title">Results:</h2>

                ${this.#controller.currentJob!.status !== 'canceled' &&
                this.#controller.currentJob!.status !== 'failed'
                    ? html` <div class="progress-container">
                          <div class="progress-text">
                              ${this.#controller.currentJob!.progress >= 100
                                  ? html`
                                        <span class="status-complete"
                                            >✓ Search complete</span
                                        >
                                    `
                                  : html`
                                        <span class="spinner"></span>
                                        <span class="status-running"
                                            >Searching for data...
                                            (${this.#controller.currentJob!
                                                .progress}%)</span
                                        >
                                    `}
                          </div>

                          <div class="progress-bar">
                              <div
                                  class="progress-fill"
                                  style="width: ${this.#controller.currentJob!
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
                        >${this.#controller.currentJob!.numInputGranules.toLocaleString()}</span
                    >
                </div>

                ${this.#renderJobMessage()}
                ${this.#controller.currentJob!.errors?.length
                    ? html`
                          <terra-accordion>
                              <div slot="summary">
                                  <span
                                      class="accordion-title"
                                      style="color: #dc3545;"
                                      >Errors
                                      (${this.#controller.currentJob!.errors
                                          .length})</span
                                  >
                              </div>
                              <div class="accordion-content">
                                  <ul
                                      style="color: #dc3545; font-size: 14px; padding-left: 20px;"
                                  >
                                      ${this.#controller.currentJob!.errors.map(
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

                    <button
                        class="tab ${this.selectedTab === 'selected-params'
                            ? 'active'
                            : ''}"
                        @click=${() => (this.selectedTab = 'selected-params')}
                    >
                        Selected Parameters
                    </button>
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

            <div class="footer">
                ${this.#controller.currentJob!.status === Status.SUCCESSFUL ||
                this.#controller.currentJob!.status === Status.COMPLETE_WITH_ERRORS
                    ? html`
                          <div>
                              <div
                                  class="download-dropdown ${this.showDownloadMenu
                                      ? 'open'
                                      : ''}"
                              >
                                  <terra-button
                                      @click=${(e: Event) =>
                                          this.#toggleDownloadMenu(e)}
                                  >
                                      Download Options
                                      <svg
                                          class="dropdown-arrow"
                                          viewBox="0 0 24 24"
                                          fill="currentColor"
                                      >
                                          <path d="M7 10l5 5 5-5z" />
                                      </svg>
                                  </terra-button>

                                  <div
                                      class="download-menu ${this.showDownloadMenu
                                          ? 'open'
                                          : ''}"
                                  >
                                      <button
                                          class="download-option"
                                          @click=${(e: Event) =>
                                              this.#downloadLinksAsTxt(e)}
                                      >
                                          <svg
                                              class="file-icon"
                                              viewBox="0 0 24 24"
                                              fill="currentColor"
                                          >
                                              <path
                                                  d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"
                                              />
                                          </svg>
                                          File List
                                      </button>
                                      <button
                                          class="download-option"
                                          @click=${(e: Event) =>
                                              this.#downloadPythonScript(e)}
                                      >
                                          <svg
                                              class="file-icon"
                                              viewBox="0 0 128 128"
                                              width="16"
                                              height="16"
                                          >
                                              <path
                                                  fill="currentColor"
                                                  d="M49.33 62h29.159C86.606 62 93 55.132 93 46.981V19.183c0-7.912-6.632-13.856-14.555-15.176-5.014-.835-10.195-1.215-15.187-1.191-4.99.023-9.612.448-13.805 1.191C37.098 6.188 35 10.758 35 19.183V30h29v4H23.776c-8.484 0-15.914 5.108-18.237 14.811-2.681 11.12-2.8 17.919 0 29.53C7.614 86.983 12.569 93 21.054 93H31V79.952C31 70.315 39.428 62 49.33 62zm-1.838-39.11c-3.026 0-5.478-2.479-5.478-5.545 0-3.079 2.451-5.581 5.478-5.581 3.015 0 5.479 2.502 5.479 5.581-.001 3.066-2.465 5.545-5.479 5.545zm74.789 25.921C120.183 40.363 116.178 34 107.682 34H97v12.981C97 57.031 88.206 65 78.489 65H49.33C41.342 65 35 72.326 35 80.326v27.8c0 7.91 6.745 12.564 14.462 14.834 9.242 2.717 17.994 3.208 29.051 0C85.862 120.831 93 116.549 93 108.126V97H64v-4h43.682c8.484 0 11.647-5.776 14.599-14.66 3.047-9.145 2.916-17.799 0-29.529zm-41.955 55.606c3.027 0 5.479 2.479 5.479 5.547 0 3.076-2.451 5.579-5.479 5.579-3.015 0-5.478-2.502-5.478-5.579 0-3.068 2.463-5.547 5.478-5.547z"
                                              ></path>
                                          </svg>
                                          Python Script
                                      </button>
                                      <button
                                          class="download-option"
                                          @click=${(e: Event) =>
                                              this.#downloadEarthdataDownload(e)}
                                      >
                                          <svg
                                              class="file-icon"
                                              viewBox="0 0 64 64"
                                              fill="none"
                                              width="16"
                                              height="16"
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
                                      </button>
                                  </div>
                              </div>

                              <terra-button
                                  outline
                                  @click=${() => this.#handleJupyterNotebookClick()}
                                  style="margin-left: 8px;"
                              >
                                  <terra-icon
                                      name="outline-code-bracket"
                                      library="heroicons"
                                      font-size="1.5em"
                                      style="margin-right: 5px;"
                                  ></terra-icon>
                                  Open in Jupyter Notebook
                              </terra-button>
                          </div>
                      `
                    : nothing}
                ${this.#controller.currentJob!.status === 'running'
                    ? html`<button
                          class="btn btn-success"
                          @click=${this.#cancelJob}
                          ?disabled=${this.cancelingGetData}
                      >
                          ${this.cancelingGetData ? 'Canceling...' : 'Cancel request'}
                      </button>`
                    : nothing}

                <div class="job-info">
                    Job ID:
                    <span class="job-id">
                        ${this.bearerToken
                            ? html`<a
                                  href="https://harmony.earthdata.nasa.gov/jobs/${this
                                      .#controller.currentJob!.jobID}"
                                  target="_blank"
                                  >${this.#controller.currentJob!.jobID}</a
                              >`
                            : this.#controller.currentJob!.jobID}
                    </span>
                    <span class="info-icon">?</span>
                </div>
            </div>
        `
    }

    #renderSelectedParams() {
        const collection = this.collectionWithServices?.collection
        const variables = this.selectedVariables.length
            ? this.selectedVariables.map(v => v.name)
            : ['All']
        const dateRange =
            this.selectedDateRange.startDate && this.selectedDateRange.endDate
                ? `${this.selectedDateRange.startDate} to ${this.selectedDateRange.endDate}`
                : '—'
        let spatial = '—'

        if (this.spatialSelection) {
            if ('w' in this.spatialSelection) {
                spatial = `Bounding Box: ${this.spatialSelection.w}, ${this.spatialSelection.s}, ${this.spatialSelection.e}, ${this.spatialSelection.n}`
            } else if (
                'lat' in this.spatialSelection &&
                'lng' in this.spatialSelection
            ) {
                spatial = `Point: ${this.spatialSelection.lat}, ${this.spatialSelection.lng}`
            }
        }

        return html`
            <dl class="params-summary">
                <div>
                    <dt><strong>Dataset</strong></dt>
                    <dd>${collection?.EntryTitle ?? '—'}</dd>
                </div>
                <div>
                    <dt><strong>Variables</strong></dt>
                    <dd>${variables.map(v => html`<div>${v}</div>`)}</dd>
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
        this.#controller.cancelCurrentJob()
    }

    #getData() {
        this.cancelingGetData = false
        this.#touchAllFields() // touch all fields, so errors will show if fields are invalid

        // cancel any existing running job
        this.#controller.cancelCurrentJob()
        this.#controller.currentJob = null

        this.#controller.jobStatusTask.run() // go ahead and create the new job and start polling

        // scroll the job-status-section into view
        setTimeout(() => {
            const el = this.renderRoot.querySelector('#job-status-section')
            el?.scrollIntoView({ behavior: 'smooth' })
        }, 100)

        this.refineParameters = false // reset refine parameters, if the user had previously clicked that button
    }

    #touchAllFields() {
        this.touchedFields = new Set(['variables', 'spatial'])
    }

    #numberOfFilesFoundEstimate() {
        return Math.floor(
            (this.#controller.currentJob!.numInputGranules *
                this.#controller.currentJob!.progress) /
                100
        )
    }

    #getDocumentationLinks() {
        return this.#controller.currentJob!.links.filter(
            link => link.rel === 'stac-catalog-json'
        )
    }

    #getDataLinks() {
        return this.#controller.currentJob!.links.filter(link => link.rel === 'data')
    }

    #hasAtLeastOneSubsetOption() {
        return (
            this.collectionWithServices?.bboxSubset ||
            this.collectionWithServices?.shapeSubset ||
            this.collectionWithServices?.variableSubset ||
            this.collectionWithServices?.temporalSubset
        )
    }

    #hasSpatialSubset() {
        return (
            this.collectionWithServices?.bboxSubset ||
            this.collectionWithServices?.shapeSubset
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
        if (warningStatuses.includes(this.#controller.currentJob!.status)) {
            type = 'warning'
        } else if (errorStatuses.includes(this.#controller.currentJob!.status)) {
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
                ${this.#controller.currentJob!.message}
            </div>
        `
    }

    #estimateJobSize() {
        const collection = this.collectionWithServices?.collection
        if (!collection) return

        const range = this.#getCollectionDateRange()
        let startDate: string | null
        let endDate: string | null
        let links = collection.granuleCount ?? 0

        if (this.selectedDateRange.startDate && this.selectedDateRange.endDate) {
            // Use the user selected date range if available
            startDate = this.selectedDateRange.startDate
            endDate = this.selectedDateRange.endDate
        } else {
            // fallback to the collection's full date range
            startDate = range.startDate
            endDate = range.endDate
        }

        if (!startDate || !endDate) return

        const start = new Date(startDate)
        const end = new Date(endDate)
        const days =
            Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1

        if (range.startDate && range.endDate) {
            const availableDaysInCollection =
                Math.floor(
                    (new Date(range.endDate).getTime() -
                        new Date(range.startDate).getTime()) /
                        (1000 * 60 * 60 * 24)
                ) + 1
            const granulesPerDay = links / availableDaysInCollection

            links = Math.ceil(days * granulesPerDay)
        }

        return { days, links }
    }

    #refineParameters() {
        this.refineParameters = true
    }

    #toggleDownloadMenu(event: Event) {
        event.stopPropagation()
        this.showDownloadMenu = !this.showDownloadMenu
    }

    #downloadLinksAsTxt(event: Event) {
        event.stopPropagation()
        if (!this.#controller.currentJob?.links) {
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
        a.download = `subset_links_${this.#controller.currentJob!.jobID}.txt`
        document.body.appendChild(a)
        a.click()

        document.body.removeChild(a)
        URL.revokeObjectURL(url)

        this.showDownloadMenu = false
    }

    async #downloadPythonScript(event: Event) {
        event.stopPropagation()
        if (!this.#controller.currentJob?.links) {
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

        const content = (await response.text()).replace(
            /{{jobId}}/gi,
            this.#controller.currentJob!.jobID
        )
        const blob = new Blob([content], { type: 'text/plain' })
        const url = URL.createObjectURL(blob)

        // Create a temporary link element and trigger download
        const a = document.createElement('a')
        a.href = url
        a.download = `download_subset_files_${this.#controller.currentJob!.jobID}.py`
        document.body.appendChild(a)
        a.click()

        document.body.removeChild(a)
        URL.revokeObjectURL(url)

        this.showDownloadMenu = false
    }

    async #downloadEarthdataDownload(event: Event) {
        event.stopPropagation()
        if (!this.#controller.currentJob?.links) {
            return
        }

        alert('Sorry, Earthdata Download is not currently supported')

        this.showDownloadMenu = false
    }

    #handleClickOutside(event: MouseEvent) {
        if (!this.showDownloadMenu) {
            return
        }

        const target = event.target as Node
        const downloadDropdown = this.renderRoot.querySelector('.download-dropdown')

        if (downloadDropdown && !downloadDropdown.contains(target)) {
            // hide download menu
            this.showDownloadMenu = false
        }
    }

    #handleJupyterNotebookClick() {
        const jupyterLiteUrl = 'https://gesdisc.github.io/jupyterlite/lab/index.html'
        const jupyterWindow = window.open(jupyterLiteUrl, '_blank')

        if (!jupyterWindow) {
            console.error('Failed to open JupyterLite!')
            return
        }

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
                    source: `from terra_ui_components import TerraDataSubsetter\nsubsetter = TerraDataSubsetter()\n\nsubsetter.jobId = '${this.#controller.currentJob?.jobID}'\n\nsubsetter`,
                    metadata: {
                        trusted: true,
                    },
                    outputs: [],
                    execution_count: null,
                },
            ]

            console.log('posting to JupyterLite ', notebook)

            jupyterWindow.postMessage(
                {
                    type: 'load-notebook',
                    filename: `subset_${this.#controller.currentJob?.jobID}.ipynb`,
                    notebook,
                },
                '*'
            )
        }, 500)
    }
}
