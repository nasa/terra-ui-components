import { GiovanniRepository } from './repositories/giovanni.repository.js'
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
    facetsByCategory: FacetsByCategory
    variables: Variable[]

    #host: ReactiveControllerHost & TerraBrowseVariables
    #task: Task<[], SearchResponse>
    #catalog: CatalogRepositoryInterface

    constructor(host: ReactiveControllerHost & TerraBrowseVariables) {
        this.#host = host
        this.#catalog = this.#getCatalogRepository()

        // TODO: add dependencies to task for the search query and selected facet filter
        this.#task = new Task(host, {
            task: async (_args, { signal }) => {
                const searchResponse = await this.#catalog.searchVariablesAndFacets(
                    undefined,
                    undefined,
                    {
                        signal,
                    }
                )

                this.facetsByCategory = searchResponse.facetsByCategory
                this.variables = searchResponse.variables

                return searchResponse
            },
            args: (): any => [],
        })
    }

    render(renderFunctions: StatusRenderer<any>) {
        return this.#task.render(renderFunctions)
    }

    #getCatalogRepository() {
        if (this.#host.catalog === 'giovanni') {
            return new GiovanniRepository()
        }

        throw new Error(`Invalid catalog: ${this.#host.catalog}`)
    }
}
