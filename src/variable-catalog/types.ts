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

export type GiovanniVariable = {
    dataFieldId: string
    dataProductShortName: string
    dataProductVersion: string
    dataFieldShortName: string
    dataFieldLongName: string
    dataProductLongName: string
    dataProductTimeInterval: string
    dataProductWest: number
    dataProductSouth: number
    dataProductEast: number
    dataProductNorth: number
    dataProductSpatialResolution: string
    dataProductBeginDateTime: string
    dataProductEndDateTime: string
    dataFieldKeywords: string[]
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
    variables: GiovanniVariable[]
    facets: GiovanniFacet[]
}
