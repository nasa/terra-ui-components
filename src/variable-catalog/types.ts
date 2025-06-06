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
