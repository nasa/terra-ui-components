import { apiClient } from './api.client.js'
import type { RequestOptions } from './types.js'

const baseUrl = 'https://api.giovanni.earthdata.nasa.gov/'

class GiovanniApi {
    /**
     * Fetches the list of configured variables from the Giovanni API.
     * Giovanni does not support all variables, so this endpoint provides a list of variables that are supported for subsetting.
     */
    async getConfiguredVariables(options?: RequestOptions) {
        const response = await this.#request<{ configured_variables: string[] }>(
            'configured-variables',
            options
        )

        return response.configured_variables
    }

    #request<T>(path: string, requestOptions?: RequestOptions) {
        return apiClient.get<T>(`${baseUrl}${path}`, requestOptions)
    }
}

const giovanniApi = new GiovanniApi()

export default giovanniApi
