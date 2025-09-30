import type {
    CmrGranulesResponse,
    MetadataCatalogInterface,
} from '../../metadata-catalog/types.js'
import { CmrCatalog } from '../../metadata-catalog/cmr-catalog.js'
import { Task } from '@lit/task'
import type { ReactiveControllerHost } from 'lit'
import type TerraDataAccess from './data-access.component.js'

export class DataAccessController {
    #fetchGranulesTask: Task<[string | undefined], CmrGranulesResponse | undefined>

    #host: ReactiveControllerHost & TerraDataAccess
    #catalog: MetadataCatalogInterface

    constructor(host: ReactiveControllerHost & TerraDataAccess) {
        this.#host = host
        this.#catalog = this.#getCatalogRepository()

        this.#fetchGranulesTask = new Task(host, {
            task: async ([collectionEntryId], { signal }) => {
                if (!collectionEntryId) {
                    return undefined
                }

                return this.#catalog.getGranules(collectionEntryId, {
                    signal,
                })
            },
            args: (): [string | undefined] => [this.#host.collectionEntryId],
        })
    }

    get granules() {
        return this.#fetchGranulesTask.value
    }

    #getCatalogRepository() {
        return new CmrCatalog()
    }
}
