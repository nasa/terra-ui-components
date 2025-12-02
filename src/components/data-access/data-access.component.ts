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
import { MapEventType } from '../map/type.js'
import { StringifyBoundingBox } from '../map/leaflet-utils.js'
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
import TerraDropdown from '../dropdown/dropdown.component.js'
import TerraMenu from '../menu/menu.component.js'
import TerraMenuItem from '../menu-item/menu-item.component.js'
import TerraButton from '../button/button.component.js'
import type { TerraSelectEvent } from '../../events/terra-select.js'

/**
 * @summary Discover and export collection granules with search, temporal, spatial, and cloud cover filters.
 * @documentation https://terra-ui.netlify.app/components/data-access
 * @status stable
 * @since 1.0
 *
 * @dependency terra-loader
 * @dependency terra-icon
 * @dependency terra-date-picker
 * @dependency terra-spatial-picker
 * @dependency terra-slider
 *
 * @attr short-name - Collection short name used to build the Collection Entry ID.
 * @attr version - Collection version used to build the Collection Entry ID.
 */
export default class TerraDataAccess extends TerraElement {
    static styles: CSSResultGroup = [componentStyles, styles]
    static dependencies = {
        'terra-loader': TerraLoader,
        'terra-icon': TerraIcon,
        'terra-date-picker': TerraDatePicker,
        'terra-spatial-picker': TerraSpatialPicker,
        'terra-slider': TerraSlider,
        'terra-dropdown': TerraDropdown,
        'terra-menu': TerraMenu,
        'terra-menu-item': TerraMenuItem,
        'terra-button': TerraButton,
    }

    @property({ reflect: true, attribute: 'short-name' })
    shortName?: string

    @property({ reflect: true, attribute: 'version' })
    version?: string

    /**
     * When true, the footer will be rendered with slot="footer" for use in a dialog.
     */
    @property({ attribute: 'footer-slot', type: Boolean })
    footerSlot?: boolean

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
    cloudCoverPickerOpen = false

    @state()
    datePickerOpen = false

    @state()
    spatialPickerOpen = false

    datePickerRef = createRef<TerraDatePicker>()
    spatialPickerRef = createRef<TerraSpatialPicker>()
    cloudCoverSliderRef = createRef<TerraSlider>()

    #controller = new DataAccessController(this)
    #gridApi: GridApi<CmrGranule>
    #gridRef = createRef<HTMLElement>()
    #boundHandleCloudCoverClickOutside: ((event: MouseEvent) => void) | null = null

    connectedCallback(): void {
        super.connectedCallback()
        ModuleRegistry.registerModules([AllCommunityModule])
    }

    disconnectedCallback(): void {
        super.disconnectedCallback()
        if (this.#boundHandleCloudCoverClickOutside) {
            document.removeEventListener(
                'click',
                this.#boundHandleCloudCoverClickOutside
            )
            this.#boundHandleCloudCoverClickOutside = null
        }
    }

    #handleCloudCoverClickOutside(event: MouseEvent) {
        const target = event.target as Node
        const dropdown = this.shadowRoot?.querySelector('.cloud-cover-dropdown')
        const filterContainer = dropdown?.closest('.filter')

        if (filterContainer?.contains(target)) {
            return
        }

