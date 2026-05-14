import { apiClient, type RequestOptions } from '../lib/api.client.js'
import type { HarmonyRequest } from '../lib/harmony/harmony.request.js'
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

export const CLOUD_GIOVANNI_URLS = {
    [Environments.PROD]: 'https://api.giovanni.earthdata.nasa.gov',
    [Environments.UAT]: 'https://api.giovanni.uat.earthdata.nasa.gov',
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

    // this is a custom field that provides a better list of output formats to present the user including labels and descriptions
    configuredOutputFormats: ConfiguredOutputFormat[]
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
    outputFormats: string[]
}

export type ConfiguredOutputFormat = {
    key: string
    label: string
    description: string
    isGiovanniFormat?: boolean
}

export interface Service {
    name: string
    href: string
    capabilities: Capabilities
}

export interface Capabilities {
    subsetting: Subsetting
    outputFormats: string[]
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

export type SubsetJobStatus = {
    jobID: string
    status: Status
    message: string
    progress: number
    createdAt: string
    updatedAt: string
    dataExpiration: string
    request: string
    numInputGranules: number
    originalDataSize?: string
    outputDataSize?: string
    dataSizePercentChange?: string
    labels?: string[]
    errors?: Array<SubsetJobError>
    links: Array<SubsetJobLink>
    /** Thumbnail image blob stored locally in IndexedDB, if available */
    thumbnailBlob?: Blob
}

export type SubsetJobError = {
    url: string
    message: string
}

export type SubsetJobLink = {
    title: string
    href: string
    rel: string
    type: string
    bbox?: number[]
    temporal?: {
        start: string
        end: string
    }
}

export type SearchOptions = {
    signal?: AbortSignal
    bearerToken?: string | null
    environment?: 'uat' | 'prod'
}

export type SubsetJobs = {
    count: number
    jobs: Array<SubsetJobStatus>
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

        // the variables returned from the Harmony capabilities endpoint don't include the concept ID
        // but we can extract it from the href property and add it to each variable for easier reference later
        capabilities.variables = this.addConceptIdToVariables(
            capabilities.variables,
        )

        // add a custom property to the capabilities response that provides a better list of output formats to present to the user
        // including labels and descriptions
        capabilities.configuredOutputFormats =
            this.getOutputFormatOptions(capabilities)

        return capabilities
    }

