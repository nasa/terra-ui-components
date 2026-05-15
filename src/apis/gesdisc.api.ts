import { BadRequestException } from '../exceptions/http.exception.js'
import { apiClient, type RequestOptions } from '../lib/api.client.js'

const baseUrl = 'https://disc.gsfc.nasa.gov/api/'

// partial typing for the GES DISC API, we only need certain parts of the collection
export interface GesDiscCollection {
    services: {
        subset?: Array<{
            dimensions?: Array<{
                value: string
                label: string
            }>
        }>
    }
}

class GesDiscApi {
    async getCollectionByEntryId(
        collectionEntryId?: string,
        options?: RequestOptions
    ) {
        if (!collectionEntryId) {
            throw new BadRequestException({
                message: '`collectionEntryId` is required',
            })
        }

        return this.#request<GesDiscCollection>(
            `/metadata/dataset/${collectionEntryId}`,
            options
        )
    }

    #request<T>(path: string, requestOptions?: RequestOptions) {
        return apiClient.get<T>(`${baseUrl}${path}`, requestOptions)
    }
}

const gesDiscApi = new GesDiscApi()

export default gesDiscApi
