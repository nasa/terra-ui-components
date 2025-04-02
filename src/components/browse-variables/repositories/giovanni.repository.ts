import type {
    CatalogRepositoryInterface,
    SearchOptions,
    SelectedFacets,
} from '../browse-variables.types.js'

const GIOVANNI_CATALOG_URL =
    'https://windmill-load-balancer-641499207.us-east-1.elb.amazonaws.com/api/r/giovanni/catalog'

export class GiovanniRepository implements CatalogRepositoryInterface {
    async searchVariablesAndFacets(
        query?: string,
        selectedFacets?: SelectedFacets,
        options?: SearchOptions
    ) {
        const url = new URL(GIOVANNI_CATALOG_URL)

        if (query) {
            url.searchParams.append('q', query)
        }

        if (selectedFacets) {
            Object.keys(selectedFacets).forEach(facet => {
                url.searchParams.append(
                    `filter[${facet}]`,
                    selectedFacets[facet].toString()
                )
            })
        }

        const response = await fetch(url.toString(), {
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
            total: result.total,
        }
    }
}
