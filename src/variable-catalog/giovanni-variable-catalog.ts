import { getGraphQLClient } from '../lib/graphql-client.js'
import { GET_SEARCH_KEYWORDS, GET_VARIABLES } from './queries.js'
import type {
    SearchKeywordsResponse,
    VariableCatalogInterface,
    GetVariablesResponse,
} from './types.js'
import type {
    SearchOptions,
    SearchResponse,
    SelectedFacets,
    FacetsByCategory,
    Variable,
    ExampleInitialDates,
} from '../components/browse-variables/browse-variables.types.js'
import { getUTCDate } from '../utilities/date.js'

export class GiovanniVariableCatalog implements VariableCatalogInterface {
    async getSearchKeywords() {
        const client = await getGraphQLClient()

        const response = await client.query<{
            aesirKeywords: SearchKeywordsResponse
        }>({
            query: GET_SEARCH_KEYWORDS,
            fetchPolicy: 'cache-first',
        })

        if (response.errors) {
            throw new Error(
                `Failed to fetch search keywords: ${response.errors[0].message}`
            )
        }

        return response.data!.aesirKeywords
    }

    async searchVariablesAndFacets(
        query?: string,
        selectedFacets?: SelectedFacets,
        options?: SearchOptions
    ): Promise<SearchResponse> {
        const client = await getGraphQLClient()

        const response = await client.query<{
            getVariables: GetVariablesResponse
        }>({
            query: GET_VARIABLES,
            variables: {
                q: query,
                filter: selectedFacets,
            },
            context: {
                fetchOptions: {
                    signal: options?.signal,
                },
            },
        })

        if (response.errors) {
            throw new Error(
                `Failed to fetch variables: ${response.errors[0].message}`
            )
        }

        const { variables, facets, total } = response.data!.getVariables

        // Transform facets into the expected format
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

        facets.forEach(facet => {
            const category = facet.category as keyof FacetsByCategory
            if (category in facetsByCategory) {
                facetsByCategory[category] = facet.values
            }
        })

        return {
            variables: this.#adaptVariablesForResponse(variables),
            facetsByCategory,
            total,
        }
    }

    async getVariable(
        variableEntryId: string,
        options?: SearchOptions
    ): Promise<Variable | null> {
        const client = await getGraphQLClient()

        const response = await client.query<{
            getVariables: GetVariablesResponse
        }>({
            query: GET_VARIABLES,
            variables: {
                variableEntryIds: [variableEntryId],
            },
            context: {
                fetchOptions: {
                    signal: options?.signal,
                },
            },
        })

        if (response.errors) {
            throw new Error(`Failed to fetch variable: ${response.errors[0].message}`)
        }

        const { variables } = response.data!.getVariables

        return variables.length ? this.#adaptVariablesForResponse(variables)[0] : null
    }

    #adaptVariablesForResponse(variables: Variable[]) {
        return variables.map(variable => {
            const exampleInitialDates =
                this.#getReasonableInitialStartAndEndDateTime(variable)

            return {
                ...variable,
                exampleInitialStartDate: exampleInitialDates?.exampleInitialStartDate,
                exampleInitialEndDate: exampleInitialDates?.exampleInitialEndDate,
                dataFieldShortName:
                    !variable.dataFieldShortName || variable.dataFieldShortName == ''
                        ? variable.dataFieldAccessName
                        : variable.dataFieldShortName,
            }
        })
    }

    /**
     * Get reasonable initial start and end date
     *
     * When we load a variable into a plot, we may want to show the user some initial data while they change the date
     * This function returns a reasonable slice of time that components can choose to use
     */
    #getReasonableInitialStartAndEndDateTime(
        variable: Variable
    ): ExampleInitialDates | undefined {
        if (
            !variable?.dataProductBeginDateTime ||
            !variable?.dataProductEndDateTime
        ) {
            // we can only make a reasonable slice if we know the beginning and end dates of the collection
            return
        }

        // get the diff betwwen start and end; it doesn't matter that we adjust for local time, because the adjustment is the same
        const diff = Math.abs(
            new Date(variable.dataProductEndDateTime as string).getTime() -
                new Date(variable.dataProductBeginDateTime as string).getTime()
        )
        const threeQuarterRange = Math.floor(diff * 0.75)
        const startDate = Math.abs(
            new Date(variable.dataProductBeginDateTime as string).getTime() +
                threeQuarterRange
        )

        return {
            exampleInitialStartDate: getUTCDate(startDate),
            exampleInitialEndDate: getUTCDate(variable.dataProductEndDateTime),
        }
    }
}
