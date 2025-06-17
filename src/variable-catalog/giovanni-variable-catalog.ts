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
} from '../components/browse-variables/browse-variables.types.js'

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
            variables,
            facetsByCategory,
            total,
        }
    }
}