    /**
     * Gets a user's Harmony jobs
     */
    async getJobs(
        params?: {
            page?: number
            limit?: number
            // Filters jobs to those which include at least one of the labels specified. Multiple labels can be specified using a comma-separated list.
            label?: string
        },
        options?: SearchOptions,
    ) {
        const queryParams = new URLSearchParams()
        if (params?.page) queryParams.append('page', params.page.toString())
        if (params?.limit) queryParams.append('limit', params.limit.toString())
        if (params?.label) queryParams.append('label', params.label)

        return this.#request<{
            count: number
            jobs: SubsetJobStatus[]
            links: SubsetJobLink[]
        }>(`jobs?${queryParams.toString()}`, options)
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
     * Removes one or more labels from one or more Harmony jobs.
     * After removal, the jobs will no longer match label-based filters.
     *
     * @example
     * await harmonyApi.removeJobLabels({ jobIDs: ['abc', 'def'], labels: ['my-label'] }, { bearerToken })
     */
    async removeJobLabels(
        params: { jobIDs: string[]; labels: string[] },
        options?: SearchOptions,
    ): Promise<void> {
        const url = `${HARMONY_URLS[Environments.PROD]}/labels`
        return apiClient.delete<void>(url, {
            body: { jobID: params.jobIDs, label: params.labels },
            headers: {
                'Content-Type': 'application/json',
                ...(options?.bearerToken && {
                    Authorization: `Bearer ${options.bearerToken}`,
                }),
            },
            signal: options?.signal,
        })
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

    /**
     * When a Harmony job finishes, it provides URLs for downloading the results. This method can be used to fetch the results from those URLs, which may require authentication if the data is not public.
     */
    async fetchUrl(url: string, options?: SearchOptions) {
        // we want to remove known Cloud Giovanni hostnames from the beginning of the URL if present so that the request goes through our anonymous proxy
        const relativeUrl = url
            .replace(CLOUD_GIOVANNI_URLS.PROD, '')
            .replace(CLOUD_GIOVANNI_URLS.UAT, '')

        return this.#request(relativeUrl, options)
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

    /**
     * Extracts the variable concept ID from the variable's href and adds it as a property on the variable object.
     */
    addConceptIdToVariables(variables: Variable[]) {
        return variables.map((v) => {
            const match = v.href.match(/\/concepts\/(V\d+-\w+)$/)
            if (match) {
                v.conceptId = match[1]
            }
            return v
        })
    }

    /**
     * Processes the Harmony capabilities response to generate a list of output format options with user-friendly labels and descriptions.
     * If Giovanni is the only service available, only return Giovanni-specific formats.
     * If Giovanni is present with other services, include both Giovanni and non-Giovanni formats, avoiding duplicates.
     * If Giovanni is not present, return only non-Giovanni formats.
     */
    getOutputFormatOptions(capabilities: HarmonyCapabilitiesResponse) {
        const hasNonGiovanniServices =
            this.#hasNonGiovanniServices(capabilities)
        const hasGiovanniServices = this.#hasGiovanniServices(capabilities)
        const giovanniFormats = hasGiovanniServices
            ? this.#getGiovanniFormats(capabilities)
            : []

        // If Giovanni is the only service, use only Giovanni formats
        if (hasGiovanniServices && !hasNonGiovanniServices) {
            return giovanniFormats
        }

        const outputFormats: ConfiguredOutputFormat[] = []

        // Get formats only from non-Giovanni services
        const nonGiovanniFormats = this.#getNonGiovanniFormats(capabilities)

        // Process non-Giovanni output formats
        nonGiovanniFormats.forEach((format) => {
            let label = format
            let description = `Download data in ${format} format`

            switch (format) {
                case 'application/x-hdf':
                case 'application/octet-stream':
                    label = 'HDF-EOS5'
                    description = 'Download data in HDF-EOS5 format'
                    break

                case 'application/x-netcdf4':
                case 'application/netcdf':
                    label = 'NetCDF'
                    description = 'Download data in NetCDF format'
                    break

                case 'application/x-netcdf4;profile=opendap_url':
                    label = 'OPeNDAP URL (x-netcdf4)'
                    description =
                        'Download data in OPeNDAP URL (x-netcdf4) format'
                    break

                case 'text/csv':
                    label = 'CSV'
                    description = 'Download data in CSV format'
                    break

                case 'image/tiff':
                case 'image/tif':
                    label = 'TIFF'
                    description = 'Download data in TIFF format'
                    break

                case 'image/png':
                    label = 'PNG'
                    description = 'Download data in PNG format'
                    break

                case 'image/jpg':
                case 'image/jpeg':
                    label = 'JPEG'
                    description = 'Download data in JPEG format'
                    break

                case 'application/shapefile+zip':
                    label = 'Shapefile+zip'
                    description = 'Download data in Shapefile+zip format'
                    break

                case 'application/x-zarr':
                    label = 'ZARR'
                    description = 'Download data in ZARR format'
                    break

                default:
                    // for unknown formats, we can just use the MIME type as the label and a generic description
                    label = format
                    description = `Download data in ${format} format`
            }

            outputFormats.push({
                key: format,
                label,
                description,
            })
        })

        // Add Giovanni-specific formats if Giovanni is present with other services
        if (hasGiovanniServices && hasNonGiovanniServices) {
            outputFormats.push(...giovanniFormats)
        }

        return outputFormats
    }

    #hasGiovanniServices(capabilities: HarmonyCapabilitiesResponse): boolean {
        return (
            capabilities?.services?.some((service) =>
                service.name.toLowerCase().includes('giovanni'),
            ) ?? false
        )
    }

    #hasNonGiovanniServices(
        capabilities: HarmonyCapabilitiesResponse,
    ): boolean {
        return (
            capabilities?.services?.some(
                (service) => !service.name.toLowerCase().includes('giovanni'),
            ) ?? false
        )
    }

    #getNonGiovanniFormats(
        capabilities: HarmonyCapabilitiesResponse,
    ): string[] {
        if (!capabilities?.services) {
            return []
        }

        const nonGiovanniServices = capabilities.services.filter(
            (service) => !service.name.toLowerCase().includes('giovanni'),
        )

        // Collect all unique output formats from non-Giovanni services
        const formats = new Set<string>()
        nonGiovanniServices.forEach((service) => {
            service.capabilities.outputFormats?.forEach((format) => {
                formats.add(format)
            })
        })

        const formatArray = Array.from(formats)

        // If both application/netcdf and application/x-netcdf4 are present,
        // only use application/x-netcdf4
        if (
            formatArray.includes('application/netcdf') &&
            formatArray.includes('application/x-netcdf4')
        ) {
            return formatArray.filter(
                (format) => format !== 'application/netcdf',
            )
        }

        return formatArray
    }

    #getGiovanniFormats(
        capabilities: HarmonyCapabilitiesResponse,
    ): ConfiguredOutputFormat[] {
        const giovanniFormats: ConfiguredOutputFormat[] = []

        capabilities.services.forEach((service) => {
            const serviceName = service.name.toLowerCase()

            if (serviceName.includes('giovanni-time-series')) {
                giovanniFormats.push({
                    key: 'text/csv',
                    label: 'CSV (point-based time series; one file)',
                    description: 'Single variable plotted over time',
                    isGiovanniFormat: true,
                })
            }

            if (serviceName.includes('giovanni-averaging')) {
                giovanniFormats.push(
                    {
                        key: 'image/tiff',
                        label: 'GeoTIFF (time-averaged map; one file)',
                        description: 'Time averaged representation as map',
                        isGiovanniFormat: true,
                    },
                    {
                        key: 'text/csv',
                        label: 'CSV (area-averaged time series; one file)',
                        description: 'Area averaged data over time',
                        isGiovanniFormat: true,
                    },
                )
            }
        })

        return giovanniFormats.filter(
            (format, index, formats) =>
                formats.findIndex(
                    (existing) => existing.label === format.label,
                ) === index,
        )
    }
}

export const harmonyApi = new HarmonyApi()
