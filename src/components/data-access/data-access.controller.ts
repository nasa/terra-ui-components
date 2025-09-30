import type {
    CmrGranule,
    MetadataCatalogInterface,
} from '../../metadata-catalog/types.js'
import { CmrCatalog } from '../../metadata-catalog/cmr-catalog.js'
import { Task } from '@lit/task'
import type { ReactiveControllerHost } from 'lit'
import type TerraDataAccess from './data-access.component.js'

export class DataAccessController {
    #host: ReactiveControllerHost & TerraDataAccess
    #catalog: MetadataCatalogInterface
    #granules: CmrGranule[] = []

    constructor(host: ReactiveControllerHost & TerraDataAccess) {
        this.#host = host
        this.#catalog = this.#getCatalogRepository()

        new Task(host, {
            task: async ([collectionEntryId, page, limit], { signal }) => {
                if (!collectionEntryId) {
                    return undefined
                }

                const granules = await this.#catalog.getGranules(collectionEntryId, {
                    signal,
                    offset: (page - 1) * limit,
                    limit,
                })

                // rather than returning what we received, we concatenate new granules with existing granules
                // this allows us to show ALL the granules to the user, rather than just a few at a time
                this.#granules = [
                    ...this.#granules,
                    ...(granules?.collections?.items?.[0]?.granules?.items ?? []),
                ]

                return granules
            },
            args: (): [string | undefined, number, number] => [
                this.#host.collectionEntryId,
                this.#host.page,
                this.#host.limit,
            ],
        })
    }

    get granules() {
        return this.#granules
    }

    #getCatalogRepository() {
        return new CmrCatalog()
    }
}
