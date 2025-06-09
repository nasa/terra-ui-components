import { GiovanniVariableCatalog } from '../../variable-catalog/giovanni-variable-catalog.js'
import { Task } from '@lit/task'
import type { StatusRenderer } from '@lit/task'
import type { ReactiveControllerHost } from 'lit'
import type {
    CatalogRepositoryInterface,
    FacetsByCategory,
    SearchResponse,
    Variable,
} from './browse-variables.types.js'
import type TerraBrowseVariables from './browse-variables.component.js'

export class BrowseVariablesController {
    task: Task<[string | undefined], SearchResponse>

    #host: ReactiveControllerHost & TerraBrowseVariables
    #catalog: CatalogRepositoryInterface

    constructor(host: ReactiveControllerHost & TerraBrowseVariables) {
        this.#host = host
        this.#catalog = this.#getCatalogRepository()

        this.task = new Task(host, {
            task: async ([searchQuery, selectedFacets], { signal }) => {
                const searchResponse = await this.#catalog.searchVariablesAndFacets(
                    searchQuery,
                    selectedFacets,
                    {
                        signal,
                    }
                )

                return searchResponse
            },
            args: (): any => [this.#host.searchQuery, this.#host.selectedFacets],
        })
    }

    get facetsByCategory(): FacetsByCategory | undefined {
        return this.task.value?.facetsByCategory
    }

    get variables(): Variable[] {
        return this.task.value?.variables ?? []
    }

    get total(): number {
        return this.task.value?.total ?? 0
    }

    render(renderFunctions: StatusRenderer<any>) {
        return this.task.render(renderFunctions)
    }

    #getCatalogRepository() {
        if (this.#host.catalog === 'giovanni') {
            return new GiovanniVariableCatalog()
        }

        throw new Error(`Invalid catalog: ${this.#host.catalog}`)
    }
}
