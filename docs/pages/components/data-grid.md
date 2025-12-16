---
meta:
    title: Data Grid
    description: A flexible data grid component built on AG Grid with support for various data sources and row models.
layout: component
---

```html:preview
<terra-data-grid id="basic-grid"></terra-data-grid>

<script>
    const grid = document.querySelector('#basic-grid')
    grid.columnDefs = [
        { field: 'name', headerName: 'Name', flex: 1 },
        { field: 'age', headerName: 'Age', flex: 1 },
        { field: 'email', headerName: 'Email', flex: 2 },
    ]
    grid.rowData = [
        { name: 'John Doe', age: 30, email: 'john.doe@example.com' },
        { name: 'Jane Smith', age: 25, email: 'jane.smith@example.com' },
        { name: 'Bob Johnson', age: 35, email: 'bob.johnson@example.com' },
    ]
</script>
```

## Examples

### Basic Client-Side Grid

The simplest way to use the data grid is with client-side row data:

```html:preview
<terra-data-grid id="grid"></terra-data-grid>

<script>
    const grid = document.querySelector('#grid')
    grid.columnDefs = [
        { field: 'title', headerName: 'Title', flex: 3 },
        { field: 'size', headerName: 'Size (MB)', flex: 1 },
        { field: 'date', headerName: 'Date', flex: 1 },
    ]
    grid.rowData = [
        { title: 'File 1', size: 10.5, date: '2024-01-15' },
        { title: 'File 2', size: 25.3, date: '2024-01-16' },
        { title: 'File 3', size: 8.2, date: '2024-01-17' },
    ]
</script>
```

### Infinite Scroll Grid

For large datasets, use the infinite scroll row model with a datasource:

```html:preview
<terra-data-grid id="grid-infinite" row-model-type="infinite" height="600px"></terra-data-grid>

<script>
    const grid = document.querySelector('#grid-infinite')
    grid.columnDefs = [
        { field: 'title', flex: 3 },
        { field: 'size', headerName: 'Size (MB)', sortable: false, searchable: false },
        { field: 'date', headerName: 'Date', sortable: false, filterable: false },
    ]

    grid.datasource = {
        rowCount: undefined, // Unknown total row count
        getRows: async params => {
            //! You would fetch data from your API doing something like this
            //! await fetch(`/api/data?start=${params.startRow}&end=${params.endRow}`)
            //! We're going to mock a response instead
            const data = {
                total: 1000,
                items: [],
            }

            for (var i = params.startRow + 1; i <= params.endRow; i++) {
                data.items.push({
                    title: `File ${i}`,
                    size: i * Math.random(),
                    date: randomDate(),
                })
            }

            const lastRow = data.total <= params.endRow ? data.total : -1

            // mock a delay
            setTimeout(() => params.successCallback(data.items, lastRow), 500)
        },
    }

    function randomDate() {
        const startTime = new Date(2010, 0, 1).getTime();
        const endTime = new Date(2021, 11, 31).getTime();

        const randomTimestamp = startTime + Math.random() * (endTime - startTime);

        return new Date(randomTimestamp);
    }
</script>
```

### With Grid Options

You can pass a complete `gridOptions` object for advanced configuration:

```html:preview
<terra-data-grid id="grid-options"></terra-data-grid>

<script>
    const grid = document.querySelector('#grid-options')
    grid.gridOptions = {
        columnDefs: [
            { field: 'name', sortable: true, filter: true },
            { field: 'age', type: 'numberColumn' },
            { field: 'email', editable: true },
        ],
        rowData: [
            { name: 'John', age: 30, email: 'john@example.com' },
            { name: 'Jane', age: 25, email: 'jane@example.com' },
        ],
        pagination: true,
        paginationPageSize: 20,
        rowSelection: 'multiple',
        onRowClicked: event => {
            console.log('Row clicked:', event.data)
        },
    }
</script>
```

### Event Handling

Listen to grid events:

```html:preview
<terra-data-grid id="grid-events"></terra-data-grid>

<script>
    const grid = document.querySelector('#grid-events')

    grid.gridOptions = {
        columnDefs: [
            { field: 'name', sortable: true, filter: true },
            { field: 'age', type: 'numberColumn' },
            { field: 'email', editable: true },
        ],
        rowData: [
            { name: 'John', age: 30, email: 'john@example.com' },
            { name: 'Jane', age: 25, email: 'jane@example.com' },
        ],
        pagination: true,
        paginationPageSize: 20,
        rowSelection: 'multiple',
        onRowClicked: event => {
            console.log('Row clicked:', event.data)
        },
    }

    grid.addEventListener('terra-grid-ready', event => {
        console.log('Grid is ready!', event.detail)
    })

    grid.addEventListener('terra-row-clicked', event => {
        console.log('Row clicked:', event.detail.data)
    })

    grid.addEventListener('terra-selection-changed', event => {
        const selectedRows = event.detail.api.getSelectedRows()
        console.log('Selected rows:', selectedRows)
    })
</script>
```

### Programmatic Control

Access the grid API for programmatic control:

```html:preview
<terra-data-grid id="grid-prog"></terra-data-grid>
<button id="refresh-btn">Refresh</button>
<button id="export-btn">Export CSV</button>

<script>
    const grid = document.querySelector('#grid-prog')
    grid.columnDefs = [{ field: 'name' }, { field: 'value' }]
    grid.rowData = [
        { name: 'Item 1', value: 100 },
        { name: 'Item 2', value: 200 },
    ]

    function refreshGrid() {
        grid.refresh()
    }

    function exportCsv() {
        grid.exportToCsv({ fileName: 'export.csv' })
    }

    document.getElementById('refresh-btn').click(refreshGrid)
    document.getElementById('export-btn').click(exportCsv)
</script>
```

[component-metadata:terra-data-grid]