        this.cloudCoverPickerOpen = false
        if (this.#boundHandleCloudCoverClickOutside) {
            document.removeEventListener(
                'click',
                this.#boundHandleCloudCoverClickOutside
            )
            this.#boundHandleCloudCoverClickOutside = null
        }
    }

    firstVisible(): void {
        this.#initializeGrid()
    }

    #initializeGrid() {
        if (this.#gridApi) {
            // we already have a grid
            return
        }

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

    #handleDateRangeChange(event: CustomEvent) {
        const detail = event.detail
        this.startDate = detail.startDate || ''
        this.endDate = detail.endDate || ''

        if (this.startDate && this.endDate) {
            this.#gridApi?.purgeInfiniteCache()
        }
    }

    #getDateRangeButtonText(): string {
        if (this.startDate && this.endDate) {
            // Format dates to be more readable
            const formatDate = (dateStr: string) => {
                const date = new Date(dateStr)
                return date.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    timeZone: 'UTC',
                })
            }
            return `${formatDate(this.startDate)} – ${formatDate(this.endDate)}`
        }
        return 'Date Range'
    }

    #getSpatialButtonText(): string {
        if (!this.location) {
            return 'Spatial Area'
        }

        try {
            if (this.location.type === MapEventType.POINT && this.location.latLng) {
                const { lat, lng } = this.location.latLng
                return `${lat.toFixed(2)}, ${lng.toFixed(2)}`
            }

            if (this.location.type === MapEventType.BBOX && this.location.bounds) {
                const boundsStr = StringifyBoundingBox(this.location.bounds)
                const coords = boundsStr.split(', ').map(c => parseFloat(c.trim()))

                if (coords.length === 4) {
                    return `${coords[1].toFixed(2)}, ${coords[0].toFixed(2)}, ${coords[3].toFixed(2)}, ${coords[2].toFixed(2)}`
                }

                return boundsStr
            }

            // Check if it's a shape from geoJson
            if (this.location.geoJson?.features?.[0]?.properties) {
                const props = this.location.geoJson.features[0].properties
                // Try to find a name property
                const name =
                    props.LAKE_NAME ||
                    props.COUNTRY ||
                    props.DAM_NAME ||
                    props.TYPE ||
                    props.name
                if (name) {
                    return name
                }
            }

            // Fallback: show bounds if available
            if (this.location.type === MapEventType.BBOX && this.location.bounds) {
                return StringifyBoundingBox(this.location.bounds)
            }
        } catch (error) {
            // If formatting fails, return default
            console.warn('Error formatting spatial selection:', error)
        }

        return 'Spatial Area'
    }

    #toggleDatePicker() {
        this.datePickerOpen = !this.datePickerOpen
        this.datePickerRef.value?.setOpen(this.datePickerOpen)
    }

    #clearDateRange() {
        this.startDate = ''
        this.endDate = ''
        this.datePickerOpen = false
        this.#gridApi?.purgeInfiniteCache()
    }

    #toggleSpatialPicker() {
        // Use setTimeout to ensure the click event has been processed
        setTimeout(() => {
            this.spatialPickerOpen = !this.spatialPickerOpen
            this.spatialPickerRef.value?.setOpen(this.spatialPickerOpen)
        }, 0)
    }

    #clearSpatialFilter() {
        this.location = null
        this.spatialPickerOpen = false
        this.#gridApi?.purgeInfiniteCache()
    }

    #toggleCloudCoverPicker() {
        // Use setTimeout to ensure the click event has been processed
        setTimeout(() => {
            this.cloudCoverPickerOpen = !this.cloudCoverPickerOpen

            if (this.cloudCoverPickerOpen) {
                // Add click-outside handler
                if (!this.#boundHandleCloudCoverClickOutside) {
                    this.#boundHandleCloudCoverClickOutside =
                        this.#handleCloudCoverClickOutside.bind(this)
                    document.addEventListener(
                        'click',
                        this.#boundHandleCloudCoverClickOutside
                    )
                }
            } else {
                // Remove click-outside handler
                if (this.#boundHandleCloudCoverClickOutside) {
                    document.removeEventListener(
                        'click',
                        this.#boundHandleCloudCoverClickOutside
                    )
                    this.#boundHandleCloudCoverClickOutside = null
                }
            }
        }, 0)
    }

    #clearCloudCoverFilter() {
        this.cloudCover = { min: undefined, max: undefined }
        this.cloudCoverPickerOpen = false
        if (this.#boundHandleCloudCoverClickOutside) {
            document.removeEventListener(
                'click',
                this.#boundHandleCloudCoverClickOutside
            )
            this.#boundHandleCloudCoverClickOutside = null
        }
        this.#gridApi?.purgeInfiniteCache()
    }

    #getCloudCoverButtonText(): string {
        if (this.cloudCover.min !== undefined && this.cloudCover.max !== undefined) {
            return `${this.cloudCover.min.toFixed(1)}% – ${this.cloudCover.max.toFixed(1)}%`
        }
        return 'Cloud Cover'
    }

    #handleDownloadSelect(event: TerraSelectEvent) {
        const item = event.detail.item
        const value = item.value || item.getTextLabel()

        if (value === 'python-script') {
            this.#downloadPythonScript(event)
        } else if (value === 'earthdata-download') {
            this.#downloadEarthdataDownload(event)
        }
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

        // Helper function to get bbox string from location
        const getBboxString = (): string => {
            if (!this.location) {
                return ''
            }

            try {
                // For bbox type, use the bounds directly
                if (
                    this.location.type === MapEventType.BBOX &&
                    this.location.bounds
                ) {
                    // StringifyBoundingBox returns format: "lng1, lat1, lng2, lat2" (with spaces)
                    // We need to remove spaces and ensure it's west,south,east,north
                    const boundsStr = StringifyBoundingBox(this.location.bounds)
                    // Remove spaces and split to verify format
                    const coords = boundsStr.split(',').map(c => parseFloat(c.trim()))
                    if (coords.length === 4) {
                        // StringifyBoundingBox returns: west, south, east, north already
                        return coords.join(',')
                    }
                    return boundsStr.replace(/\s+/g, '')
                }

                // For point type, create a small bbox around the point (0.01 degree buffer)
                if (
                    this.location.type === MapEventType.POINT &&
                    this.location.latLng
                ) {
                    const { lat, lng } = this.location.latLng
                    const buffer = 0.01
                    // Format: west,south,east,north
                    return `${(lng - buffer).toFixed(2)},${(lat - buffer).toFixed(2)},${(lng + buffer).toFixed(2)},${(lat + buffer).toFixed(2)}`
                }

                // For shapes (geoJson), try to extract bbox from geoJson
                if (
                    this.location.geoJson?.bbox &&
                    Array.isArray(this.location.geoJson.bbox)
                ) {
                    // GeoJSON bbox format is [west, south, east, north] which matches CMR format
                    return this.location.geoJson.bbox.join(',')
                }

                // Fallback: try to get bbox from geoJson features if available
                if (this.location.geoJson?.features?.[0]?.geometry) {
                    const geometry = this.location.geoJson.features[0].geometry
                    if (geometry.type === 'Point' && geometry.coordinates) {
                        const [lng, lat] = geometry.coordinates
                        const buffer = 0.01
                        return `${(lng - buffer).toFixed(2)},${(lat - buffer).toFixed(2)},${(lng + buffer).toFixed(2)},${(lat + buffer).toFixed(2)}`
                    }
                }
            } catch (error) {
                console.warn('Error formatting bbox for Python script:', error)
            }

            return ''
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
            .replace(/{{filter_bbox}}/gi, getBboxString())
            .replace(/{{filter_search}}/gi, this.search ?? '')
            .replace(
                /{{filter_cloud_cover_min}}/gi,
                this.cloudCover.min?.toString() ?? ''
            )
            .replace(
                /{{filter_cloud_cover_max}}/gi,
                this.cloudCover.max?.toString() ?? ''
            )

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
    }

    async #downloadEarthdataDownload(event: Event) {
        event.stopPropagation()

        console.log('downloading earthdata download ', this, this.#gridApi)

        alert('Sorry, Earthdata Download is not currently supported')
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
                    <div class="filter">
                        <button
                            class="filter-btn ${this.startDate && this.endDate
                                ? 'active'
                                : ''}"
                            @click=${this.#toggleDatePicker}
                        >
                            <terra-icon
                                name="outline-calendar"
                                library="heroicons"
                                font-size="18px"
                            ></terra-icon>
                            <span>${this.#getDateRangeButtonText()}</span>
                            ${this.startDate && this.endDate
                                ? html`
                                      <button
                                          class="clear-badge"
                                          @click=${(e: Event) => {
                                              e.stopPropagation()
                                              this.#clearDateRange()
                                          }}
                                          aria-label="Clear date range"
                                      >
                                          ×
                                      </button>
                                  `
                                : nothing}
                        </button>

                        <!-- hidden date picker to show when clicking the filter -->
                        <terra-date-picker
                            ${ref(this.datePickerRef)}
                            range
                            hide-label
                            enable-time
                            hide-input
                            show-presets
                            .startDate=${this.startDate}
                            .endDate=${this.endDate}
                            .minDate=${this.#controller.granuleMinDate}
                            .maxDate=${this.#controller.granuleMaxDate}
                            @terra-date-range-change=${this.#handleDateRangeChange}
                        ></terra-date-picker>
                    </div>

                    <div class="filter">
                        <button
                            class="filter-btn ${this.location ? 'active' : ''}"
                            @click=${(e: Event) => {
                                e.stopPropagation()
                                this.#toggleSpatialPicker()
                            }}
                        >
                            <terra-icon
                                name="outline-globe-alt"
                                library="heroicons"
                                font-size="18px"
                            ></terra-icon>
                            <span>${this.#getSpatialButtonText()}</span>
                            ${this.location
                                ? html`
                                      <button
                                          class="clear-badge"
                                          @click=${(e: Event) => {
                                              e.stopPropagation()
                                              this.#clearSpatialFilter()
                                          }}
                                          aria-label="Clear spatial filter"
                                      >
                                          ×
                                      </button>
                                  `
                                : nothing}
                        </button>

                        <!-- hidden spatial picker to show when clicking the filter -->
                        <terra-spatial-picker
                            ${ref(this.spatialPickerRef)}
                            has-shape-selector
                            hide-label
                            @terra-map-change=${this.#handleMapChange}
                        ></terra-spatial-picker>
                    </div>

                    ${this.#controller.cloudCoverRange
                        ? html`
                              <div class="filter">
                                  <button
                                      class="filter-btn ${this.cloudCover.min !==
                                          undefined &&
                                      this.cloudCover.max !== undefined
                                          ? 'active'
                                          : ''}"
                                      @click=${(e: Event) => {
                                          e.stopPropagation()
                                          this.#toggleCloudCoverPicker()
                                      }}
                                  >
                                      <terra-icon
                                          name="outline-cloud"
                                          library="heroicons"
                                          font-size="18px"
                                      ></terra-icon>
                                      <span>${this.#getCloudCoverButtonText()}</span>
                                      ${this.cloudCover.min !== undefined &&
                                      this.cloudCover.max !== undefined
                                          ? html`
                                                <button
                                                    class="clear-badge"
                                                    @click=${(e: Event) => {
                                                        e.stopPropagation()
                                                        this.#clearCloudCoverFilter()
                                                    }}
                                                    aria-label="Clear cloud cover filter"
                                                >
                                                    ×
                                                </button>
                                            `
                                          : nothing}
                                  </button>

                                  <!-- hidden slider to show when clicking the filter -->
                                  <div
                                      class="cloud-cover-dropdown ${this
                                          .cloudCoverPickerOpen
                                          ? 'open'
                                          : ''}"
                                      @click=${(e: Event) => e.stopPropagation()}
                                  >
                                      <terra-slider
                                          ${ref(this.cloudCoverSliderRef)}
                                          mode="range"
                                          min=${this.#controller.cloudCoverRange?.min}
                                          max=${this.#controller.cloudCoverRange?.max}
                                          start-value=${this.cloudCover.min ??
                                          this.#controller.cloudCoverRange?.min}
                                          end-value=${this.cloudCover.max ??
                                          this.#controller.cloudCoverRange?.max}
                                          step="0.1"
                                          hide-label
                                          label="Cloud Cover"
                                          @terra-slider-change=${this
                                              .#handleCloudCoverChange}
                                          show-inputs
                                      ></terra-slider>
                                  </div>
                              </div>
                          `
                        : nothing}
                </div>

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

            <div class="grid-container" style="position: relative;">
                <div class="file-grid" ${ref(this.#gridRef)}></div>

                ${this.#controller.render({
                    initial: () => this.#renderLoadingOverlay(),
                    pending: () => this.#renderLoadingOverlay(),
                    complete: () => nothing,
                    error: () => nothing,
                })}
            </div>

            ${this.footerSlot
                ? html`
                      <div
                          slot="footer"
                          style="margin-top: 15px; display: flex; align-items: center; gap: 8px;"
                      >
                          <terra-dropdown @terra-select=${this.#handleDownloadSelect}>
                              <terra-button slot="trigger" caret>
                                  Download Options
                              </terra-button>
                              <terra-menu>
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

                          <terra-button
                              outline
                              @click=${() => this.#handleJupyterNotebookClick()}
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
                : html`
                      <div
                          style="margin-top: 15px; display: flex; align-items: center; gap: 8px;"
                      >
                          <terra-dropdown @terra-select=${this.#handleDownloadSelect}>
                              <terra-button slot="trigger" caret>
                                  Download Options
                              </terra-button>
                              <terra-menu>
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

                          <terra-button
                              outline
                              @click=${() => this.#handleJupyterNotebookClick()}
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
                  `}
        `
    }

    #renderLoadingOverlay() {
        return html` <div class="loading-modal">
            <terra-loader indeterminate variant="small"></terra-loader>
            <span>Loading</span>
        </div>`
    }
}
