import { property, state } from 'lit/decorators.js'
import { html, nothing } from 'lit'
import componentStyles from '../../styles/component.styles.js'
import TerraElement from '../../internal/terra-element.js'
import styles from './data-access.styles.js'
import type { CSSResultGroup } from 'lit'
import TerraLoader from '../loader/loader.component.js'
import { getGranuleUrl } from '../../metadata-catalog/utilities.js'
import TerraIcon from '../icon/icon.component.js'
import { debounce } from '../../internal/debounce.js'
import { watch } from '../../internal/watch.js'
import TerraDatePicker from '../date-picker/date-picker.component.js'
import TerraSpatialPicker from '../spatial-picker/spatial-picker.component.js'
import type { TerraMapChangeEvent } from '../../events/terra-map-change.js'
import type { TerraSliderChangeEvent } from '../../events/terra-slider-change.js'
import type { MapEventDetail } from '../map/type.js'
import { MapEventType } from '../map/type.js'
import { StringifyBoundingBox } from '../map/leaflet-utils.js'
import { createRef, ref } from 'lit/directives/ref.js'
import type {
    IDatasource,
    IGetRowsParams,
    ICellRendererParams,
    ColDef,
    GridApi,
} from 'ag-grid-community'
import TerraSlider from '../slider/slider.component.js'
import TerraDataGrid from '../data-grid/data-grid.component.js'
import { getBasePath } from '../../utilities/base-path.js'
import TerraDropdown from '../dropdown/dropdown.component.js'
import TerraMenu from '../menu/menu.component.js'
import TerraMenuItem from '../menu-item/menu-item.component.js'
import TerraButton from '../button/button.component.js'
import type { TerraSelectEvent } from '../../events/terra-select.js'
import TerraAlert from '../alert/alert.component.js'
import { QueryClientMixin } from '../../queries/query-client.mixin.js'
import { queryCmrGranules } from '../../queries/nasa-cmr.queries.js'
import type { SearchGranulesParams } from '../../apis/nasa-cmr.api.js'
import type { UmmG, UmmResult } from '../../types/cmr.js'
import DataAccessService from './data-access.service.js'
import { QueryController } from '../../queries/query.controller.js'

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
 * @dependency terra-data-grid
 *
 * @attr short-name - Collection short name used to build the Collection Entry ID.
 * @attr version - Collection version used to build the Collection Entry ID.
 */
