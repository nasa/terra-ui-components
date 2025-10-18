import type {
    CmrCollectionCitationItem,
    MetadataCatalogInterface,
} from '../../metadata-catalog/types.js'
import type TerraPlotToolbar from './plot-toolbar.component.js'
import { CmrCatalog } from '../../metadata-catalog/cmr-catalog.js'
import { Task } from '@lit/task'
import type { Variable } from '../browse-variables/browse-variables.types.js'
import type { ReactiveControllerHost } from 'lit'

export class PlotToolbarController {
    #fetchCollectionTask: Task<[Variable], CmrCollectionCitationItem | undefined>

    #host: ReactiveControllerHost & TerraPlotToolbar
    #catalog: MetadataCatalogInterface

    constructor(host: ReactiveControllerHost & TerraPlotToolbar) {
        this.#host = host
        this.#catalog = this.#getCatalogRepository()

        this.#fetchCollectionTask = new Task(host, {
            task: async ([catalogVariable], { signal }) => {
                return this.#catalog.getCollectionCitation(
                    `${catalogVariable.dataProductShortName}_${catalogVariable.dataProductVersion}`,
                    {
                        signal,
                    }
                )
            },
            args: (): [Variable] => [this.#host.catalogVariable],
        })
    }

    get collectionCitation() {
        return this.#fetchCollectionTask.value
    }

    #getCatalogRepository() {
        return new CmrCatalog()
    }
}
