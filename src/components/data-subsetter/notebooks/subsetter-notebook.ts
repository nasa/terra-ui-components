import type TerraDataSubsetter from '../data-subsetter.component.js'

export function getNotebook(host: TerraDataSubsetter) {
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
            source: '%pip install -q "terra_ui_components==0.0.125" "anywidget==0.9.15"',
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
            source: `from terra_ui_components import TerraDataSubsetter\nsubsetter = TerraDataSubsetter()\n\n${host.collectionEntryId ? `subsetter.collectionEntryId = '${host.collectionEntryId}'\n` : ''}${host.controller.currentJob?.jobID ? `subsetter.jobId = '${host.controller.currentJob.jobID}'\n` : ''}${host.environment ? `subsetter.environment = '${host.environment}'` : ''}\nsubsetter`,
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
                '### Download the files\n',
                '\n',
                'Once the subset job completes, you can download the files:',
            ],
        },
        {
            id: '870c1384-e706-48ee-ba07-fd552a949868',
            cell_type: 'code',
            source: `subsetter.job['links']`,
            metadata: {
                trusted: true,
            },
            outputs: [],
            execution_count: null,
        },
    ]
}
