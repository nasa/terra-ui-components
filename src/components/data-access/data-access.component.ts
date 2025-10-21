import { property, state } from 'lit/decorators.js'
import { html, nothing } from 'lit'
import componentStyles from '../../styles/component.styles.js'
import TerraElement from '../../internal/terra-element.js'
import styles from './data-access.styles.js'
import type { CSSResultGroup } from 'lit'
import { DataAccessController } from './data-access.controller.js'
import type { CmrGranule } from '../../metadata-catalog/types.js'
import TerraLoader from '../loader/loader.component.js'
import {
    calculateGranuleSize,
    getGranuleUrl,
} from '../../metadata-catalog/utilities.js'
import TerraIcon from '../icon/icon.component.js'
import { debounce } from '../../internal/debounce.js'
import TerraDatePicker from '../date-picker/date-picker.component.js'
import TerraSpatialPicker from '../spatial-picker/spatial-picker.component.js'
import type { TerraMapChangeEvent } from '../../events/terra-map-change.js'
import type { TerraSliderChangeEvent } from '../../events/terra-slider-change.js'
import type { MapEventDetail } from '../map/type.js'
import { createRef, ref } from 'lit/directives/ref.js'
import {
    createGrid,
    AllCommunityModule,
    ModuleRegistry,
    type GridApi,
    type GridOptions,
    type IDatasource,
    type IGetRowsParams,
    type ICellRendererParams,
} from 'ag-grid-community'
import TerraSlider from '../slider/slider.component.js'
import { getBasePath } from '../../utilities/base-path.js'

