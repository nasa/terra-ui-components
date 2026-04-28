import componentStyles from '../../styles/component.styles.js'
import styles from './data-grid.styles.js'
import TerraElement from '../../internal/terra-element.js'
import TerraLoader from '../loader/loader.component.js'
import { createRef, ref } from 'lit/directives/ref.js'
import { html, nothing } from 'lit'
import { property, state } from 'lit/decorators.js'
import type { CSSResultGroup } from 'lit'
import {
    createGrid,
    AllCommunityModule,
    ModuleRegistry,
    type GridApi,
    type GridOptions,
    type IDatasource,
    type ColDef,
    type GridReadyEvent,
    type SelectionChangedEvent,
    type SortChangedEvent,
    type FilterChangedEvent,
    type RowClickedEvent,
    type RowDoubleClickedEvent,
    type CellClickedEvent,
    type CellValueChangedEvent,
    type CsvExportParams,
    type ExcelExportParams,
} from 'ag-grid-community'

/**
 * @summary A flexible data grid component built on AG Grid with support for various data sources and row models.
 * @documentation https://terra-ui.netlify.app/components/data-grid
 * @status experimental
 * @since 1.0
 *
 * @dependency ag-grid-community
 * @dependency terra-loader
 *
 * @csspart base - The component's base wrapper.
 * @csspart grid - The AG Grid container element.
 * @csspart loading - The loading overlay container.
 *
 * @cssproperty --terra-data-grid-height - The height of the grid (default: 400px).
 * @cssproperty --terra-data-grid-border-color - Border color using HDS tokens.
 * @cssproperty --terra-data-grid-header-background - Header background color.
 *
 * @event terra-grid-ready - Emitted when the grid is initialized and ready.
 * @event terra-selection-changed - Emitted when row selection changes.
 * @event terra-sort-changed - Emitted when column sorting changes.
 * @event terra-filter-changed - Emitted when column filters change.
 * @event terra-row-clicked - Emitted when a row is clicked.
 * @event terra-row-double-clicked - Emitted when a row is double-clicked.
 * @event terra-cell-clicked - Emitted when a cell is clicked.
 * @event terra-cell-value-changed - Emitted when a cell value is edited.
 */
export default class TerraDataGrid<T = any> extends TerraElement {
    static styles: CSSResultGroup = [componentStyles, styles]

    static dependencies = {
        'terra-loader': TerraLoader,
    }

    /**
     * AG Grid options configuration object.
     * This is the primary way to configure the grid.
     * Must be set via JavaScript (not as an attribute).
     */
    @property({ type: Object })
    gridOptions?: GridOptions<T>

    /**
     * Column definitions for the grid.
     * Alternative to setting columnDefs in gridOptions.
     * Must be set via JavaScript (not as an attribute).
     */
    @property({ type: Array })
    columnDefs?: ColDef<T>[]

    /**
     * Row data for client-side row model.
     * Must be set via JavaScript (not as an attribute).
     */
    @property({ type: Array })
    rowData?: T[]

    /**
     * Datasource for infinite scroll row model.
     * Must be set via JavaScript (not as an attribute).
     */
    @property({ type: Object })
    datasource?: IDatasource

    /**
     * Height of the grid in pixels or CSS units.
     * Default: 400px
     */
    @property({ attribute: 'height', type: String })
    height: string = '400px'

    /**
     * Row model type: 'clientSide', 'infinite', or 'serverSide'.
     * Default: 'clientSide'
     */
    @property({ attribute: 'row-model-type', type: String })
    rowModelType: 'clientSide' | 'infinite' | 'serverSide' = 'clientSide'

    /**
     * Theme for AG Grid: 'alpine', 'alpine-dark', 'balham', 'balham-dark', 'material', 'quartz'.
     * Default: 'alpine'
     */
    @property({ attribute: 'theme', type: String })
    theme: string = 'alpine'

    /**
     * Whether to show loading overlay when data is being fetched.
     * Default: false
     */
    @property({ attribute: 'show-loading', type: Boolean })
    showLoading: boolean = false

    @state()
    isLoading: boolean = false

    #gridApi: GridApi<T> | undefined
    #gridRef = createRef<HTMLElement>()

    connectedCallback(): void {
        super.connectedCallback()
        // Register AG Grid modules
        ModuleRegistry.registerModules([AllCommunityModule])
    }

    disconnectedCallback(): void {
        super.disconnectedCallback()
        // Clean up grid on disconnect
        if (this.#gridApi) {
            this.#gridApi.destroy()
            this.#gridApi = undefined
        }
    }

    firstVisible(): void {
        this.#initializeGrid()
    }

    updated(changedProperties: Map<string | number | symbol, unknown>): void {
        super.updated(changedProperties)

        // Reinitialize grid if key properties change
        if (
            changedProperties.has('gridOptions') ||
            changedProperties.has('columnDefs') ||
            changedProperties.has('rowData') ||
            changedProperties.has('datasource') ||
            changedProperties.has('rowModelType')
        ) {
            // Only reinitialize if grid is already initialized
            if (this.#gridApi && this.#gridRef.value) {
                this.#initializeGrid()
            }
        }
    }

