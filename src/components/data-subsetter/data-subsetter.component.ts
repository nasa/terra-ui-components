import { html, nothing } from 'lit'
import componentStyles from '../../styles/component.styles.js'
import TerraElement from '../../internal/terra-element.js'
import styles from './data-subsetter.styles.js'
import type { CSSResultGroup } from 'lit'
import { property, state } from 'lit/decorators.js'
import { DataSubsetterController } from './data-subsetter.controller.js'

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

    @property({ reflect: true, attribute: 'collection-concept-id' })
    collectionConceptId: string = 'C1239966755-GES_DISC'

    @property({ reflect: true, attribute: 'variable-concept-id' })
    variableConceptId?: string = 'V2778423892-GES_DISC'

    @state()
    jobId?: string

    #controller = new DataSubsetterController(this)

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

            <div class="section">
                <h2 class="section-title">
                    Download Method
                    <span class="help-icon">?</span>
                </h2>
                <div class="accordion">
                    <div
                        class="accordion-header"
                        onclick="toggleAccordion('download-method')"
                    >
                        <span class="accordion-title">Download Method:</span>
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <span class="accordion-value">
                                <svg
                                    class="icon-scissors"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                >
                                    <path
                                        d="M9.64 7.64c.23-.5.36-1.05.36-1.64 0-2.21-1.79-4-4-4S2 3.79 2 6s1.79 4 4 4c.59 0 1.14-.13 1.64-.36L10 12l-2.36 2.36C7.14 14.13 6.59 14 6 14c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4c0-.59-.13-1.14-.36-1.64L12 14l7 7h3v-1L9.64 7.64zM6 8c-1.1 0-2-.89-2-2s.9-2 2-2 2 .89 2 2-.9 2-2 2zm0 12c-1.1 0-2-.89-2-2s.9-2 2-2 2 .89 2 2-.9 2-2 2zm6-7.5c-.28 0-.5-.22-.5-.5s.22-.5.5-.5.5.22.5.5-.22.5-.5.5zM19 3l-6 6 2 2 7-7V3z"
                                    />
                                </svg>
                                Get File Subsets using OPeNDAP
                            </span>
                            <button class="reset-btn">Reset</button>
                            <span class="chevron">▼</span>
                        </div>
                    </div>
                    <div
                        class="accordion-content hidden"
                        id="download-method-content"
                    >
                        <p style="color: #666; font-style: italic;">
                            TO BE IMPLEMENTED
                        </p>
                    </div>
                </div>
            </div>

            <div class="section">
                <h2 class="section-title">
                    Method Options
                    <span class="help-icon">?</span>
                </h2>

                <div class="accordion" style="margin-bottom: 15px;">
                    <div
                        class="accordion-header"
                        onclick="toggleAccordion('date-range')"
                    >
                        <span class="accordion-title">Refine Date Range:</span>
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <span class="accordion-value"
                                >1998-01-01 to 2025-01-31</span
                            >
                            <button class="reset-btn">Reset</button>
                            <span class="chevron">▼</span>
                        </div>
                    </div>
                    <div class="accordion-content hidden" id="date-range-content">
                        <p style="color: #666; font-style: italic;">
                            TO BE IMPLEMENTED
                        </p>
                    </div>
                </div>

                <div class="accordion" style="margin-bottom: 15px;">
                    <div class="accordion-header" onclick="toggleAccordion('region')">
                        <span class="accordion-title">Refine Region:</span>
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <span class="accordion-value">-180, -90, 180, 90</span>
                            <button class="reset-btn">Reset</button>
                            <span class="chevron">▼</span>
                        </div>
                    </div>
                    <div class="accordion-content hidden" id="region-content">
                        <p style="color: #666; font-style: italic;">
                            TO BE IMPLEMENTED
                        </p>
                    </div>
                </div>

                <div class="option-row">
                    <label class="checkbox-option">
                        <input type="checkbox" id="geo-spatial" />
                        <svg
                            class="icon-scissors"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                        >
                            <path
                                d="M9.64 7.64c.23-.5.36-1.05.36-1.64 0-2.21-1.79-4-4-4S2 3.79 2 6s1.79 4 4 4c.59 0 1.14-.13 1.64-.36L10 12l-2.36 2.36C7.14 14.13 6.59 14 6 14c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4c0-.59-.13-1.14-.36-1.64L12 14l7 7h3v-1L9.64 7.64zM6 8c-1.1 0-2-.89-2-2s.9-2 2-2 2 .89 2 2-.9 2-2 2zm0 12c-1.1 0-2-.89-2-2s.9-2 2-2 2 .89 2 2-.9 2-2 2zm6-7.5c-.28 0-.5-.22-.5-.5s.22-.5.5-.5.5.22.5.5-.22.5-.5.5zM19 3l-6 6 2 2 7-7V3z"
                            />
                        </svg>
                        Use 'Refine Region' for geo-spatial subsetting
                        <span class="help-icon">?</span>
                    </label>
                </div>

                <div class="accordion" style="margin-bottom: 15px;">
                    <div
                        class="accordion-header"
                        onclick="toggleAccordion('variables')"
                    >
                        <span class="accordion-title">Select Variables:</span>
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <span class="accordion-value error"
                                >Please select at least one variable</span
                            >
                            <button class="reset-btn">Reset</button>
                            <span class="chevron">▼</span>
                        </div>
                    </div>
                    <div class="accordion-content hidden" id="variables-content">
                        <p style="color: #666; font-style: italic;">
                            TO BE IMPLEMENTED
                        </p>
                    </div>
                </div>

                <div class="accordion">
                    <div
                        class="accordion-header"
                        onclick="toggleAccordion('dimensions')"
                    >
                        <span class="accordion-title">Select Dimensions:</span>
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <span class="accordion-value"
                                >Get all select dimensions</span
                            >
                            <button class="reset-btn">Reset</button>
                            <span class="chevron">▼</span>
                        </div>
                    </div>
                    <div class="accordion-content hidden" id="dimensions-content">
                        <p style="color: #666; font-style: italic;">
                            TO BE IMPLEMENTED
                        </p>
                    </div>
                </div>
            </div>

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
}
