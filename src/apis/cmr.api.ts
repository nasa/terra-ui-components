import {
    BadRequestException,
    NotFoundException,
} from '../exceptions/http.exception.js'
import { apiClient, type RequestOptions } from '../lib/api.client.js'
import type { MapEventDetail } from '../components/map/type.js'
import type { UmmC } from './types/cmr/umm-c.js'
import type { UmmVar } from './types/cmr/umm-var.js'
import type { UmmG } from './types/cmr/umm-g.js'
import type { CmrCollectionsJsonResponse } from './types/cmr/collection-tags.js'

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
    cloudCover: unknown
}

export type CmrGranuleDataGranule = {
    archiveAndDistributionInformation: Array<ArchiveAndDistributionInformation>
}

export type ArchiveAndDistributionInformation = {
    name: string
    size: number
    sizeUnit: string
    sizeInBytes?: number
    files?: Array<ArchiveAndDistributionInformation>
}

export type CloudCoverRange = {
    min: number
    max: number
}

const baseUrl = 'https://cmr.earthdata.nasa.gov/search/'

export interface UmmResponse<T> {
    hits: number
    items: Array<UmmResult<T>>
}

export interface UmmResult<T> {
    meta: UmmMeta
    umm: T
}

/**
 * meta information from the CMR search endpoint
 * there are quite a few more fields available but we're only using what we need
 */
export interface UmmMeta {
    'concept-id': string
    'native-id': string
    'provider-id': string
    'granule-count'?: number
}

// CMR concept-ids look like 'C1234567890-PROVIDER_ID'; entry-ids don't follow
// this shape (e.g. 'M2T1NXAER_5_12_4'), so this is enough to tell them apart.
export const CONCEPT_ID_PATTERN = /^[A-Z]\d+-[A-Z0-9_]+$/i

export type SearchParams = {
    pageSize?: number
    pageNum?: number
    offset?: number
    sortBy?: string
    sortDirection?: 'asc' | 'desc' | string
    search?: string
    searchFields?: string[]
}

export type SearchGranulesParams = SearchParams & {
    collectionEntryId?: string
    collectionConceptId?: string
    startDate?: string
    endDate?: string
    location?: MapEventDetail | null
    cloudCover?: {
        min?: number
        max?: number
    }
}

export type SearchVariablesParams = SearchParams & {
    collectionConceptId?: string
}

class CmrApi {
    async getCollection(
        shortName: string,
        version: string,
        options?: RequestOptions
    ) {
        return this.getCollectionByEntryId(`${shortName}_${version}`, options)
    }

