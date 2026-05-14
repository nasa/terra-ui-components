import type { CmrCollectionCitationItem } from '../../apis/cmr.api.js'
import type TerraPlotToolbar from './plot-toolbar.component.js'
import cmrApi from '../../apis/cmr.api.js'
import { Task } from '@lit/task'
import type { Variable } from '../browse-variables/browse-variables.types.js'
import type { ReactiveControllerHost } from 'lit'

export class PlotToolbarController {
    #fetchCollectionTask: Task<
        [Variable],
        CmrCollectionCitationItem | undefined
    >

    #host: ReactiveControllerHost & TerraPlotToolbar

    constructor(host: ReactiveControllerHost & TerraPlotToolbar) {
        this.#host = host

        this.#fetchCollectionTask = new Task(host, {
            task: async ([catalogVariable], { signal }) => {
                return cmrApi.getCollectionCitation(
                    `${catalogVariable.dataProductShortName}_${catalogVariable.dataProductVersion}`,
                    { signal },
                )
            },
            args: (): [Variable] => [this.#host.catalogVariable],
        })
    }

    get collectionCitation() {
        return this.#fetchCollectionTask.value
    }
}
