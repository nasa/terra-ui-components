import type {
    CellClickedEvent,
    CellValueChangedEvent,
    FilterChangedEvent,
    GridReadyEvent,
    RowClickedEvent,
    RowDoubleClickedEvent,
    SelectionChangedEvent,
    SortChangedEvent,
} from 'ag-grid-community'

export type TerraGridReadyEvent = CustomEvent<GridReadyEvent<any>>
export type TerraSelectionChangedEvent = CustomEvent<SelectionChangedEvent<any>>
export type TerraSortChangedEvent = CustomEvent<SortChangedEvent>
export type TerraFilterChangedEvent = CustomEvent<FilterChangedEvent>
export type TerraRowClickedEvent = CustomEvent<RowClickedEvent<any>>
export type TerraRowDoubleClickedEvent = CustomEvent<RowDoubleClickedEvent<any>>
export type TerraCellClickedEvent = CustomEvent<CellClickedEvent<any>>
export type TerraCellValueChangedEvent = CustomEvent<CellValueChangedEvent<any>>

declare global {
    interface GlobalEventHandlersEventMap {
        'terra-grid-ready': TerraGridReadyEvent
        'terra-selection-changed': TerraSelectionChangedEvent
        'terra-sort-changed': TerraSortChangedEvent
        'terra-filter-changed': TerraFilterChangedEvent
        'terra-row-clicked': TerraRowClickedEvent
        'terra-row-double-clicked': TerraRowDoubleClickedEvent
        'terra-cell-clicked': TerraCellClickedEvent
        'terra-cell-value-changed': TerraCellValueChangedEvent
    }
}