/**
 * @summary Short summary of the component's intended use.
 * @documentation https://disc.gsfc.nasa.gov/components/data-access
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
export default class TerraDataAccess extends TerraElement {
    static styles: CSSResultGroup = [componentStyles, styles]
    static dependencies = {
        'terra-loader': TerraLoader,
        'terra-icon': TerraIcon,
        'terra-date-picker': TerraDatePicker,
        'terra-spatial-picker': TerraSpatialPicker,
        'terra-slider': TerraSlider,
    }

    @property({ reflect: true, attribute: 'short-name' })
    shortName?: string

    @property({ reflect: true, attribute: 'version' })
    version?: string

    @state()
    limit = 50

    @state()
    page = 1

    @state()
    search = ''

    @state()
    startDate = ''

    @state()
    endDate = ''

    @state()
    location: MapEventDetail | null = null

    @state()
    cloudCover: { min?: number; max?: number } = { min: undefined, max: undefined }

    @state()
    showDateFilters = false

    @state()
    showSpatialFilters = false

    @state()
    showCloudCoverFilters = false

    @state()
    showDownloadMenu = false

    #controller = new DataAccessController(this)
    #gridApi: GridApi<CmrGranule>
    #gridRef = createRef<HTMLElement>()

    connectedCallback(): void {
        super.connectedCallback()
        ModuleRegistry.registerModules([AllCommunityModule])
    }

    firstUpdated() {
        const datasource: IDatasource = {
            rowCount: undefined, // behave as infinite scroll

            getRows: async (params: IGetRowsParams) => {
                await this.#controller.fetchGranules({
                    collectionEntryId: `${this.shortName}_${this.version}`,
                    startRow: params.startRow,
                    endRow: params.endRow,
                    sortBy: params.sortModel?.[0]?.colId ?? 'title',
                    sortDirection: params.sortModel?.[0]?.sort ?? 'asc',
                    search: this.search,
                    cloudCover: this.cloudCover,
                })

                const lastRow =
                    this.#controller.totalGranules <= params.endRow
                        ? this.#controller.totalGranules
                        : -1

                this.#gridApi.applyColumnState({
                    state: [
                        {
                            colId: 'cloudCover',
                            hide: !this.#controller.cloudCoverRange,
                        },
                    ],
                })

                params.successCallback(this.#controller.granules, lastRow)
            },
        }

        const gridOptions: GridOptions<CmrGranule> = {
            columnDefs: [
                {
                    field: 'title',
                    flex: 3,
                    cellRenderer: (params: ICellRendererParams<CmrGranule>) => {
                        if (!params.data) {
                            return ''
                        }

                        const url = getGranuleUrl(params.data)

                        if (url) {
                            const link = document.createElement('a')
                            link.href = url
                            link.target = '_blank'
                            link.title = url
                            link.textContent = params.data.title

                            return link
                        }

                        const span = document.createElement('span')
                        span.textContent = params.data.title
                        return span
                    },
                },
                {
                    colId: 'size',
                    headerName: 'Size (MB)',
                    valueGetter: g => {
                        if (!g.data) {
                            return undefined
                        }

                        return calculateGranuleSize(g.data, 'MB').toFixed(2)
                    },
                },
                { field: 'timeStart' },
                { field: 'timeEnd' },
                { field: 'cloudCover', hide: true },
            ],
            defaultColDef: {
                flex: 1,
                minWidth: 100,
                sortable: true,
                sortingOrder: ['desc', 'asc', null],
            },
            rowBuffer: 25,
            cacheBlockSize: 50,
            maxConcurrentDatasourceRequests: 2,
            infiniteInitialRowCount: 50,
            rowModelType: 'infinite',
            datasource,
        }

        this.#gridApi = createGrid(this.#gridRef.value!, gridOptions)
    }

    @debounce(500)
    handleSearch(search: string) {
        this.search = search

        this.#gridApi?.purgeInfiniteCache()
    }

    #handleMapChange(event: TerraMapChangeEvent) {
        this.location = event.detail
        this.#gridApi?.purgeInfiniteCache()
    }

    #handleDateChange(event: CustomEvent) {
        const datePicker = event.currentTarget as TerraDatePicker

        if (datePicker.getAttribute('name') === 'startDate') {
            this.startDate = datePicker.selectedDates.startDate ?? ''
        } else if (datePicker.getAttribute('name') === 'endDate') {
            this.endDate = datePicker.selectedDates.startDate ?? ''
        }

        if (this.startDate && this.endDate) {
            this.#gridApi?.purgeInfiniteCache()
        }
    }

    #toggleDownloadMenu(event: Event) {
        event.stopPropagation()
        this.showDownloadMenu = !this.showDownloadMenu
    }

    async #downloadPythonScript(event: Event) {
        event.stopPropagation()

        if (!this.#controller.granules) {
            return
        }

        const response = await fetch(
            getBasePath('assets/data-access/download_files.py.txt')
        )

        if (!response.ok) {
            alert(
                'Sorry, there was a problem generating the Python script. We are investigating the issue.\nYou could try using the Jupyter Notebook in the meantime'
            )
        }

        const content = (await response.text())
            .replace(/{{short_name}}/gi, this.shortName ?? '')
            .replace(/{{version}}/gi, this.version ?? '')
            .replace(
                /{{filter_temporal}}/gi,
                this.startDate && this.endDate
                    ? this.startDate + ',' + this.endDate
                    : ''
            )
            .replace(
                /{{filter_bbox}}/gi,
                this.location?.geoJson?.bbox?.join(',') ?? ''
            )
            .replace(/{{filter_search}}/gi, this.search ?? '')

        const blob = new Blob([content], { type: 'text/plain' })
        const url = URL.createObjectURL(blob)

        // Create a temporary link element and trigger download
        const a = document.createElement('a')
        a.href = url
        a.download = `download_files_${this.shortName}_${this.version}.py`
        document.body.appendChild(a)
        a.click()

        document.body.removeChild(a)
        URL.revokeObjectURL(url)

        this.showDownloadMenu = false
    }

    async #downloadEarthdataDownload(event: Event) {
        event.stopPropagation()

        console.log('downloading earthdata download ', this, this.#gridApi)

        alert('Sorry, Earthdata Download is not currently supported')

        this.showDownloadMenu = false
    }

    #handleJupyterNotebookClick() {
        console.log('opening jupyter notebook ', this, this.#gridApi)
    }

    #handleCloudCoverChange(event: TerraSliderChangeEvent) {
        const cloudCover = event.detail as any
        this.cloudCover = {
            min: cloudCover.startValue ?? undefined,
            max: cloudCover.endValue ?? undefined,
        }
        this.#gridApi?.purgeInfiniteCache()
    }

    render() {
        return html`
            <div class="filters-compact">
                <div class="search-row">
                    <div class="search-icon" aria-hidden="true">🔍</div>
                    <input
                        type="text"
                        class="search-input"
                        placeholder="Search file names"
                        .value=${this.search ?? ''}
                        @input=${(event: Event) => {
                            this.handleSearch(
                                (event.target as HTMLInputElement).value
                            )
                        }}
                    />
                </div>

                <div class="toggle-row">
                    <button
                        class="filter-btn ${this.showDateFilters ? 'active' : ''}"
                        @click=${() => (this.showDateFilters = !this.showDateFilters)}
                    >
                        <terra-icon
                            name="outline-calendar"
                            library="heroicons"
                            font-size="18px"
                        ></terra-icon>
                        <span>Date Range</span>
                    </button>
                    <button
                        class="filter-btn ${this.showSpatialFilters ? 'active' : ''}"
                        @click=${() =>
                            (this.showSpatialFilters = !this.showSpatialFilters)}
                    >
                        <terra-icon
                            name="outline-globe-alt"
                            library="heroicons"
                            font-size="18px"
                        ></terra-icon>
                        <span>Spatial Area</span>
                    </button>

                    ${this.#controller.cloudCoverRange
                        ? html`
                              <button
                                  class="filter-btn ${this.showCloudCoverFilters
                                      ? 'active'
                                      : ''}"
                                  @click=${() =>
                                      (this.showCloudCoverFilters =
                                          !this.showCloudCoverFilters)}
                              >
                                  <terra-icon
                                      name="outline-cloud"
                                      library="heroicons"
                                      font-size="18px"
                                  ></terra-icon>
                                  <span>Cloud Cover</span>
                              </button>
                          `
                        : nothing}
                </div>

                ${this.showDateFilters
                    ? html`
                          <div class="filter-row">
                              <div class="filter-field">
                                  <terra-date-picker
                                      label="Start"
                                      name="startDate"
                                      allow-input
                                      class="inline-control"
                                      .defaultDate=${this.startDate}
                                      @terra-change=${this.#handleDateChange}
                                  ></terra-date-picker>
                              </div>
                              <div class="filter-field">
                                  <terra-date-picker
                                      label="End"
                                      name="endDate"
                                      allow-input
                                      class="inline-control"
                                      .defaultDate=${this.endDate}
                                      @terra-change=${this.#handleDateChange}
                                  ></terra-date-picker>
                              </div>
                              <button
                                  class="clear-btn"
                                  @click=${() => {
                                      this.showDateFilters = false
                                      this.startDate = ''
                                      this.endDate = ''
                                      this.#gridApi?.purgeInfiniteCache()
                                  }}
                                  aria-label="Clear date filters"
                              >
                                  ×
                              </button>
                          </div>
                          <div class="divider"></div>
                      `
                    : nothing}
                ${this.showSpatialFilters
                    ? html`
                          <div class="filter-row">
                              <label style="min-width: 56px;">Spatial:</label>
                              <terra-spatial-picker
                                  class="inline-map"
                                  has-shape-selector
                                  hide-label
                                  @terra-map-change=${this.#handleMapChange}
                              ></terra-spatial-picker>
                              <button
                                  class="clear-btn"
                                  @click=${() => {
                                      this.showSpatialFilters = false
                                      this.location = null
                                      this.#gridApi?.purgeInfiniteCache()
                                  }}
                                  aria-label="Clear spatial filter"
                              >
                                  ×
                              </button>
                          </div>
                          <div class="divider"></div>
                      `
                    : nothing}
                ${this.showCloudCoverFilters
                    ? html`
                          <div class="filter-row">
                              <terra-slider
                                  mode="range"
                                  min=${this.#controller.cloudCoverRange?.min}
                                  max=${this.#controller.cloudCoverRange?.max}
                                  start-value=${this.#controller.cloudCoverRange?.min}
                                  end-value=${this.#controller.cloudCoverRange?.max}
                                  step="0.1"
                                  label="Cloud Cover"
                                  @terra-slider-change=${this.#handleCloudCoverChange}
                                  show-inputs
                              ></terra-slider>
                              <button
                                  class="clear-btn"
                                  @click=${() => {
                                      this.showCloudCoverFilters = false
                                      this.cloudCover = {
                                          min: undefined,
                                          max: undefined,
                                      }
                                      this.#gridApi?.purgeInfiniteCache()
                                  }}
                                  aria-label="Clear cloud cover filters"
                              >
                                  ×
                              </button>
                          </div>
                      `
                    : nothing}

                <div class="results-info">
                    <strong
                        >${this.#controller.totalGranules.toLocaleString()}</strong
                    >
                    files selected
                    ${this.#controller.estimatedSize
                        ? html` (~${this.#controller.estimatedSize})`
                        : nothing}
                </div>
            </div>

            <div class="file-grid" ${ref(this.#gridRef)}></div>

            ${this.#controller.render({
                initial: () => this.#renderLoader(),
                pending: () => nothing,
                complete: () => nothing,
                error: () => nothing,
            })}

            <div>
                <div class="download-dropdown ${this.showDownloadMenu ? 'open' : ''}">
                    <terra-button @click=${(e: Event) => this.#toggleDownloadMenu(e)}>
                        Download Options
                        <svg
                            class="dropdown-arrow"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                        >
                            <path d="M7 10l5 5 5-5z" />
                        </svg>
                    </terra-button>

                    <div class="download-menu ${this.showDownloadMenu ? 'open' : ''}">
                        <button
                            class="download-option"
                            @click=${(e: Event) => this.#downloadPythonScript(e)}
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
                            @click=${(e: Event) => this.#downloadEarthdataDownload(e)}
                        >
                            <svg
                                class="file-icon"
                                viewBox="0 0 64 64"
                                fill="none"
                                width="16"
                                height="16"
                            >
                                <circle cx="32" cy="32" r="28" fill="currentColor" />
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
    }

    #renderLoader(more?: boolean) {
        return html`<div style="display: flex; align-items: center; gap: 10px;">
            <terra-loader indeterminate variant="small"></terra-loader>
            <span>${more ? 'Loading More Granules' : 'Loading Granules'}</span>
        </div>`
    }
}
