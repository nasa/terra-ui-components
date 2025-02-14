import type {
    CatalogRepositoryInterface,
    SearchOptions,
    SelectedFacetField,
} from '../browse-variables.types.js'

const GIOVANNI_CATALOG_URL =
    'https://windmill-load-balancer-641499207.us-east-1.elb.amazonaws.com/api/r/giovanni/catalog'

export class GiovanniRepository implements CatalogRepositoryInterface {
    async searchVariablesAndFacets(
        _query?: string,
        _selectedFacetFields?: SelectedFacetField[],
        options?: SearchOptions
    ) {
        const response = await fetch(GIOVANNI_CATALOG_URL, {
            signal: options?.signal ?? null,
        })

        if (!response.ok) {
            console.error(response)
            // TODO: better error handling for Catalog I/O
            throw new Error('Failed to fetch catalog')
        }

        const result = await response.json()

        return {
            facetsByCategory: result.facets,
            variables: result.variables,
        }
    }
}
