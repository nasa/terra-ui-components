import {
    BadRequestException,
    NotFoundException,
} from '../exceptions/http.exception.js'
import { apiClient } from './api.client.js'
import type { RequestOptions } from './types.js'
import type { UmmResponse, UmmC } from '../types/cmr.js'

const baseUrl = 'https://cmr.earthdata.nasa.gov/search/'

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
}

const nasaCmrApi = new NasaCmrApi()

export default nasaCmrApi
