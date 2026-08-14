import * as React from 'react'
import type { QueryClient } from '@tanstack/query-core'
import { MutationObserver } from '@tanstack/query-core'
import type { SubsetJobStatus } from '../../apis/harmony.api.js'
import { sharedQueryClient } from '../../mixins/query-client.mixin.js'
import {
    queryCreateHarmonySubsetJob,
    type CreateHarmonyJobVariables,
} from '../../queries/harmony.queries.js'

export interface UseCreateHarmonyJobOptions {
    queryClient?: QueryClient
    onSuccess?: (data: SubsetJobStatus) => void
    onError?: (error: Error) => void
}

export interface UseCreateHarmonyJobResult {
    mutate: (variables: CreateHarmonyJobVariables) => Promise<SubsetJobStatus>
    mutateAsync: (
        variables: CreateHarmonyJobVariables,
    ) => Promise<SubsetJobStatus>
    data: SubsetJobStatus | undefined
    error: Error | null
    isPending: boolean
    isSuccess: boolean
    isError: boolean
    status: 'idle' | 'pending' | 'success' | 'error'
    reset: () => void
}

export function useCreateHarmonyJob(
    options?: UseCreateHarmonyJobOptions,
): UseCreateHarmonyJobResult {
    const client = options?.queryClient ?? sharedQueryClient

    const observerRef = React.useRef<
        MutationObserver<SubsetJobStatus, Error, CreateHarmonyJobVariables> | null
    >(null)

    if (!observerRef.current) {
        observerRef.current = new MutationObserver(
            client,
            queryCreateHarmonySubsetJob(),
        )
    }

    const [state, setState] = React.useState(() =>
        observerRef.current!.getCurrentResult(),
    )

    const callbacksRef = React.useRef(options)
    callbacksRef.current = options

    React.useEffect(() => {
        const observer = observerRef.current!
        const unsubscribe = observer.subscribe((result) => {
            setState(result)
            if (result.isSuccess && result.data) {
                callbacksRef.current?.onSuccess?.(result.data)
            } else if (result.isError && result.error) {
                callbacksRef.current?.onError?.(result.error)
            }
        })
        return () => unsubscribe()
    }, [])

    const mutate = React.useCallback(
        async (variables: CreateHarmonyJobVariables): Promise<SubsetJobStatus> => {
            return observerRef.current!.mutate(variables)
        },
        [],
    )

    const reset = React.useCallback(() => {
        observerRef.current!.reset()
        setState(observerRef.current!.getCurrentResult())
    }, [])

    return {
        mutate,
        mutateAsync: mutate,
        data: state.data,
        error: state.error,
        isPending: state.isPending,
        isSuccess: state.isSuccess,
        isError: state.isError,
        status: state.status,
        reset,
    }
}
