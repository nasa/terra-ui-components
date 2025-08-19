import { getGraphQLClient } from '../lib/graphql-client.js'
import {
    CANCEL_SUBSET_JOB,
    CREATE_SUBSET_JOB,
    GET_SERVICE_CAPABILITIES,
    GET_SUBSET_JOB_STATUS,
    GET_SUBSET_JOBS,
} from './queries.js'
import {
    Status,
    type CollectionWithAvailableServices,
    type DataServiceInterface,
    type SubsetJobStatus,
    type SearchOptions,
    type SubsetJobs,
    type CreateSubsetJobInput,
} from './types.js'

export const HARMONY_CONFIG = {
    baseUrl: 'https://harmony.earthdata.nasa.gov',
    cmrUrl: 'https://cmr.earthdata.nasa.gov/search',
    proxyUrl:
        'https://lpo4uv7f0h.execute-api.us-east-1.amazonaws.com/default/harmony-link-proxy',
}

export const FINAL_STATUSES = new Set<Status>([
    Status.SUCCESSFUL,
    Status.FAILED,
    Status.CANCELED,
    Status.COMPLETE_WITH_ERRORS,
])

export class HarmonyDataService implements DataServiceInterface {
    async getCollectionWithAvailableServices(
        collectionEntryId: string,
        options?: SearchOptions
    ): Promise<CollectionWithAvailableServices> {
        const client = await getGraphQLClient()

        console.log(
            'Getting collection with available services for ',
            collectionEntryId
        )

        const response = await client.query<{
            getServiceCapabilities: CollectionWithAvailableServices
        }>({
            query: GET_SERVICE_CAPABILITIES,
            variables: {
                collectionEntryId,
            },
            context: {
                headers: {
                    ...(options?.bearerToken && {
                        authorization: options.bearerToken,
                    }),
                    'x-environment': options?.environment ?? 'prod',
                },
                fetchOptions: {
                    signal: options?.signal,
                },
            },
        })

        if (response.errors) {
            throw new Error(
                `Failed to create subset job: ${response.errors[0].message}`
            )
        }

        return response.data.getServiceCapabilities
    }

    async createSubsetJob(
        input: CreateSubsetJobInput,
        options?: SearchOptions
    ): Promise<SubsetJobStatus | undefined> {
        try {
            const client = await getGraphQLClient()
            const response = await client.mutate<{
                createSubsetJob: SubsetJobStatus
            }>({
                mutation: CREATE_SUBSET_JOB,
                variables: {
                    collectionConceptId: input.collectionConceptId,
                    collectionEntryId: input.collectionEntryId,
                    variableConceptIds: input.variableConceptIds,
                    variableEntryIds: input.variableEntryIds,
                    average: input.average,
                    boundingBox: input.boundingBox,
                    startDate: input.startDate,
                    endDate: input.endDate,
                    format: input.format,
                    labels: input.labels,
                },
                context: {
                    headers: {
                        ...(options?.bearerToken && {
                            authorization: options.bearerToken,
                        }),
                        'x-environment': options?.environment ?? 'prod',
                    },
                    fetchOptions: {
                        signal: options?.signal,
                    },
                },
            })

            if (response.errors) {
                throw new Error(
                    `Failed to create subset job: ${response.errors[0].message}`
                )
            }

            return response.data?.createSubsetJob
        } catch (err) {
            console.error('createSubsetJob ERROR: ', err)
            throw err
        }
    }

    async getSubsetJobs(searchOptions?: SearchOptions): Promise<SubsetJobs> {
        const client = await getGraphQLClient()

        const response = await client.query<{
            getSubsetJobs: SubsetJobs
        }>({
            query: GET_SUBSET_JOBS,
            context: {
                headers: {
                    ...(searchOptions?.bearerToken && {
                        authorization: searchOptions.bearerToken,
                    }),
                    'x-environment': searchOptions?.environment ?? 'prod',
                },
                fetchOptions: {
                    signal: searchOptions?.signal,
                },
            },
            fetchPolicy: 'network-only',
        })

        if (response.errors) {
            throw new Error(
                `Failed to fetch subset jobs: ${response.errors[0].message}`
            )
        }

        return response.data.getSubsetJobs
    }

    async getSubsetJobStatus(
        jobId: string,
        searchOptions?: SearchOptions
    ): Promise<SubsetJobStatus> {
        const client = await getGraphQLClient()

        const response = await client.query<{
            getSubsetJobStatus: SubsetJobStatus
        }>({
            query: GET_SUBSET_JOB_STATUS,
            variables: {
                jobId,
            },
            context: {
                headers: {
                    ...(searchOptions?.bearerToken && {
                        authorization: searchOptions.bearerToken,
                    }),
                    'x-environment': searchOptions?.environment ?? 'prod',
                },
                fetchOptions: {
                    signal: searchOptions?.signal,
                },
            },
            fetchPolicy: 'no-cache', //! important, we don't want to get cached results here!
        })

        if (response.errors) {
            throw new Error(
                `Failed to create subset job: ${response.errors[0].message}`
            )
        }

        return response.data.getSubsetJobStatus
    }

    async cancelSubsetJob(
        jobId: string,
        options?: SearchOptions
    ): Promise<SubsetJobStatus> {
        const client = await getGraphQLClient()

        const response = await client.query<{
            cancelSubsetJob: SubsetJobStatus
        }>({
            query: CANCEL_SUBSET_JOB,
            variables: {
                jobId,
            },
            context: {
                headers: {
                    ...(options?.bearerToken && {
                        authorization: options.bearerToken,
                    }),
                    'x-environment': options?.environment ?? 'prod',
                },
            },
            fetchPolicy: 'no-cache', //! important, we don't want to get cached results here!
        })

        if (response.errors) {
            throw new Error(
                `Failed to cancel subset job: ${response.errors[0].message}`
            )
        }

        return response.data.cancelSubsetJob
    }

    async getSubsetJobData(
        job: SubsetJobStatus,
        options?: SearchOptions
    ): Promise<{ blob: Blob; text: string }> {
        const link = job.links.find(link => link.rel === 'data')?.href

        if (!link) {
            throw new Error('No data link found for job')
        }

        const proxyUrl = `${HARMONY_CONFIG.proxyUrl}?url=${encodeURIComponent(link)}`

        console.log('fetching data from ', proxyUrl)

        const response = await fetch(proxyUrl, {
            headers: {
                ...(options?.bearerToken && {
                    Authorization: `Bearer ${options?.bearerToken}`,
                }),
            },
            signal: options?.signal,
        })

        if (!response.ok) {
            throw new Error(
                `Failed to fetch subset job link contents: ${response.statusText}`
            )
        }

        const clonedResponse = response.clone()
        const blob = await response.blob()
        const text = await clonedResponse.text()

        return { blob, text }
    }
}
