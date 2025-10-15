import type {
    CmrGranule,
    MetadataCatalogInterface,
} from '../../metadata-catalog/types.js'
import { CmrCatalog } from '../../metadata-catalog/cmr-catalog.js'
import { Task, type StatusRenderer } from '@lit/task'
import type { ReactiveControllerHost } from 'lit'
import type TerraDataAccess from './data-access.component.js'

export type FetchGranulesOptions = {
    collectionEntryId: string
    startRow: number
    endRow: number
    sortBy?: string
    sortDirection?: string
    search?: string
}

export class DataAccessController {
    fetchGranulesTask: Task<
        [string, number, number, string, string, string],
        CmrGranule[] | undefined
    >
    #host: ReactiveControllerHost & TerraDataAccess
    #catalog: MetadataCatalogInterface
    #totalGranules: number = 0
    #granules: CmrGranule[] = []

    constructor(host: ReactiveControllerHost & TerraDataAccess) {
        this.#host = host
        this.#catalog = this.#getCatalogRepository()

        this.fetchGranulesTask = new Task(host, {
            task: async (
                [collectionEntryId, startRow, endRow, sortBy, sortDirection, search],
                { signal }
            ) => {
                console.log('fetching granules ', collectionEntryId, startRow, endRow)

                if (!collectionEntryId) {
                    return undefined
                }

                const granules = await this.#catalog.getGranules(collectionEntryId, {
                    signal,
                    offset: startRow,
                    limit: endRow - startRow,
                    sortBy,
                    sortDirection,
                    search,
                    startDate: this.#host.startDate,
                    endDate: this.#host.endDate,
                    location: this.#host.location,
                })

                ;(this.#granules =
                    granules?.collections?.items?.[0]?.granules?.items ?? []),
                    (this.#totalGranules =
                        granules?.collections?.items?.[0]?.granules?.count ?? 0)

                console.log('Granules: ', this.#granules)

                return this.#granules
            },
            autoRun: false,
        })
    }

    get granules() {
        return this.#granules
    }

    get totalGranules() {
        return this.#totalGranules
    }

    async fetchGranules({
        collectionEntryId,
        startRow,
        endRow,
        sortBy,
        sortDirection,
        search,
    }: FetchGranulesOptions) {
        console.log(
            'fetching granules ',
            collectionEntryId,
            startRow,
            endRow,
            sortBy,
            sortDirection
        )

        return this.fetchGranulesTask.run([
            collectionEntryId,
            startRow,
            endRow,
            sortBy ?? 'title',
            sortDirection ?? 'asc',
            search ?? '',
        ])
    }

    render(renderFunctions: StatusRenderer<Partial<CmrGranule[] | undefined>>) {
        return this.fetchGranulesTask.render(renderFunctions)
    }

    #getCatalogRepository() {
        return new CmrCatalog()
    }
}
