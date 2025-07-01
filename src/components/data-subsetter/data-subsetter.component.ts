import { html, nothing } from 'lit'
import componentStyles from '../../styles/component.styles.js'
import TerraElement from '../../internal/terra-element.js'
import styles from './data-subsetter.styles.js'
import type { CSSResultGroup } from 'lit'
import { property, state } from 'lit/decorators.js'
import { DataSubsetterController } from './data-subsetter.controller.js'
import TerraAccordion from '../accordion/accordion.component.js'
import { watch } from '../../internal/watch.js'
import type { CollectionWithAvailableServices } from '../../data-services/types.js'

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
    }

    @property({ reflect: true, attribute: 'collection-entry-id' })
    collectionEntryId?: string

    @property({ reflect: true, attribute: 'variable-concept-id' })
    variableConceptId?: string

    @property({ reflect: true, type: Boolean, attribute: 'show-collection-search' })
    showCollectionSearch?: boolean = true

    @state()
    jobId?: string

    @state()
    collectionWithServices?: CollectionWithAvailableServices

    #controller = new DataSubsetterController(this)

    firstUpdated() {
        if (this.collectionEntryId) {
            this.showCollectionSearch = false
        }
    }

    @watch(['collectionEntryId'])
    collectionEntryIdChanged() {
        console.log('entry id is now ', this.collectionEntryId)
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
                        Get GPM IMERG Final Precipitation L3 Half Hourly 0.1 degree x
                        0.1 degree V07 data
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

            <div class="section">
                <h2 class="section-title">
                    Output format
                    <span class="help-icon">?</span>
                </h2>
                <div class="accordion">
                    <div
                        class="accordion-header"
                        onclick="toggleAccordion('file-format')"
                    >
                        <span class="accordion-title">File Format:</span>
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <span class="accordion-value error"
                                >Please choose a format</span
                            >
                            <button class="reset-btn">Reset</button>
                            <span class="chevron">▼</span>
                        </div>
                    </div>
                    <div class="accordion-content hidden" id="file-format-content">
                        <p style="color: #666; font-style: italic;">
                            TO BE IMPLEMENTED
                        </p>
                    </div>
                </div>
            </div>

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

                <p style="color: #666; font-style: italic;">TO BE IMPLEMENTED</p>
            </terra-accordion>
        `
    }

    #renderSpatialSelection() {
        return html`
            <terra-accordion>
                <div slot="summary">
                    <span class="accordion-title">Refine Region:</span>
                </div>

                <div
                    slot="summary-right"
                    style="display: flex; align-items: center; gap: 10px;"
                >
                    <span class="accordion-value">-180, -90, 180, 90</span>
                    <button class="reset-btn">Reset</button>
                </div>

                <p style="color: #666; font-style: italic;">TO BE IMPLEMENTED</p>
            </terra-accordion>
        `
    }

    #renderVariableSelection() {
        return html`
            <terra-accordion>
                <div slot="summary">
                    <span class="accordion-title">Select Variables:</span>
                </div>

                <div
                    slot="summary-right"
                    style="display: flex; align-items: center; gap: 10px;"
                >
                    <span class="accordion-value error"
                        >Please select at least one variable</span
                    >
                    <button class="reset-btn">Reset</button>
                </div>

                <p style="color: #666; font-style: italic;">TO BE IMPLEMENTED</p>
            </terra-accordion>
        `
    }

    #renderJobStatus() {
        return html`
            <div class="results-section" id="job-status-section">
                <h2 class="results-title">Results:</h2>

                <div class="progress-container">
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
                                      (${this.#controller.currentJob.progress}%)</span
                                  >
                              `}
                    </div>

                    <div class="progress-bar">
                        <div
                            class="progress-fill"
                            style="width: ${this.#controller.currentJob.progress}%"
                        ></div>
                    </div>
                </div>

                <div class="search-status">
                    <span class="file-count"
                        >Found ${this.#numberOfFilesFoundEstimate()} files</span
                    >
                    out of estimated
                    <span class="estimated-total"
                        >${this.#controller.currentJob.numInputGranules}</span
                    >, continuing the search.
                </div>

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
                <button class="btn btn-success" onclick="cancelRequest()">
                    Cancel request
                </button>

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

    #getData() {
        this.#controller.jobStatusTask.run()

        // scroll the job-status-section into view
        setTimeout(() => {
            const el = this.renderRoot.querySelector('#job-status-section')
            el?.scrollIntoView({ behavior: 'smooth' })
        }, 100)
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
}