    async getCollectionByEntryId(
        collectionEntryId?: string,
        options?: RequestOptions
    ) {
        if (!collectionEntryId) {
            throw new BadRequestException({
                message: '`collectionEntryId` is required',
            })
        }

        return this.#getCollection(
            `entry_id=${collectionEntryId}`,
            collectionEntryId,
            options
        )
    }

    async getCollectionByConceptId(
        collectionConceptId?: string,
        options?: RequestOptions
    ) {
        if (!collectionConceptId) {
            throw new BadRequestException({
                message: '`collectionConceptId` is required',
            })
        }

        return this.#getCollection(
            `concept-id=${collectionConceptId}`,
            collectionConceptId,
            options
        )
    }

    async #getCollection(
        queryParam: string,
        collectionId: string,
        options?: RequestOptions
    ) {
        // CMR has a search-based API, so you always get back an items[] array
        // we'll grab the first item to represent the collection
        const ummResponse = await this.#request<UmmResponse<UmmC>>(
            `collections.umm_json?${queryParam}&include_granule_counts=true`,
            options
        )

        if (!ummResponse.items.length) {
            throw new NotFoundException({
                message: `Collection ${collectionId} was not found`,
            })
        }

        // return the actual collection record
        return ummResponse.items[0]
    }

    async searchVariables(
        searchParams: SearchVariablesParams,
        options?: RequestOptions
    ) {
        if (!searchParams.collectionConceptId) {
            throw new BadRequestException({
                message: '`collectionConceptId` is required',
            })
        }

        return this.#request<UmmResponse<UmmVar>>(
            `variables.umm_json?keyword=${searchParams.collectionConceptId}&page_size=${searchParams.pageSize ?? 200}`,
            options
        )
    }

    /**
     * Looks up a collection's curated tags (GIBS imagery, products, collection capabilities, etc.)
     * via CMR's `collections.json` search.
     *
     * Unlike the UMM-JSON endpoints used elsewhere in this class, `collections.json` is what exposes EDSC's curated tag data.
     */
    async getCollectionTags(
        collectionId: string,
        options?: RequestOptions
    ): Promise<CmrCollectionsJsonResponse> {
        const queryParam = CONCEPT_ID_PATTERN.test(collectionId)
            ? `concept-id=${collectionId}`
            : `entry_id[]=${collectionId}`

        return this.#request<CmrCollectionsJsonResponse>(
            `collections.json?${queryParam}&include_tags=edsc*`,
            options
        )
    }

    async getSamplingOfGranules(
        collectionEntryId: string,
        options?: RequestOptions
    ): Promise<{
        minDate?: string
        maxDate?: string
        isSubDaily: boolean
        hasGranules: boolean
        firstGranule?: UmmG
        lastGranule?: UmmG
    }> {
        const [first, last] = await Promise.all([
            this.searchGranules(
                {
                    collectionEntryId,
                    pageSize: 1,
                    sortBy: 'umm.TemporalExtent.RangeDateTime.BeginningDateTime',
                    sortDirection: 'asc',
                },
                options
            ),
            this.searchGranules(
                {
                    collectionEntryId,
                    pageSize: 1,
                    sortBy: 'umm.TemporalExtent.RangeDateTime.BeginningDateTime',
                    sortDirection: 'desc',
                },
                options
            ),
        ])

        const firstGranule = first.items[0]?.umm
        const lastGranule = last.items[0]?.umm
        const firstExtent = firstGranule?.TemporalExtent?.RangeDateTime
        const isSubDaily =
            firstExtent?.BeginningDateTime != null &&
            firstExtent.EndingDateTime != null
                ? (new Date(firstExtent.EndingDateTime).getTime() -
                      new Date(firstExtent.BeginningDateTime).getTime()) /
                      (1000 * 60 * 60) <
                  24
                : false

        return {
            minDate: firstExtent?.BeginningDateTime?.toString(),
            maxDate:
                lastGranule?.TemporalExtent?.RangeDateTime?.BeginningDateTime?.toString(),
            isSubDaily,
            hasGranules: first.hits > 0,
            firstGranule,
            lastGranule,
        }
    }

    async searchGranules(params: SearchGranulesParams, options?: RequestOptions) {
        if (!params.collectionEntryId && !params.collectionConceptId) {
            throw new BadRequestException({
                message:
                    '`collectionEntryId` or `collectionConceptId` is required to search granules',
            })
        }

        // convert our search params into CMR query params
        const searchParams = new URLSearchParams({
            ...(params.collectionEntryId && {
                'entry_id[]': params.collectionEntryId,
            }),
            ...(params.collectionConceptId && {
                collection_concept_id: params.collectionConceptId,
            }),
            ...(params.pageSize && { page_size: params.pageSize.toString() }),
            ...(params.pageNum && { page_num: params.pageNum.toString() }),
            ...(params.offset && { offset: params.offset.toString() }),
            ...(params.sortBy && {
                'sort_key[]': this.#getGranuleSortKey(
                    params.sortBy,
                    params.sortDirection ?? 'asc'
                ),
            }),
            ...(params.search && {
                // TODO: support searchFields for searching other than granule_ur
                'granule_ur[]': `*${params.search}*`,
                'options[granule_ur][pattern]': 'true', // CMR supports wildcard searching via the pattern option
            }),
            ...(params.startDate &&
                params.endDate && {
                    temporal: `${params.startDate},${params.endDate}`,
                }),
            ...(params.location?.type === 'bbox' && {
                // TODO: support other location types (e.g. circle, polygon, point, shapefile)
                bounding_box: params.location.bounds.toBBoxString(),
            }),
            ...(params.cloudCover?.min !== undefined &&
                params.cloudCover?.max !== undefined && {
                    cloud_cover: `${params.cloudCover.min},${params.cloudCover.max}`,
                }),
        })

        return this.#request<UmmResponse<UmmG>>(
            `granules.umm_json?${searchParams.toString()}`,
            options
        )
    }

    async getCollectionCitation(
        collectionEntryId: string,
        options?: RequestOptions
    ): Promise<CmrCollectionCitationItem> {
        const collection = await this.getCollectionByEntryId(
            collectionEntryId,
            options
        )
        const umm = collection.umm

        if (!umm.CollectionCitations?.length) {
            throw new Error(`No collection citations found for ${collectionEntryId}`)
        }

        return {
            doi: {
                doi: umm.DOI?.DOI ?? '',
            },
            collectionCitations: umm.CollectionCitations.map(citation => ({
                creator: citation.Creator ?? '',
                editor: citation.Editor ?? '',
                dataPresentationForm: citation.DataPresentationForm ?? '',
                onlineResource: {
                    linkage: citation.OnlineResource?.Linkage ?? '',
                },
                publisher: citation.Publisher ?? '',
                title: citation.Title ?? '',
                seriesName: citation.SeriesName ?? '',
                releaseDate: citation.ReleaseDate ? String(citation.ReleaseDate) : '',
                version: citation.Version ?? '',
                releasePlace: citation.ReleasePlace ?? '',
            })),
        }
    }

    #request<T>(path: string, requestOptions?: RequestOptions) {
        return apiClient.get<T>(`${baseUrl}${path}`, {
            ...requestOptions,
            headers: {
                ...requestOptions?.headers,
                ...(requestOptions?.bearerToken && {
                    Authorization: `Bearer ${requestOptions.bearerToken}`,
                }),
            },
        })
    }

    // TODO: replace references to these old columns with these names and remove this method (data access may be the only location)
    #getGranuleSortKey(sortBy: string, sortDirection: string) {
        let sortKey = sortBy

        switch (sortBy) {
            case 'title':
            case 'umm.GranuleUR':
                sortKey = 'granuleUr' // not a typo, this should NOT be "granuleUrl"
                break
            case 'size':
            case 'umm.DataGranule.Size':
                sortKey = 'dataSize'
                break
            case 'timeStart':
            case 'umm.TemporalExtent.RangeDateTime.BeginningDateTime':
                sortKey = 'startDate'
                break
            case 'timeEnd':
            case 'umm.TemporalExtent.RangeDateTime.EndingDateTime':
                sortKey = 'endDate'
                break
        }

        return `${sortDirection === 'asc' ? '+' : '-'}${sortKey}`
    }
}

const cmrApi = new CmrApi()

export default cmrApi
