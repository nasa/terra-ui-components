import type TerraDataAccess from '../data-access.component.js'

export function getDataAccessNotebook(host: TerraDataAccess) {
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
                'This notebook uses the `terra_ui_components` and `anywidget` packages.\n',
                '\n',
                'After running the `pip install` cell for the first time, please reload the page to ensure the dependencies are active.',
            ],
        },
        {
            id: '2733501b-0de4-4067-8aff-864e1b4c76cb',
            cell_type: 'code',
            source: '%pip install -q "terra_ui_components==0.0.105" "anywidget==0.9.15"',
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
            source: [`### Render the subsetter`],
        },
        {
            id: '870c1384-e706-48ee-ba07-fd552a949869',
            cell_type: 'code',
            source: `from terra_ui_components import TerraDataAccess\ndata_access = TerraDataAccess()\n\n${host.shortName ? `data_access.shortName = '${host.shortName}'\n` : ''}${host.version ? `data_access.version = '${host.version}'\n` : ''}\ndata_access`,
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
                '### Access the granules\n',
                '\n',
                'You can access the granules from the above granule search results:',
            ],
        },
        {
            id: '870c1384-e706-48ee-ba07-fd552a949868',
            cell_type: 'code',
            source: `data_access.granules`,
            metadata: {
                trusted: true,
            },
            outputs: [],
            execution_count: null,
        },
    ]
}
