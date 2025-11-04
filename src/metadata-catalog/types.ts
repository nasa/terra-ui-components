import type { ReactiveControllerHost } from 'lit'
import type { Variable } from '../components/browse-variables/browse-variables.types.js'
import type { MapEventDetail } from '../components/map/type.js'

export type SearchOptions = {
    signal?: AbortSignal
    bearerToken?: string
    limit?: number
    offset?: number
    sortBy?: string
    sortDirection?: string
    search?: string
    startDate?: string
    endDate?: string
    location?: MapEventDetail | null
    cloudCover?: {
        min?: number
        max?: number
    }
}

export interface MetadataCatalogInterface {
    getCollectionCitation(
        collectionEntryId: string,
        options?: SearchOptions
    ): Promise<CmrCollectionCitationItem>

    searchCmr(
        keyword: string,
        type: 'collection' | 'variable' | 'all',
        options?: SearchOptions
    ): Promise<Array<CmrSearchResult>>

    getGranules(
        collectionEntryId: string,
        options?: SearchOptions
    ): Promise<CmrGranulesResponse>

    getSamplingOfGranules(
        collectionEntryId: string,
        options?: SearchOptions
    ): Promise<CmrSamplingOfGranulesResponse>

    getCloudCoverRange(
        collectionEntryId: string,
        options?: SearchOptions
    ): Promise<CloudCoverRange | null>
}

export type CmrGranulesResponse = {
    collections?: {
        items: Array<{
            conceptId: string
            granules: {
                count: number
                items: Array<CmrGranule>
            }
        }>
    }
}

export type CmrSamplingOfGranulesResponse = {
    collections: {
        items: Array<CmrSamplingOfGranules>
    }
}

export type CmrSamplingOfGranules = {
    conceptId: string
    firstGranules: {
        count: number
        items: Array<{
            dataGranule: CmrGranuleDataGranule
        }>
    }
    lastGranules: {
        count: number
        items: Array<{
            dataGranule: CmrGranuleDataGranule
        }>
    }
}

export type CloudCoverRange = {
    min: number
    max: number
}

export type CmrGranule = {
    conceptId: string
    dataGranule: CmrGranuleDataGranule
    title: string
    timeEnd: string
    timeStart: string
    relatedUrls: Array<{
        type: string
        url: string
    }>
    cloudCover: any
}

export type CmrGranuleDataGranule = {
    archiveAndDistributionInformation: Array<ArchiveAndDistributionInformation>
    productionDateTime: string
}

export type ArchiveAndDistributionInformation = {
    name: string
    size: number
    sizeUnit: string
    sizeInBytes?: number
    files?: Array<ArchiveAndDistributionInformation>
}

export type CmrCollectionCitationsResponse = {
    collections: {
        items: Array<CmrCollectionCitationItem>
    }
}

export type CmrCollectionCitationItem = {
    doi: {
        doi: string
    }
    collectionCitations: Array<CmrCollectionCitation>
}

export type CmrCollectionCitation = {
    creator: string
    editor: string
    dataPresentationForm: string
    onlineResource: {
        linkage: string
    }
    publisher: string
    title: string
    seriesName: string
    releaseDate: string
    version: string
    releasePlace: string
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

export type HostWithMaybeProperties = ReactiveControllerHost & {
    variableEntryId?: string
    collection?: string
    variable?: string
    startDate?: string
    endDate?: string
    catalogVariable?: Variable
}
