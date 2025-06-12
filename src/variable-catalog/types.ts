import type { Variable } from '../components/browse-variables/browse-variables.types.js'

export interface VariableCatalogInterface {
    /**
     * Fetches the list of search keywords
     * @returns Promise containing the list of search keywords
     */

    getSearchKeywords(): Promise<SearchKeywordsResponse>
}

export type SearchKeywordsResponse = {
    id: string
}

export type GiovanniFacetValue = {
    name: string
    count: number
}

export type GiovanniFacet = {
    category: string
    values: GiovanniFacetValue[]
}

export type GetVariablesResponse = {
    count: number
    total: number
    variables: Variable[]
    facets: GiovanniFacet[]
}
