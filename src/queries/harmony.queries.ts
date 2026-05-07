import type {
    MutationObserverOptions,
    QueryObserverOptions,
} from '@tanstack/query-core'
import { harmonyApi, FINAL_STATUSES } from '../apis/harmony.api.js'
import type { SearchOptions, SubsetJobStatus } from '../data-services/types.js'
import type { HarmonyRequest } from '../lib/harmony/harmony.request.js'
import type { RequestOptions } from '../lib/api.client.js'
import { ThumbnailService } from '../lib/thumbnails/thumbnail.service.js'

const POLL_INTERVAL_MS = 3000
const PAGE_1_POLL_INTERVAL_MS = 5000

const thumbnailService = new ThumbnailService()

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
 * Query options factory for getting a user's Harmony jobs
 * If page 1 (or no page) is specific, and there are jobs that are not in a final state,
 * the query will refetch the first page of jobs every POLL_INTERVAL_MS milliseconds.
 *
 * @example
 * const queryController = new QueryController(
 *   host,
 *   () => queryHarmonyJobs({ page: 1, limit: 10, label: 'cloud-giovanni-ui' }, { bearerToken })
 * )
 */
export function queryHarmonyJobs(
    params?: Parameters<typeof harmonyApi.getJobs>[0],
    options?: Parameters<typeof harmonyApi.getJobs>[1],
): QueryObserverOptions<Awaited<ReturnType<typeof harmonyApi.getJobs>>> {
    return {
        queryKey: ['harmony', 'jobs', params],
        queryFn: async ({ signal }) => {
            const result = await harmonyApi.getJobs(params, {
                ...options,
                signal,
            })
            const enrichedJobs = await Promise.all(
                result.jobs.map(async (job) => {
                    const blob = await thumbnailService.get(job.jobID)
                    return blob ? { ...job, thumbnailBlob: blob } : job
                }),
            )
            return { ...result, jobs: enrichedJobs }
        },
        // require a bearer token to run
        enabled: !!options?.bearerToken,
        refetchInterval: () => {
            if (params?.page && params.page !== 1) {
                // don't poll for changes on any page other than page 1
                return false
            }
            // Always poll page 1 every 5 seconds so thumbnails and new jobs appear automatically
            return PAGE_1_POLL_INTERVAL_MS
        },
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

/**
 * Mutation options for removing labels from one or more Harmony jobs.
 * Used when `removeLabelsOnDelete` is set on terra-harmony-history — after removal
 * the jobs will no longer match the active label filter and disappear from the list.
 *
 * @example
 * const mutation = new MutationController(host, mutationRemoveHarmonyJobLabels())
 * // later:
 * await mutation.mutate({ jobIDs: ['abc'], labels: ['my-label'], options: { bearerToken } })
 */
export type RemoveHarmonyJobLabelsVariables = {
    jobIDs: string[]
    labels: string[]
    options?: SearchOptions
}

export function mutationRemoveHarmonyJobLabels(): MutationObserverOptions<
    void,
    Error,
    RemoveHarmonyJobLabelsVariables
> {
    return {
        mutationFn: ({ jobIDs, labels, options }) =>
            harmonyApi.removeJobLabels({ jobIDs, labels }, options),
    }
}