    #initializeGrid() {
        if (!this.#gridRef.value) {
            return
        }

        // Destroy existing grid if present
        if (this.#gridApi) {
            this.#gridApi.destroy()
            this.#gridApi = undefined
        }

        // Merge user-provided options with defaults
        const options: GridOptions<T> = {
            ...this.#getDefaultGridOptions(),
            ...this.gridOptions,
            columnDefs: this.columnDefs ?? this.gridOptions?.columnDefs,
            rowData: this.rowData ?? this.gridOptions?.rowData,
            datasource: this.datasource ?? this.gridOptions?.datasource,
            rowModelType: this.rowModelType,
        }

        // Set up event handlers that emit Terra events
        const originalOnGridReady = options.onGridReady
        options.onGridReady = (params: GridReadyEvent<T>) => {
            this.#gridApi = params.api
            this.emit('terra-grid-ready', { detail: params })
            if (originalOnGridReady) {
                originalOnGridReady(params)
            }
        }

        const originalOnSelectionChanged = options.onSelectionChanged
        options.onSelectionChanged = (params: SelectionChangedEvent<T>) => {
            this.emit('terra-selection-changed', { detail: params })
            if (originalOnSelectionChanged) {
                originalOnSelectionChanged(params)
            }
        }

        const originalOnSortChanged = options.onSortChanged
        options.onSortChanged = (params: SortChangedEvent<T>) => {
            this.emit('terra-sort-changed', { detail: params })
            if (originalOnSortChanged) {
                originalOnSortChanged(params)
            }
        }

        const originalOnFilterChanged = options.onFilterChanged
        options.onFilterChanged = (params: FilterChangedEvent<T>) => {
            this.emit('terra-filter-changed', { detail: params })
            if (originalOnFilterChanged) {
                originalOnFilterChanged(params)
            }
        }

        const originalOnRowClicked = options.onRowClicked
        options.onRowClicked = (params: RowClickedEvent<T>) => {
            this.emit('terra-row-clicked', { detail: params })
            if (originalOnRowClicked) {
                originalOnRowClicked(params)
            }
        }

        const originalOnRowDoubleClicked = options.onRowDoubleClicked
        options.onRowDoubleClicked = (params: RowDoubleClickedEvent<T>) => {
            this.emit('terra-row-double-clicked', { detail: params })
            if (originalOnRowDoubleClicked) {
                originalOnRowDoubleClicked(params)
            }
        }

        const originalOnCellClicked = options.onCellClicked
        options.onCellClicked = (params: CellClickedEvent<T>) => {
            this.emit('terra-cell-clicked', { detail: params })
            if (originalOnCellClicked) {
                originalOnCellClicked(params)
            }
        }

        const originalOnCellValueChanged = options.onCellValueChanged
        options.onCellValueChanged = (params: CellValueChangedEvent<T>) => {
            this.emit('terra-cell-value-changed', { detail: params })
            if (originalOnCellValueChanged) {
                originalOnCellValueChanged(params)
            }
        }

        this.#gridApi = createGrid(this.#gridRef.value, options)
    }

    #getDefaultGridOptions(): Partial<GridOptions<T>> {
        return {
            defaultColDef: {
                sortable: true,
                filter: true,
                resizable: true,
            },
            rowBuffer: 25,
            cacheBlockSize: 50,
            maxConcurrentDatasourceRequests: 2,
        }
    }

    /**
     * Get the AG Grid API instance.
     * Useful for programmatic control of the grid.
     */
    getGridApi(): GridApi<T> | undefined {
        return this.#gridApi
    }

    /**
     * Refresh the grid data.
     * For infinite scroll, purges cache and refetches.
     */
    refresh(): void {
        if (this.#gridApi) {
            if (this.rowModelType === 'infinite') {
                this.#gridApi.purgeInfiniteCache()
            } else {
                this.#gridApi.refreshCells()
            }
        }
    }

    /**
     * Export grid data to CSV.
     */
    exportToCsv(options?: CsvExportParams): void {
        if (this.#gridApi) {
            this.#gridApi.exportDataAsCsv(options)
        }
    }

    /**
     * Export grid data to Excel.
     * Note: Requires AG Grid Enterprise license.
     */
    exportToExcel(options?: ExcelExportParams): void {
        if (this.#gridApi) {
            this.#gridApi.exportDataAsExcel?.(options)
        }
    }

    render() {
        return html`
            <div class="grid-container" part="base">
                <div
                    class="grid ag-theme-${this.theme}"
                    part="grid"
                    ${ref(this.#gridRef)}
                    style="height: ${this.height};"
                ></div>

                ${this.isLoading && this.showLoading
                    ? html`
                          <div class="loading-overlay" part="loading">
                              <terra-loader indeterminate></terra-loader>
                          </div>
                      `
                    : nothing}
            </div>
        `
    }
}
