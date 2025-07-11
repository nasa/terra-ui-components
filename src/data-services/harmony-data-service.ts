import { getGraphQLClient } from '../lib/graphql-client.js'
import {
    CANCEL_SUBSET_JOB,
    CREATE_SUBSET_JOB,
    GET_SERVICE_CAPABILITIES,
    GET_SUBSET_JOB_STATUS,
} from './queries.js'
import {
    Status,
    type CollectionWithAvailableServices,
    type DataServiceInterface,
    type SubsetJobOptions,
    type SubsetJobStatus,
    type SearchOptions,
} from './types.js'

export const HARMONY_CONFIG = {
    baseUrl: 'https://harmony.earthdata.nasa.gov',
    cmrUrl: 'https://cmr.earthdata.nasa.gov/search',
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
        collectionConceptId: string,
        subsetOptions?: SubsetJobOptions
    ): Promise<SubsetJobStatus | undefined> {
        const client = await getGraphQLClient()

        console.log(
            'creating subset job ',
            CREATE_SUBSET_JOB,
            collectionConceptId,
            subsetOptions
        )

        const response = await client.mutate<{
            createSubsetJob: SubsetJobStatus
        }>({
            mutation: CREATE_SUBSET_JOB,
            variables: {
                collectionConceptId,
                variableConceptIds: subsetOptions?.variableConceptIds,
                boundingBox: subsetOptions?.boundingBox,
                startDate: subsetOptions?.startDate,
                endDate: subsetOptions?.endDate,
                format: subsetOptions?.format,
            },
            context: {
                headers: {
                    ...(subsetOptions?.bearerToken && {
                        authorization: subsetOptions.bearerToken,
                    }),
                },
                fetchOptions: {
                    signal: subsetOptions?.signal,
                },
            },
        })

        if (response.errors) {
            throw new Error(
                `Failed to create subset job: ${response.errors[0].message}`
            )
        }

        return response.data?.createSubsetJob
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
}
