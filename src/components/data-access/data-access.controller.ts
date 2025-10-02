import type {
    CmrGranule,
    MetadataCatalogInterface,
} from '../../metadata-catalog/types.js'
import { CmrCatalog } from '../../metadata-catalog/cmr-catalog.js'
import { Task, type StatusRenderer } from '@lit/task'
import type { ReactiveControllerHost } from 'lit'
import type TerraDataAccess from './data-access.component.js'
import type { MapEventDetail } from '../map/type.js'

type TaskArgs = [
    string | undefined,
    number,
    number,
    string,
    string,
    string,
    string,
    string,
    MapEventDetail | null,
]

export class DataAccessController {
    #fetchGranulesTask: Task<TaskArgs, CmrGranule[] | undefined>
    #host: ReactiveControllerHost & TerraDataAccess
    #catalog: MetadataCatalogInterface
    #totalGranules: number = 0
    #granules: CmrGranule[] = []
    #lastSortBy = 'title'
    #lastSortDirection = 'asc'
    #lastSearch = ''
    #lastStartDate = ''
    #lastEndDate = ''
    #lastLocation: MapEventDetail | null = null

    constructor(host: ReactiveControllerHost & TerraDataAccess) {
        this.#host = host
        this.#catalog = this.#getCatalogRepository()

        this.#fetchGranulesTask = new Task(host, {
            task: async (
                [
                    collectionEntryId,
                    page,
                    limit,
                    sortBy,
                    sortDirection,
                    search,
                    startDate,
                    endDate,
                    location,
                ],
                { signal }
            ) => {
                if (!collectionEntryId) {
                    return undefined
                }

                const granules = await this.#catalog.getGranules(collectionEntryId, {
                    signal,
                    offset: (page - 1) * limit,
                    limit,
                    sortBy,
                    sortDirection,
                    search,
                    startDate,
                    endDate,
                    location,
                })

                if (
                    sortBy !== this.#lastSortBy ||
                    sortDirection !== this.#lastSortDirection ||
                    search !== this.#lastSearch ||
                    startDate !== this.#lastStartDate ||
                    endDate !== this.#lastEndDate ||
                    location !== this.#lastLocation
                ) {
                    this.#granules = []
                    this.#totalGranules = 0
                }

                this.#lastSortBy = sortBy
                this.#lastSortDirection = sortDirection
                this.#lastSearch = search
                this.#lastStartDate = startDate
                this.#lastEndDate = endDate
                this.#lastLocation = location

                // rather than returning what we received, we concatenate new granules with existing granules
                // this allows us to show ALL the granules to the user, rather than just a few at a time
                this.#granules = [
                    ...this.#granules,
                    ...(granules?.collections?.items?.[0]?.granules?.items ?? []),
                ]

                this.#totalGranules =
                    granules?.collections?.items?.[0]?.granules?.count ?? 0

                return this.#granules
            },
            args: (): TaskArgs => [
                this.#host.collectionEntryId,
                this.#host.page,
                this.#host.limit,
                this.#host.sortBy,
                this.#host.sortDirection,
                this.#host.search,
                this.#host.startDate,
                this.#host.endDate,
                this.#host.location,
            ],
        })
    }

    get granules() {
        return this.#granules
    }

    get totalGranules() {
        return this.#totalGranules
    }

    render(renderFunctions: StatusRenderer<Partial<CmrGranule[] | undefined>>) {
        return this.#fetchGranulesTask.render(renderFunctions)
    }

    #getCatalogRepository() {
        return new CmrCatalog()
    }
}
