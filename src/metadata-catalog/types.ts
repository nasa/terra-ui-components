import type { Variable } from '../components/browse-variables/browse-variables.types.js'

export type SearchOptions = {
    signal?: AbortSignal
    bearerToken?: string
}

export interface MetadataCatalogInterface {
    searchCmr(
        keyword: string,
        type: 'collection' | 'variable' | 'all',
        options?: SearchOptions
    ): Promise<Array<CmrSearchResult>>
}

export type CmrSearchResult = {
    type: 'collection' | 'variable'
    collectionConceptId: string
    collectionEntryId: string
    summary: string
    conceptId: string
    entryId: string
    provider: string
    title: string
}

export type CmrSearchResultsResponse = {
    collections?: {
        items: Array<{
            conceptId: string
            nativeId: string
            provider: string
            title: string
        }>
    }
    variables?: {
        items: Array<{
            conceptId: string
            name: string
            providerId: string
            longName: string
            collections: {
                items: Array<{
                    conceptId: string
                    nativeId: string
                    title: string
                }>
            }
        }>
    }
}

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
