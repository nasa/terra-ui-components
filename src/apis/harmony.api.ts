import { apiClient, type RequestOptions } from '../lib/api.client.js'
import type { HarmonyRequest } from '../lib/harmony/harmony.request.js'
import type { SubsetJobStatus, SearchOptions } from '../data-services/types.js'
import { BadRequestException } from '../exceptions/http.exception.js'

const API_VERSION = '3'

export const Environments = {
    PROD: 'PROD',
    UAT: 'UAT',
} as const

export type Environments = (typeof Environments)[keyof typeof Environments]

export const HARMONY_URLS = {
    [Environments.PROD]: 'https://harmony.earthdata.nasa.gov',
    [Environments.UAT]: 'https://harmony.uat.earthdata.nasa.gov',

    // for anonymous access, we have to go through our proxy since Harmony doesn't support anonymous requests directly
    // the proxy will add the necessary authentication to the request on the backend, so we can still use the same HarmonyRequest class to build the request URL with the appropriate parameters
    // the proxy also adds restrictions on how much data can be requested
    ANONYMOUS_ACCESS:
        'https://sjldutoe6c.execute-api.us-east-1.amazonaws.com/default/harmony-proxy',
}

export enum Status {
    FETCHING = 'fetching',
    PREVIEWING = 'previewing',
    RUNNING = 'running',
    SUCCESSFUL = 'successful',
    FAILED = 'failed',
    CANCELED = 'canceled',
    PAUSED = 'paused',
    RUNNING_WITH_ERRORS = 'running_with_errors',
    COMPLETE_WITH_ERRORS = 'complete_with_errors',
}

export const FINAL_STATUSES = new Set<Status>([
    Status.SUCCESSFUL,
    Status.FAILED,
    Status.CANCELED,
    Status.COMPLETE_WITH_ERRORS,
])

export const OUTPUT_FORMATS = {
    'application/x-netcdf4': 'X-NETCDF-4',
    'application/netcdf4': 'NETCDF-4',
    'application/x-netcdf4;profile=opendap_url': 'X-NETCDF-4 (OPeNDAP URL)',
    'application/netcdf': 'NETCDF',
    'application/x-hdf': 'X-HDF',
    'image/tiff': 'GEOTIFF',
    'image/gif': 'GIF',
    'image/png': 'PNG',
    'image/jpeg': 'JPEG',
    'text/csv': 'CSV',
    'application/shapefile+zip': 'Shapefile+zip',
    'application/x-zarr': 'ZARR',
} as const

export type OutputFormats = (typeof OUTPUT_FORMATS)[keyof typeof OUTPUT_FORMATS]

export interface HarmonyCapabilitiesResponse {
    conceptId: string
    shortName: string
    summary: HarmonyCapabilitiesSummary
    services: Service[]
    variables: Variable[]
    capabilitiesVersion: string
}

export interface HarmonyCapabilitiesSummary {
    subsetting: {
        bbox: boolean
        dimension: boolean
        shape: boolean
        temporal: boolean
        variable: boolean
    }
    reprojection: {
        supported: boolean
        supportedProjections: string[]
        interpolationMethods: string[]
    }
    averaging: {
        time: boolean
        area: boolean
    }
    concatenation: boolean
    outputFormats: OutputFormats[]
}

export interface Service {
    name: string
    href: string
    capabilities: Capabilities
}

export interface Capabilities {
    subsetting: Subsetting
    output_formats: string[]
    averaging?: Averaging
}

export interface Averaging {
    time: boolean
    area: boolean
}

export interface Subsetting {
    temporal: boolean
    variable: boolean
    multiple_variable?: boolean
    bbox?: boolean
    shape?: boolean
}

export interface Variable {
    conceptId: string
    name: string
    href: string
}

/**
 * Harmony REST API wrapper for OGC-based subset job operations.
 * Makes direct HTTP calls to the Harmony service endpoints.
 */
class HarmonyApi {
    /**
     * Returns collection capabilities including available services, output formats, subsetting options, etc.
     * from the Harmony /capabilities endpoint
     */
    async getCollectionCapabilities(
        conceptId?: string,
        options?: RequestOptions,
    ) {
        if (!conceptId) {
            throw new BadRequestException({
                message: '`collectionConceptId` is required',
            })
        }

        const capabilities = await this.#request<HarmonyCapabilitiesResponse>(
            `capabilities?collectionId=${conceptId}&version=${API_VERSION}`,
            options,
        )

        // the variables don't currently return a concept id as a standalone property
        // the variables return a url that contains the concept id, so we'll extract it from there
        // ex: https://cmr.earthdata.nasa.gov/search/concepts/V2621793591-GES_DISC"
        capabilities.variables.forEach((variable) => {
            const match = variable.href.match(/\/concepts\/(V\d+-\w+)$/)
            if (match) {
                variable.conceptId = match[1]
            }
        })

        return capabilities
    }

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
        jobId: string,
        options?: SearchOptions,
    ): Promise<SubsetJobStatus> {
        return this.#request<SubsetJobStatus>(`jobs/${jobId}`, options)
    }

    /**
     * Given a jobId for a running job, send a cancellation request to the Harmony API.
     * Returns the updated job status after cancellation.
     */
    async cancelJob(
        jobId: string,
        options?: SearchOptions,
    ): Promise<SubsetJobStatus> {
        return this.#request<SubsetJobStatus>(`jobs/${jobId}/cancel`, options)
    }

    #request<T>(url: string, options?: SearchOptions) {
        let environmentUrl = HARMONY_URLS[Environments.PROD] // TODO: support for UAT

        if (!options?.bearerToken) {
            // if we don't have a bearer token, we'll use the anonymous access URL which goes through our proxy
            environmentUrl = HARMONY_URLS.ANONYMOUS_ACCESS
        }

        if (!url.startsWith('http')) {
            // if url is a relative path, prepend the base Harmony URL
            url = `${environmentUrl}/${url}`
        }

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
