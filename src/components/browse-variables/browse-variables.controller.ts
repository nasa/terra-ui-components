import { QueryController } from '../../controllers/query.controller.js'
import type { QueryClientHost } from '../../mixins/query-client.mixin.js'
import giovanniApi from '../../apis/giovanni.api.js'
import { queryGiovanniVariables } from '../../queries/giovanni.queries.js'
import type { ReactiveController, ReactiveControllerHost } from 'lit'
import { getUTCDate } from '../../utilities/date.js'
import type { FacetsByCategory, Variable } from './browse-variables.types.js'
import type TerraBrowseVariables from './browse-variables.component.js'
import type { GiovanniVariable } from '../../apis/giovanni.api.js'

type SearchVariablesResult = Awaited<
    ReturnType<typeof giovanniApi.searchVariables>
>

export class BrowseVariablesController implements ReactiveController {
    #query: QueryController<SearchVariablesResult | null>

    #host: ReactiveControllerHost & QueryClientHost & TerraBrowseVariables

    #hasAutoSelectedVariables = false

    constructor(
        host: ReactiveControllerHost & QueryClientHost & TerraBrowseVariables,
    ) {
        this.#host = host
        host.addController(this)

        this.#query = new QueryController(host, () => {
            const { q, filter } = this.#buildSearchParams()
            return queryGiovanniVariables({ q, filter })
        })
    }

    hostConnected() {}

    hostDisconnected() {}

    async hostUpdated() {
        const data = this.#query.result?.data
        if (!data || this.#hasAutoSelectedVariables) return
        await this.#selectVariables(data)
    }

    get facetsByCategory(): FacetsByCategory | undefined {
        const data = this.#query.result?.data
        if (!data) return undefined

        const facetsByCategory: FacetsByCategory = {
            depths: [],
            disciplines: [],
            measurements: [],
            observations: [],
            platformInstruments: [],
            portals: [],
            spatialResolutions: [],
            specialFeatures: [],
            temporalResolutions: [],
            wavelengths: [],
        }

        for (const facet of data.facets) {
            const category = facet.category as keyof FacetsByCategory
            if (category in facetsByCategory) {
                facetsByCategory[category] = facet.values
            }
        }

        return facetsByCategory
    }

    get variables(): Variable[] {
        const data = this.#query.result?.data
        return data ? this.#adaptVariables(data.variables) : []
    }

    get total(): number {
        return this.#query.result?.data?.total ?? 0
    }

    get isPending(): boolean {
        return this.#query.result?.isFetching ?? false
    }

    async getVariable(variableEntryId: string): Promise<Variable | null> {
        const variable = await giovanniApi.getVariable(variableEntryId)
        return variable ? this.#adaptVariables([variable])[0] : null
    }

    async #selectVariables(data: SearchVariablesResult) {
        if (
            !this.#host.selectedVariableEntryIds ||
            this.#host.selectedVariables.length > 0
        ) {
            return
        }

        this.#hasAutoSelectedVariables = true

        const adaptedVariables = this.#adaptVariables(data.variables)
        const variableEntryIds = this.#host.selectedVariableEntryIds.split(',')

        const variables = adaptedVariables.filter(
            (variable) =>
                variableEntryIds.includes(variable.dataFieldId) ||
                variableEntryIds.includes(
                    `${variable.dataProductShortName}_${variable.dataProductVersion}_${variable.dataFieldAccessName}`,
                ),
        )

        const missingVariableIds = variableEntryIds.filter(
            (id) => !variables.some((v) => v.dataFieldId === id),
        )

        const missingVariables = (
            await Promise.all(
                missingVariableIds.map((id) => this.getVariable(id)),
            )
        ).filter(Boolean) as Variable[]

        this.#host.selectedVariables = [...variables, ...missingVariables]
    }

    #buildSearchParams() {
        const { searchQuery: query, selectedFacets } = this.#host

        // Handle Giovanni catalog inconsistency: "Aerosols" query returns no results
        // without being remapped to the disciplines facet
        if (
            (query === 'Aerosols' || query === 'aerosols') &&
            !selectedFacets?.observations?.includes('Aerosols')
        ) {
            return {
                q: undefined as string | undefined,
                filter: {
                    ...selectedFacets,
                    disciplines: [
                        ...(selectedFacets?.disciplines ?? []),
                        'Aerosols',
                    ],
                } as Record<string, string[]>,
            }
        }

        return {
            q: query as string | undefined,
            filter: selectedFacets as Record<string, string[]>,
        }
    }

    #adaptVariables(variables: GiovanniVariable[]): Variable[] {
        return variables.map((variable) => {
            const exampleInitialDates =
                this.#getReasonableInitialDates(variable)

            return {
                ...variable,
                exampleInitialStartDate:
                    exampleInitialDates?.exampleInitialStartDate,
                exampleInitialEndDate:
                    exampleInitialDates?.exampleInitialEndDate,
                dataFieldShortName:
                    !variable.dataFieldShortName ||
                    variable.dataFieldShortName === ''
                        ? variable.dataFieldAccessName
                        : variable.dataFieldShortName,
            }
        })
    }

    #getReasonableInitialDates(variable: GiovanniVariable) {
        if (
            !variable?.dataProductBeginDateTime ||
            !variable?.dataProductEndDateTime
        ) {
            return undefined
        }

        const diff = Math.abs(
            new Date(variable.dataProductEndDateTime).getTime() -
                new Date(variable.dataProductBeginDateTime).getTime(),
        )
        const threeQuarterRange = Math.floor(diff * 0.75)
        const startDate = Math.abs(
            new Date(variable.dataProductBeginDateTime).getTime() +
                threeQuarterRange,
        )

        return {
            exampleInitialStartDate: getUTCDate(startDate),
            exampleInitialEndDate: getUTCDate(variable.dataProductEndDateTime),
        }
    }
}
