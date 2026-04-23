import type {
    MutationObserverOptions,
    QueryObserverOptions,
} from '@tanstack/query-core'
import { harmonyApi } from '../apis/harmony.api.js'
import type { HarmonyRequest } from '../lib/harmony/harmony.request.js'
import type { SubsetJobStatus, SearchOptions } from '../data-services/types.js'
import { FINAL_STATUSES } from '../data-services/harmony-data-service.js'

const POLL_INTERVAL_MS = 3000

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
    jobID: string | undefined,
    options?: SearchOptions,
): QueryObserverOptions<SubsetJobStatus | null> {
    return {
        queryKey: ['harmony', 'jobs', jobID],
        queryFn: async ({ signal }) => {
            return harmonyApi.getJobStatus(jobID!, { ...options, signal })
        },
        enabled: !!jobID,
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
 * const mutation = new MutationController(host, mutateHarmonySubsetJob())
 * // later:
 * const job = await mutation.mutate({ harmonyRequest, options: { bearerToken } })
 */
export type CreateHarmonyJobVariables = {
    harmonyRequest: HarmonyRequest
    options?: SearchOptions
}

export function mutateHarmonySubsetJob(): MutationObserverOptions<
    SubsetJobStatus,
    Error,
    CreateHarmonyJobVariables
> {
    return {
        mutationFn: ({ harmonyRequest, options }) =>
            harmonyApi.createJob(harmonyRequest, options),
    }
}
