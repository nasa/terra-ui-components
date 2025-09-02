import type TerraPlotToolbar from '../plot-toolbar.component.js'

export function getTimeAveragedMapNotebook(host: TerraPlotToolbar) {
    /**
     * these cells were originally created in a Jupyter Notebook and then imported here.
     * Note that one of the code cells takes in dynamic data
     */
    return [
        {
            cell_type: 'markdown',
            id: '367f56b9-7ca8-4435-9dcc-89bf586f33ab',
            metadata: {},
            source: [
                '### Prerequisites:\n',
                '\n',
                'This notebook uses the `terra_ui_components`, `anywidget`, and `pandas` packages.\n',
                '\n',
                'After running the `pip install` cell for the first time, please reload the page to ensure the dependencies are active.',
            ],
        },
        {
            id: '2733501b-0de4-4067-8aff-864e1b4c76cb',
            cell_type: 'code',
            source: '%pip install -q "terra_ui_components==0.0.80" "anywidget==0.9.15" "pandas"',
            metadata: {
                trusted: true,
            },
            outputs: [],
            execution_count: null,
        },
        {
            cell_type: 'markdown',
            id: '35aa4a00-8e2c-4478-9df7-de633fd8f6ce',
            metadata: {},
            source: ['### Render an area-averaged map'],
        },
        {
            id: '870c1384-e706-48ee-ba07-fd552a949869',
            cell_type: 'code',
            source: `from terra_ui_components import TerraTimeAverageMap\nmap = TerraTimeAverageMap()\nmap.collection='${host.catalogVariable.dataFieldId.replace(`_${host.catalogVariable.dataFieldAccessName}`, '')}'\nmap.variable = '${host.catalogVariable.dataFieldAccessName}'\nmap.startDate = '${host.startDate}'\nmap.endDate = '${host.endDate}'\nmap.location = '${host.location}'\n\nmap`,
            metadata: {
                trusted: true,
            },
            outputs: [],
            execution_count: null,
        },
        {
            cell_type: 'markdown',
            id: '25b87ed4-2ad9-4c7d-b851-bc8fea3ded5a',
            metadata: {},
            source: [
                '### Access the map GeoTIFF data\n',
                '\n',
                'Once the map renders, you can access the data:',
            ],
        },
        {
            cell_type: 'code',
            execution_count: null,
            id: '6b81a089-884d-4fd7-9d4e-c45a53307c20',
            metadata: {},
            outputs: [],
            source: ['map.data'],
        },
    ]
}
