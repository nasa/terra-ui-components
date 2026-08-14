import * as React from 'react'
import type { QueryClient } from '@tanstack/query-core'
import { MutationObserver, QueryObserver } from '@tanstack/query-core'
import type { SearchOptions, SubsetJobStatus } from '../../apis/harmony.api.js'
import { sharedQueryClient } from '../../mixins/query-client.mixin.js'
import {
    queryCancelHarmonySubsetJob,
    queryHarmonyJobStatus,
    type CancelHarmonyJobVariables,
} from '../../queries/harmony.queries.js'

export interface UsePollHarmonyJobStatusOptions {
    enabled?: boolean
    queryClient?: QueryClient
    onSuccess?: (data: SubsetJobStatus | null) => void
    onError?: (error: Error) => void
}

export interface UsePollHarmonyJobStatusResult {
    data: SubsetJobStatus | null
    error: Error | null
    status: SubsetJobStatus['status'] | undefined
    progress: number
    isPolling: boolean
    isLoading: boolean
    isSuccess: boolean
    isError: boolean
    cancelJob: (options?: SearchOptions) => Promise<SubsetJobStatus>
    refetch: () => Promise<void>
}

export function usePollHarmonyJobStatus(
    jobId?: string | null,
    searchOptions?: SearchOptions,
    options?: UsePollHarmonyJobStatusOptions,
): UsePollHarmonyJobStatusResult {
    const client = options?.queryClient ?? sharedQueryClient
    const enabled = options?.enabled ?? true

    const queryOptions = queryHarmonyJobStatus(jobId, searchOptions)
    if (!enabled) {
        queryOptions.enabled = false
    }

    const observerRef = React.useRef<
        QueryObserver<SubsetJobStatus | null, Error> | null
    >(null)

    if (!observerRef.current) {
        const defaulted = client.defaultQueryOptions(queryOptions)
        observerRef.current = new QueryObserver(client, defaulted)
    }

    const [state, setState] = React.useState(() =>
        observerRef.current!.getCurrentResult(),
    )

    const callbacksRef = React.useRef(options)
    callbacksRef.current = options

    React.useEffect(() => {
        const observer = observerRef.current!
        const defaulted = client.defaultQueryOptions(queryOptions)
        observer.setOptions(defaulted)

        const unsubscribe = observer.subscribe((result) => {
            setState(result)
            if (result.isSuccess) {
                callbacksRef.current?.onSuccess?.(result.data)
            } else if (result.isError && result.error) {
                callbacksRef.current?.onError?.(result.error)
            }
        })

        return () => unsubscribe()
    }, [client, jobId, searchOptions?.bearerToken, enabled])

    const cancelMutationRef = React.useRef<
        MutationObserver<SubsetJobStatus, Error, CancelHarmonyJobVariables> | null
    >(null)

    if (!cancelMutationRef.current) {
        cancelMutationRef.current = new MutationObserver(
            client,
            queryCancelHarmonySubsetJob(),
        )
    }

    const cancelJob = React.useCallback(
        async (overrideOptions?: SearchOptions): Promise<SubsetJobStatus> => {
            if (!jobId) {
                throw new Error('Cannot cancel job: no jobId provided')
            }
            const opts = overrideOptions ?? searchOptions
            return cancelMutationRef.current!.mutate({
                jobId,
                options: opts,
            })
        },
        [jobId, searchOptions],
    )

    const refetch = React.useCallback(async () => {
        await observerRef.current?.refetch()
    }, [])

    const data = state.data ?? null
    const progress = data?.progress ?? 0
    const isPolling = state.fetchStatus === 'fetching'

    return {
        data,
        error: state.error,
        status: data?.status,
        progress,
        isPolling,
        isLoading: state.isLoading,
        isSuccess: state.isSuccess,
        isError: state.isError,
        cancelJob,
        refetch,
    }
}
