import {
    BadRequestException,
    NotFoundException,
} from '../exceptions/http.exception.js'
import { apiClient } from './api.client.js'
import type { RequestOptions } from './types.js'
import type { UmmResponse, UmmC, UmmG } from '../types/cmr.js'
import type { MapEventDetail } from '../components/map/type.js'

const baseUrl = 'https://cmr.earthdata.nasa.gov/search/'

export type SearchGranulesParams = {
    collectionEntryId?: string
    collectionConceptId?: string
    pageSize?: number
    pageNum?: number
    offset?: number
    sortBy?: string
    sortDirection?: 'asc' | 'desc' | string
    search?: string
    searchFields?: string[]
    startDate?: string
    endDate?: string
    location?: MapEventDetail | null
    cloudCover?: {
        min?: number
        max?: number
    }
}

class NasaCmrApi {
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

        // CMR has a search-based API, so you always get back an items[] array
        // we'll grab the first item to represent the collection
        const ummResponse = await this.#request<UmmResponse<UmmC>>(
            `collections.umm_json?entry_id=${collectionEntryId}`,
            options
        )

        if (!ummResponse.items.length) {
            throw new NotFoundException({
                message: `Collection ${collectionEntryId} was not found`,
            })
        }

        // return the actual collection record
        return ummResponse.items[0]
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

    #request<T>(path: string, requestOptions?: RequestOptions) {
        return apiClient.get<T>(`${baseUrl}${path}`, {
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

const nasaCmrApi = new NasaCmrApi()

export default nasaCmrApi
