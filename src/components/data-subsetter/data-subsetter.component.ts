import { html, nothing } from 'lit'
import componentStyles from '../../styles/component.styles.js'
import TerraElement from '../../internal/terra-element.js'
import styles from './data-subsetter.styles.js'
import type { CSSResultGroup } from 'lit'
import { property, state } from 'lit/decorators.js'
import { DataSubsetterController } from './data-subsetter.controller.js'
import TerraAccordion from '../accordion/accordion.component.js'
import type {
    BoundingBox,
    CollectionWithAvailableServices,
    Variable,
} from '../../data-services/types.js'
import TerraDatePicker from '../date-picker/date-picker.component.js'
import TerraIcon from '../icon/icon.component.js'
import TerraSpatialPicker from '../spatial-picker/spatial-picker.component.js'
import type { TerraMapChangeEvent } from '../../events/terra-map-change.js'
import type { LatLng } from '../map/type.js'

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

    @state()
    jobId?: string

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

    #controller = new DataSubsetterController(this)

    firstUpdated() {
        if (this.collectionEntryId) {
            this.showCollectionSearch = false
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

                ${this.#controller.currentJob
                    ? this.#renderJobStatus()
                    : this.#renderSubsetOptions()}
            </div>
        `
    }

    #renderSubsetOptions() {
        return html`
            <div class="size-info">
                <h2>Estimated size of results</h2>
                <div class="size-stats">9,893 days, 474,864 links, 1.21 TB</div>
                <div class="size-warning">
                    You are about to retrieve 474,864 file links from the archive. You
                    may <strong>speed up the request</strong> by limiting the scope of
                    your search.
                </div>
            </div>

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

    #renderDateRangeSelection() {
        return html`
            <terra-accordion>
                <div slot="summary">
                    <span class="accordion-title">Refine Date Range:</span>
                </div>

                <div
                    slot="summary-right"
                    style="display: flex; align-items: center; gap: 10px;"
                >
                    <span class="accordion-value">1998-01-01 to 2025-01-31</span>
                    <button class="reset-btn">Reset</button>
                </div>

                <terra-date-picker
                    label="Date Range"
                    range
                    show-months="2"
                    class="w-full"
                    id="date-range"
                ></terra-date-picker>
            </terra-accordion>
        `
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
                        inline
                        hide-label
                        .initialValue=${this.spatialSelection ?? ''}
                        @terra-map-change=${this.#handleSpatialChange}
                    ></terra-spatial-picker>
                    ${boundingRects &&
                    Array.isArray(boundingRects) &&
                    boundingRects.length
                        ? html`<div style="margin-top: 10px; color: #666;">
                              ${boundingRects.map(
                                  (rect: any) =>
                                      html`<div>
                                          Available Range:
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
        if (!this.#controller.currentJob.jobID) {
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

                ${this.#controller.currentJob.status !== 'canceled' &&
                this.#controller.currentJob.status !== 'failed'
                    ? html` <div class="progress-container">
                          <div class="progress-text">
                              ${this.#controller.currentJob.progress >= 100
                                  ? html`
                                        <span class="status-complete"
                                            >✓ Search complete</span
                                        >
                                    `
                                  : html`
                                        <span class="spinner"></span>
                                        <span class="status-running"
                                            >Searching for data...
                                            (${this.#controller.currentJob
                                                .progress}%)</span
                                        >
                                    `}
                          </div>

                          <div class="progress-bar">
                              <div
                                  class="progress-fill"
                                  style="width: ${this.#controller.currentJob
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
                        >${this.#controller.currentJob.numInputGranules}</span
                    >
                </div>

                ${this.#renderJobMessage()}

                <div class="tabs">
                    <button class="tab active" onclick="switchTab('web-links')">
                        Links
                    </button>
                    <button class="tab" onclick="switchTab('selected-params')">
                        Selected Parameters
                    </button>
                </div>

                <div id="web-links" class="tab-content active">
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

                <div id="selected-params" class="tab-content">
                    <div
                        style="padding: 20px; color: #666; font-style: italic; text-align: center;"
                    >
                        Selected parameters and filters will be displayed here
                    </div>
                </div>
            </div>

            <div class="footer">
                ${this.#controller.currentJob.status === 'running'
                    ? html`<button class="btn btn-success" @click=${this.#cancelJob}>
                          Cancel request
                      </button>`
                    : nothing}

                <div class="job-info">
                    Job ID:
                    <span class="job-id"
                        ><a
                            href="https://harmony.earthdata.nasa.gov/jobs/${this
                                .#controller.currentJob.jobID}"
                            target="_blank"
                            >${this.#controller.currentJob.jobID}</a
                        ></span
                    >
                    <span class="info-icon">?</span>
                </div>
            </div>
        `
    }

    #cancelJob() {
        this.#controller.cancelCurrentJob()
    }

    #getData() {
        this.#touchAllFields()
        this.#controller.jobStatusTask.run()

        // scroll the job-status-section into view
        setTimeout(() => {
            const el = this.renderRoot.querySelector('#job-status-section')
            el?.scrollIntoView({ behavior: 'smooth' })
        }, 100)
    }

    #touchAllFields() {
        this.touchedFields = new Set(['variables', 'spatial'])
    }

    #numberOfFilesFoundEstimate() {
        return Math.floor(
            (this.#controller.currentJob.numInputGranules *
                this.#controller.currentJob.progress) /
                100
        )
    }

    #getDocumentationLinks() {
        return this.#controller.currentJob.links.filter(
            link => link.rel === 'stac-catalog-json'
        )
    }

    #getDataLinks() {
        return this.#controller.currentJob.links.filter(link => link.rel === 'data')
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
        let type = 'normal'
        if (this.#controller.currentJob.status === 'canceled') {
            type = 'warning'
        } else if (this.#controller.currentJob.status === 'failed') {
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
                ${this.#controller.currentJob.message}
            </div>
        `
    }
}
