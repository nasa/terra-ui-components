import type {
    MutationObserverOptions,
    QueryObserverOptions,
} from '@tanstack/query-core'
import { harmonyApi, FINAL_STATUSES } from '../apis/harmony.api.js'
import type { SearchOptions, SubsetJobStatus } from '../data-services/types.js'
import type { HarmonyRequest } from '../lib/harmony/harmony.request.js'
import type { RequestOptions } from '../lib/api.client.js'

const POLL_INTERVAL_MS = 3000

function isFetchableHarmonyJobId(jobID?: string | null): jobID is string {
    return Boolean(jobID && jobID !== 'new')
}

export function queryHarmonyCapabilities(
    collectionConceptId?: string,
    options?: RequestOptions,
): QueryObserverOptions<Awaited<
    ReturnType<typeof harmonyApi.getCollectionCapabilities>
> | null> {
    return {
        queryKey: ['harmony', 'capabilities', collectionConceptId],
        queryFn: async ({ signal }) => {
            return harmonyApi.getCollectionCapabilities(collectionConceptId, {
                ...options,
                signal,
            })
        },
        enabled: !!collectionConceptId,
    }
}

/**
 * Query options factory for polling the status of a Harmony subset job.
 * Automatically stops polling once the job reaches a final state.
 *
 * @example
 * const queryController = new QueryController(
 *   host,
 *   () => queryHarmonyJobStatus(this.currentJob?.jobID, { bearerToken })
 * )
 */
export function queryHarmonyJobStatus(
    jobID?: string | null,
    options?: SearchOptions,
): QueryObserverOptions<SubsetJobStatus | null> {
    return {
        queryKey: ['harmony', 'jobs', jobID],
        queryFn: async ({ signal }) => {
            if (!isFetchableHarmonyJobId(jobID)) return null
            return harmonyApi.getJobStatus(jobID, { ...options, signal })
        },
        enabled: isFetchableHarmonyJobId(jobID),
        // Poll until the job reaches a final state
        refetchInterval: (query) => {
            const status = query.state.data?.status

            if (status && FINAL_STATUSES.has(status)) {
                return false
            }
            return POLL_INTERVAL_MS
        },
        // Job status changes frequently while running; don't use stale data
        staleTime: 0,
        gcTime: 0,
    }
}

/**
 * Mutation options for creating a Harmony subset job via REST API.
 * Intended for use with MutationController.
 *
 * @example
 * const mutation = new MutationController(host, queryCreateHarmonySubsetJob())
 * // later:
 * const job = await mutation.mutate({ harmonyRequest, options: { bearerToken } })
 */
export type CreateHarmonyJobVariables = {
    harmonyRequest: HarmonyRequest
    options?: SearchOptions
}

export function queryCreateHarmonySubsetJob(): MutationObserverOptions<
    SubsetJobStatus,
    Error,
    CreateHarmonyJobVariables
> {
    return {
        mutationFn: ({ harmonyRequest, options }) =>
            harmonyApi.createJob(harmonyRequest, options),
    }
}

export type CancelHarmonyJobVariables = {
    jobId: string
    options?: SearchOptions
}

export function queryCancelHarmonySubsetJob(): MutationObserverOptions<
    SubsetJobStatus,
    Error,
    CancelHarmonyJobVariables
> {
    return {
        mutationFn: ({ jobId, options }) =>
            harmonyApi.cancelJob(jobId, options),
    }
}
