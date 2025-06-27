import type { SearchOptions } from '../components/browse-variables/browse-variables.types.js'
import { getGraphQLClient } from '../lib/graphql-client.js'
import { CREATE_SUBSET_JOB, GET_SUBSET_JOB_STATUS } from './queries.js'
import {
    Status,
    type DataServiceInterface,
    type SubsetJobOptions,
    type SubsetJobStatus,
} from './types.js'

const authorization = ''

export const HARMONY_CONFIG = {
    baseUrl: 'https://harmony.earthdata.nasa.gov',
    cmrUrl: 'https://cmr.earthdata.nasa.gov/search',
}

export const FINAL_STATUSES = new Set<Status>([
    Status.SUCCESSFUL,
    Status.FAILED,
    Status.CANCELED,
])

export class HarmonyDataService implements DataServiceInterface {
    async getAvailableServices(): Promise<any> {
        // TODO: implement
        return []
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
            subsetOptions?.variableConceptId
        )

        const response = await client.mutate<{
            createSubsetJob: SubsetJobStatus
        }>({
            mutation: CREATE_SUBSET_JOB,
            variables: {
                collectionConceptId,
                variableConceptId: subsetOptions?.variableConceptId,
            },
            context: {
                headers: {
                    authorization,
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
                    authorization,
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
}
