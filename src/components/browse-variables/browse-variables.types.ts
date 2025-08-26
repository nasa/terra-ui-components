export interface CatalogRepositoryInterface {
    /**
     * used to retrieve a list of variables and facet categories that can be filtered by
     * a search query and/or a list of selected facet fields
     */
    searchVariablesAndFacets(
        query?: string,
        selectedFacets?: SelectedFacets,
        options?: SearchOptions
    ): Promise<SearchResponse>
}

export type SearchOptions = {
    signal: AbortSignal
}

export type SearchResponse = {
    facetsByCategory: FacetsByCategory
    variables: Variable[]
    total: number
}

export type SelectedFacets = {
    [facetName: string]: string[]
}

export type FacetsByCategory = {
    depths: FacetField[]
    disciplines: FacetField[]
    measurements: FacetField[]
    observations: FacetField[]
    platformInstruments: FacetField[]
    portals: FacetField[]
    spatialResolutions: FacetField[]
    specialFeatures: FacetField[]
    temporalResolutions: FacetField[]
    wavelengths: FacetField[]
}

export type FacetField = {
    name: string
    count: number
}

//? there are quite a few more properties available, look at the response directly
export type Variable = {
    dataFieldId: string
    dataProductShortName: string
    dataProductVersion: string
    dataFieldShortName: string
    dataFieldAccessName: string
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
    dataFieldUnits: string
    // dataset landing page
    dataProductDescriptionUrl: string
    // variable landing page
    dataFieldDescriptionUrl: string
    dataProductInstrumentShortName: string
} & Partial<ExampleInitialDates>

export type ExampleInitialDates = {
    exampleInitialStartDate: Date
    exampleInitialEndDate: Date
}
