import { GiovanniVariableCatalog } from '../../metadata-catalog/giovanni-variable-catalog.js'
import { Task } from '@lit/task'
import type { StatusRenderer } from '@lit/task'
import type { ReactiveControllerHost } from 'lit'
import type {
    FacetsByCategory,
    SearchResponse,
    Variable,
} from './browse-variables.types.js'
import type TerraBrowseVariables from './browse-variables.component.js'

export class BrowseVariablesController {
    task: Task<[string | undefined], SearchResponse>

    #host: ReactiveControllerHost & TerraBrowseVariables
    #catalog: any // TODO: fix this type, it should be VariableCatalogInterface

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

                this.#selectVariables(searchResponse)

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

    /**
     * Selects variables from the search response that are in the selectedVariableEntryIds list
     */
    async #selectVariables(searchResponse: SearchResponse) {
        if (
            !this.#host.selectedVariableEntryIds ||
            this.#host.selectedVariables.length > 0
        ) {
            // we only want to select variables if the user has passed any in AND we haven't already made any selections
            return
        }

        const variableEntryIds = this.#host.selectedVariableEntryIds.split(',')

        const variables = searchResponse.variables.filter(variable => {
            return (
                variableEntryIds.includes(variable.dataFieldId) ||
                variableEntryIds.includes(
                    `${variable.dataProductShortName}_${variable.dataProductVersion}_${variable.dataFieldShortName}`
                )
            )
        })

        const missingVariableIds = variableEntryIds.filter(
            id => !variables.some(variable => variable.dataFieldId === id)
        )

        const missingVariables = await Promise.all(
            missingVariableIds.map(id => this.#catalog.getVariable(id))
        )

        this.#host.selectedVariables = [...variables, ...missingVariables]
    }

    #getCatalogRepository() {
        if (this.#host.catalog === 'giovanni') {
            return new GiovanniVariableCatalog()
        }

        throw new Error(`Invalid catalog: ${this.#host.catalog}`)
    }
}
