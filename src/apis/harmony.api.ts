import { apiClient } from '../lib/api.client.js'
import {
    Environments,
    HARMONY_URLS,
    type HarmonyRequest,
} from '../lib/harmony/harmony.request.js'
import type { SubsetJobStatus, SearchOptions } from '../data-services/types.js'

/**
 * Harmony REST API wrapper for OGC-based subset job operations.
 * Makes direct HTTP calls to the Harmony service endpoints.
 */
class HarmonyApi {
    /**
     * Create a subset job by sending a GET request to the Harmony OGC API endpoint.
     * The harmonyRequest.requestUrl contains the full URL with all subset parameters.
     */
    async createJob(
        harmonyRequest: HarmonyRequest,
        options?: SearchOptions,
    ): Promise<SubsetJobStatus> {
        return this.#request<SubsetJobStatus>(
            harmonyRequest.requestUrl,
            options,
        )
    }

    /**
     * Get the current status of an existing subset job.
     * Intended for polling until the job reaches a final state.
     */
    async getJobStatus(
        jobID: string,
        options?: SearchOptions,
    ): Promise<SubsetJobStatus> {
        return this.#request<SubsetJobStatus>(
            `${HARMONY_URLS[Environments.PROD]}/jobs/${jobID}`,
            options,
        )
    }

    #request<T>(url: string, options?: SearchOptions) {
        return apiClient.get<T>(url, {
            signal: options?.signal,
            headers: {
                ...(options?.bearerToken && {
                    Authorization: `Bearer ${options.bearerToken}`,
                }),
            },
        })
    }
}

export const harmonyApi = new HarmonyApi()
