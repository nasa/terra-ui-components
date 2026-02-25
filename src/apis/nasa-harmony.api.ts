import type { RequestOptions } from './types.js'
import { apiClient } from './api.client.js'
import { BadRequestException } from '../exceptions/http.exception.js'
import type { HarmonyCapabilitiesResponse } from '../types/harmony.js'

// Harmony does not have CORS header, which means components cannot directly access Harmony endpoints
// until that is implemented we need to use a proxy endpoint
const baseUrl =
    'https://sjldutoe6c.execute-api.us-east-1.amazonaws.com/default/harmony-proxy/'

class NasaHarmonyApi {
    /**
     * Returns collection capabilities including available services, output formats, subsetting options, etc.
     * from the Harmony /capabilities endpoint
     */
    async getCollectionCapabilities(conceptId?: string, options?: RequestOptions) {
        if (!conceptId) {
            throw new BadRequestException({
                message: '`collectionConceptId` is required',
            })
        }

        return this.#request<HarmonyCapabilitiesResponse>(
            `capabilities?collectionId=${conceptId}`,
            options
        )
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
}

const nasaHarmonyApi = new NasaHarmonyApi()

export default nasaHarmonyApi