export default class TerraDataAccess extends QueryClientMixin(TerraElement) {
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
        'terra-data-grid': TerraDataGrid,
        'terra-alert': TerraAlert,
    }

    service = new DataAccessService()

    @property({ reflect: true, attribute: 'collection-entry-id' })
    collectionEntryId?: string

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
    searchParams: SearchGranulesParams = {
        pageSize: 50,
        offset: 0,
        search: '',
        sortBy: 'title',
        sortDirection: 'asc',
        cloudCover: { min: undefined, max: undefined },
    }

    @state() loading = false
    @state() totalGranules = 0
    @state() estimatedSize: string | null = null
    @state() isSubDaily = false
    @state() granuleMinDate: Date | null = null
    @state() granuleMaxDate: Date | null = null
    @state() spatialConstraints: string = '-180, -90, 180, 90'
    @state() cloudCoverRange: { min: number; max: number } | null = null
    @state() private _gridInitialized = false
    @state() cloudCoverPickerOpen = false

    datePickerRef = createRef<TerraDatePicker>()
    spatialPickerRef = createRef<TerraSpatialPicker>()
    cloudCoverSliderRef = createRef<TerraSlider>()
    gridRef = createRef<TerraDataGrid<UmmResult<UmmG>>>()

    #boundHandleCloudCoverClickOutside: ((event: MouseEvent) => void) | null = null

    firstGranuleQuery = new QueryController(this, () =>
        queryCmrGranules({
            collectionEntryId: this.collectionEntryId,
            pageSize: 1,
            sortBy: 'start_date',
            sortDirection: 'asc',
        })
    )

    lastGranuleQuery = new QueryController(this, () =>
        queryCmrGranules({
            collectionEntryId: this.collectionEntryId,
            pageSize: 1,
            sortBy: 'start_date',
            sortDirection: 'desc',
        })
    )

    @watch(['shortName', 'version'])
    handleShortNameOrVersionChange() {
        if (this.shortName && this.version && !this.collectionEntryId) {
            this.collectionEntryId = `${this.shortName}_${this.version}`
        }
    }

    @watch('collectionEntryId')
    handleCollectionChange() {
        // Reset grid when collection changes
        if (this._gridInitialized && this.isVisible) {
            this._gridInitialized = false
            this.firstVisible()
        }
    }

    get #gridApi(): GridApi<UmmResult<UmmG>> | undefined {
        return this.gridRef.value?.getGridApi()
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

    async firstVisible(): Promise<void> {
        this.#initializeGrid()
    }

    #initializeGrid() {
        if (!this.gridRef.value || this._gridInitialized) {
            return
        }

        this._gridInitialized = true

        const datasource: IDatasource = {
            rowCount: undefined, // behave as infinite scroll

            getRows: async (params: IGetRowsParams) => {
                this.loading = true

                const queryOptions = queryCmrGranules({
                    collectionEntryId: this.collectionEntryId,
                    ...this.searchParams,
                    pageSize: params.endRow - params.startRow,
                    offset: params.startRow,
                    sortBy: params.sortModel?.[0]?.colId ?? 'title',
                    sortDirection: params.sortModel?.[0]?.sort ?? 'asc',
                })

                const data = await this.queryClient.ensureQueryData(queryOptions)

                this.loading = false

                if (!data || !data?.hits || !data?.items) {
                    // TODO: handle this case, show an error? likely means the request failed because CMR is down
                    params.failCallback()
                    return
                }

                this.totalGranules = data.hits
                this.estimatedSize = this.service.getEstimatedGranuleSize(
                    this.firstGranuleQuery.result?.data?.items?.[0]?.umm,
                    this.lastGranuleQuery.result?.data?.items?.[0]?.umm,
                    this.totalGranules
                )
                this.granuleMinDate = this.service.granuleMinDate(
                    this.firstGranuleQuery.result?.data?.items?.[0]?.umm
                )
                this.granuleMaxDate = this.service.granuleMaxDate(
                    this.lastGranuleQuery.result?.data?.items?.[0]?.umm
                )
                this.isSubDaily = this.service.isSubDaily(
                    this.firstGranuleQuery.result?.data?.items?.[0]?.umm
                )

                const lastRow = data.hits <= params.endRow ? data.hits : -1

                params.successCallback(data.items, lastRow)
            },
        }

        const columnDefs: ColDef<UmmResult<UmmG>>[] = [
            {
                field: 'umm.GranuleUR',
                headerName: 'Title',
                flex: 3,
                cellRenderer: (params: ICellRendererParams<UmmResult<UmmG>>) => {
                    if (!params.data) {
                        return ''
                    }

                    const url = getGranuleUrl(params.data.umm)

                    if (url) {
                        const link = document.createElement('a')
                        link.href = url
                        link.target = '_blank'
                        link.title = url
                        link.textContent = params.data.umm.GranuleUR

                        return link
                    }

                    const span = document.createElement('span')
                    span.textContent = params.data.umm.GranuleUR
                    return span
                },
            },
            {
                colId: 'umm.DataGranule.Size',
                headerName: 'Size (MB)',
                valueGetter: g => {
                    if (!g.data) {
                        return undefined
                    }

                    return this.service
                        .calculateGranuleSize(g.data.umm, 'MB')
                        .toFixed(2)
                },
            },
            {
                field: 'umm.TemporalExtent.RangeDateTime.BeginningDateTime',
                headerName: 'Start Date',
            },
            {
                field: 'umm.TemporalExtent.RangeDateTime.EndingDateTime',
                headerName: 'End Date',
            },
            { field: 'umm.CloudCover', hide: true, headerName: 'Cloud Cover (%)' },
        ]

        // Configure terra-data-grid component
        this.gridRef.value.rowModelType = 'infinite'
        this.gridRef.value.columnDefs = columnDefs
        this.gridRef.value.datasource = datasource
        this.gridRef.value.gridOptions = {
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
        }
    }

    @debounce(500)
    handleSearch(search: string) {
        this.searchParams = {
            ...this.searchParams,
            search,
        }

        this.#gridApi?.purgeInfiniteCache()
    }

    #handleMapChange(event: TerraMapChangeEvent) {
        this.#updateLocation(event.detail)
    }

    #handleSpatialDropdownShow() {
        // Trigger invalidateSize on the map when dropdown opens
        // This ensures the Leaflet map recalculates its size correctly
        setTimeout(() => {
            this.spatialPickerRef.value?.invalidateSize()
        }, 0)
    }

    #handleDateRangeChange(event: CustomEvent) {
        const detail = event.detail

        this.searchParams = {
            ...this.searchParams,
            startDate: detail.startDate || '',
            endDate: detail.endDate || '',
        }

        this.#gridApi?.purgeInfiniteCache()
    }

    #getDateRangeButtonText(): string {
        if (this.searchParams.startDate && this.searchParams.endDate) {
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
            return `${formatDate(this.searchParams.startDate)} – ${formatDate(this.searchParams.endDate)}`
        }
        return 'Date Range'
    }

    #getSpatialButtonText(): string {
        if (!this.searchParams.location) {
            return 'Spatial Area'
        }

        try {
            if (
                this.searchParams.location.type === MapEventType.POINT &&
                this.searchParams.location.latLng
            ) {
                const { lat, lng } = this.searchParams.location.latLng
                return `${lat.toFixed(2)}, ${lng.toFixed(2)}`
            }

            if (
                this.searchParams.location.type === MapEventType.BBOX &&
                this.searchParams.location.bounds
            ) {
                const boundsStr = StringifyBoundingBox(
                    this.searchParams.location.bounds
                )
                const coords = boundsStr.split(', ').map(c => parseFloat(c.trim()))

                if (coords.length === 4) {
                    return `${coords[1].toFixed(2)}, ${coords[0].toFixed(2)}, ${coords[3].toFixed(2)}, ${coords[2].toFixed(2)}`
                }

                return boundsStr
            }

            // Check if it's a shape from geoJson
            if (this.searchParams.location.geoJson?.features?.[0]?.properties) {
                const props =
                    this.searchParams.location.geoJson.features[0].properties
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
            if (
                this.searchParams.location.type === MapEventType.BBOX &&
                this.searchParams.location.bounds
            ) {
                return StringifyBoundingBox(this.searchParams.location.bounds)
            }
        } catch (error) {
            // If formatting fails, return default
            console.warn('Error formatting spatial selection:', error)
        }

        return 'Spatial Area'
    }

    // Date picker is now handled by dropdown component

    #clearDateRange() {
        this.searchParams.startDate = ''
        this.searchParams.endDate = ''
        this.#gridApi?.purgeInfiniteCache()
    }

    #updateLocation(location: MapEventDetail | null) {
        this.searchParams.location = location
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
        this.#updateCloudCover({ min: undefined, max: undefined })

        this.cloudCoverPickerOpen = false
        if (this.#boundHandleCloudCoverClickOutside) {
            document.removeEventListener(
                'click',
                this.#boundHandleCloudCoverClickOutside
            )
            this.#boundHandleCloudCoverClickOutside = null
        }
    }

    #getCloudCoverButtonText(): string {
        if (
            this.searchParams.cloudCover?.min !== undefined &&
            this.searchParams.cloudCover?.max !== undefined
        ) {
            return `${this.searchParams.cloudCover?.min.toFixed(1)}% – ${this.searchParams.cloudCover?.max.toFixed(1)}%`
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
            if (!this.searchParams.location) {
                return ''
            }

            try {
                // For bbox type, use the bounds directly
                if (
                    this.searchParams.location.type === MapEventType.BBOX &&
                    this.searchParams.location.bounds
                ) {
                    // StringifyBoundingBox returns format: "lng1, lat1, lng2, lat2" (with spaces)
                    // We need to remove spaces and ensure it's west,south,east,north
                    const boundsStr = StringifyBoundingBox(
                        this.searchParams.location.bounds
                    )
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
                    this.searchParams.location.type === MapEventType.POINT &&
                    this.searchParams.location.latLng
                ) {
                    const { lat, lng } = this.searchParams.location.latLng
                    const buffer = 0.01
                    // Format: west,south,east,north
                    return `${(lng - buffer).toFixed(2)},${(lat - buffer).toFixed(2)},${(lng + buffer).toFixed(2)},${(lat + buffer).toFixed(2)}`
                }

                // For shapes (geoJson), try to extract bbox from geoJson
                if (
                    this.searchParams.location.geoJson?.bbox &&
                    Array.isArray(this.searchParams.location.geoJson.bbox)
                ) {
                    // GeoJSON bbox format is [west, south, east, north] which matches CMR format
                    return this.searchParams.location.geoJson.bbox.join(',')
                }

                // Fallback: try to get bbox from geoJson features if available
                if (this.searchParams.location.geoJson?.features?.[0]?.geometry) {
                    const geometry =
                        this.searchParams.location.geoJson.features[0].geometry
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
                this.searchParams.startDate && this.searchParams.endDate
                    ? this.searchParams.startDate + ',' + this.searchParams.endDate
                    : ''
            )
            .replace(/{{filter_bbox}}/gi, getBboxString())
            .replace(/{{filter_search}}/gi, this.searchParams.search ?? '')
            .replace(
                /{{filter_cloud_cover_min}}/gi,
                this.searchParams.cloudCover?.min?.toString() ?? ''
            )
            .replace(
                /{{filter_cloud_cover_max}}/gi,
                this.searchParams.cloudCover?.max?.toString() ?? ''
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
        alert('Sorry, Earthdata Download is not currently supported')
    }

    #handleCloudCoverChange(event: TerraSliderChangeEvent) {
        const cloudCover = event.detail as any
        this.#updateCloudCover({
            min: cloudCover.startValue ?? undefined,
            max: cloudCover.endValue ?? undefined,
        })
    }

    #updateCloudCover(cloudCover: { min?: number; max?: number }) {
        this.searchParams = {
            ...this.searchParams,
            cloudCover: {
                min: cloudCover.min,
                max: cloudCover.max,
            },
        }
        this.#gridApi?.purgeInfiniteCache()
    }

    render() {
        /*
        TODO: fix this check for no granules, it currently doesn't work because the firstGranuleQuery is not guaranteed to have completed yet when this render function is called. We need to wait for the query to complete before checking the result.
        if (this.firstGranuleQuery.result?.data?.items?.length === 0) {
            return html`
                <terra-alert variant="warning" open appearance="white">
                    <strong>No granules found.</strong>
                    <p>
                        This collection does not have any granules available to access
                        or subset.
                    </p>
                </terra-alert>
            `
        }*/

        return html`
            <div class="filters-compact">
                <div class="search-row">
                    <div class="search-icon" aria-hidden="true">🔍</div>
                    <input
                        type="text"
                        class="search-input"
                        placeholder="Search file names"
                        .value=${this.searchParams.search ?? ''}
                        @input=${(event: Event) => {
                            this.handleSearch(
                                (event.target as HTMLInputElement).value
                            )
                        }}
                    />
                </div>

                <div class="toggle-row">
                    <terra-dropdown>
                        <button
                            slot="trigger"
                            class="filter-btn ${this.searchParams.startDate &&
                            this.searchParams.endDate
                                ? 'active'
                                : ''}"
                        >
                            <terra-icon
                                name="outline-calendar"
                                library="heroicons"
                                font-size="18px"
                            ></terra-icon>
                            <span>${this.#getDateRangeButtonText()}</span>
                            ${this.searchParams.startDate && this.searchParams.endDate
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

                        <div class="datepicker-container">
                            <terra-date-picker
                                ${ref(this.datePickerRef)}
                                range
                                ?enable-time=${this.isSubDaily}
                                show-presets
                                split-inputs
                                inline
                                .startDate=${this.searchParams.startDate}
                                .endDate=${this.searchParams.endDate}
                                .startPlaceholder=${this.isSubDaily
                                    ? 'YYYY-MM-DD HH:mm:ss'
                                    : 'YYYY-MM-DD'}
                                .endPlaceholder=${this.isSubDaily
                                    ? 'YYYY-MM-DD HH:mm:ss'
                                    : 'YYYY-MM-DD'}
                                .minDate=${this.granuleMinDate}
                                .maxDate=${this.granuleMaxDate}
                                @terra-date-range-change=${this
                                    .#handleDateRangeChange}
                            >
                                ${this.granuleMinDate && this.granuleMaxDate
                                    ? html` <p
                                          slot="additional-text"
                                          class="available-range"
                                      >
                                          <strong>Available Range:</strong>
                                          ${this.service.formatAvailableRangeDate(
                                              this.granuleMinDate,
                                              this.isSubDaily
                                          )}
                                          -
                                          ${this.service.formatAvailableRangeDate(
                                              this.granuleMaxDate,
                                              this.isSubDaily
                                          )}
                                      </p>`
                                    : nothing}
                            </terra-date-picker>
                        </div>
                    </terra-dropdown>

                    <terra-dropdown
                        placement="bottom-start"
                        distance="4"
                        hoist
                        @terra-show=${this.#handleSpatialDropdownShow}
                    >
                        <div slot="trigger" class="filter">
                            <button
                                class="filter-btn ${this.searchParams.location
                                    ? 'active'
                                    : ''}"
                            >
                                <terra-icon
                                    name="outline-globe-alt"
                                    library="heroicons"
                                    font-size="18px"
                                ></terra-icon>
                                <span>${this.#getSpatialButtonText()}</span>
                                ${this.searchParams.location
                                    ? html`
                                          <button
                                              class="clear-badge"
                                              @click=${(e: Event) => {
                                                  e.stopPropagation()
                                                  this.#updateLocation(null)
                                              }}
                                              aria-label="Clear spatial filter"
                                          >
                                              ×
                                          </button>
                                      `
                                    : nothing}
                            </button>
                        </div>

                        <div class="spatialpicker-container">
                            <terra-spatial-picker
                                ${ref(this.spatialPickerRef)}
                                hide-label
                                inline
                                no-world-wrap
                                .spatialConstraints=${this.spatialConstraints}
                                @terra-map-change=${this.#handleMapChange}
                            >
                                <p class="available-range" slot="additional-text">
                                    <strong>Available range:</strong> ${this
                                        .spatialConstraints}
                                </p>
                            </terra-spatial-picker>
                        </div>
                    </terra-dropdown>

                    ${this.cloudCoverRange
                        ? html`
                              <div class="filter">
                                  <button
                                      class="filter-btn ${this.searchParams.cloudCover
                                          ?.min !== undefined &&
                                      this.searchParams.cloudCover?.max !== undefined
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
                                      ${this.searchParams.cloudCover?.min !==
                                          undefined &&
                                      this.searchParams.cloudCover?.max !== undefined
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
                                          min=${this.cloudCoverRange?.min}
                                          max=${this.cloudCoverRange?.max}
                                          start-value=${this.searchParams.cloudCover
                                              ?.min ?? this.cloudCoverRange?.min}
                                          end-value=${this.searchParams.cloudCover
                                              ?.max ?? this.cloudCoverRange?.max}
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
                    <strong>${this.totalGranules.toLocaleString()}</strong>
                    files selected
                    ${this.estimatedSize ? html` (~${this.estimatedSize})` : nothing}
                </div>
            </div>

            <div class="grid-container">
                <terra-data-grid
                    ${ref(this.gridRef)}
                    row-model-type="infinite"
                    height="350px"
                ></terra-data-grid>

                ${this.loading ? this.#renderLoadingOverlay() : nothing}
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
