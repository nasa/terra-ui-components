import * as React from 'react'
import type { QueryClient } from '@tanstack/query-core'
import { Status, type SearchOptions, type SubsetJobStatus } from '../../apis/harmony.api.js'
import type {
    CancelHarmonyJobVariables,
    CreateHarmonyJobVariables,
} from '../../queries/harmony.queries.js'
import { useCreateHarmonyJob } from './use-create-harmony-job.js'
import { usePollHarmonyJobStatus } from './use-poll-harmony-job-status.js'

export interface UseHarmonyRequestOptions {
    queryClient?: QueryClient
    onSuccess?: (data: SubsetJobStatus) => void
    onError?: (error: Error) => void
}

export interface UseHarmonyRequestResult {
    startJob: (variables: CreateHarmonyJobVariables) => Promise<SubsetJobStatus>
    cancelJob: (options?: CancelHarmonyJobVariables) => Promise<SubsetJobStatus>
    startPollForJobStatus: (jobId: string, options?: SearchOptions) => void
    reset: () => void
    jobId: string | null
    data: SubsetJobStatus | null
    status: SubsetJobStatus['status'] | undefined
    progress: number
    isCreating: boolean
    isPolling: boolean
    error: Error | null
}

function getEmptyJob(): SubsetJobStatus {
    return {
        jobID: '',
        status: Status.RUNNING,
        message: 'Your job is being created and will start soon.',
        progress: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        dataExpiration: '',
        request: '',
        numInputGranules: 0,
        links: [],
    }
}

export function useHarmonyRequest(
    options?: UseHarmonyRequestOptions,
): UseHarmonyRequestResult {
    const [jobId, setJobId] = React.useState<string | null>(null)
    const [searchOptions, setSearchOptions] = React.useState<SearchOptions | undefined>(undefined)

    const createJobMutation = useCreateHarmonyJob({
        queryClient: options?.queryClient,
        onSuccess: (job) => {
            setJobId(job.jobID)
            options?.onSuccess?.(job)
        },
        onError: (err) => {
            setJobId(null)
            options?.onError?.(err)
        },
    })

    const statusPolling = usePollHarmonyJobStatus(jobId, searchOptions, {
        queryClient: options?.queryClient,
        onError: options?.onError,
    })

    const startJob = React.useCallback(
        async (variables: CreateHarmonyJobVariables): Promise<SubsetJobStatus> => {
            setSearchOptions(variables.options)
            setJobId('new')
            try {
                const result = await createJobMutation.mutate(variables)
                setJobId(result.jobID)
                return result
            } catch (err) {
                setJobId(null)
                throw err
            }
        },
        [createJobMutation],
    )

    const cancelJob = React.useCallback(
        async (cancelVars?: CancelHarmonyJobVariables): Promise<SubsetJobStatus> => {
            const targetJobId = cancelVars?.jobId ?? jobId
            if (!targetJobId || targetJobId === 'new') {
                throw new Error('Cannot cancel job: invalid or missing jobId')
            }
            const opts = cancelVars?.options ?? searchOptions
            return statusPolling.cancelJob(opts)
        },
        [jobId, searchOptions, statusPolling],
    )

    const startPollForJobStatus = React.useCallback(
        (id: string, opts?: SearchOptions) => {
            setSearchOptions(opts)
            setJobId(id)
        },
        [],
    )

    const reset = React.useCallback(() => {
        setJobId(null)
        setSearchOptions(undefined)
        createJobMutation.reset()
    }, [createJobMutation])

    let data: SubsetJobStatus | null = null
    let status: SubsetJobStatus['status'] | undefined = undefined

    if (jobId === 'new') {
        data = getEmptyJob()
        status = Status.RUNNING
    } else {
        data = statusPolling.data
        status = data?.status
    }

    const isCreating = jobId === 'new' || createJobMutation.isPending
    const progress = data?.progress ?? 0
    const error = createJobMutation.error ?? statusPolling.error

    return {
        startJob,
        cancelJob,
        startPollForJobStatus,
        reset,
        jobId,
        data,
        status,
        progress,
        isCreating,
        isPolling: statusPolling.isPolling,
        error,
    }
}
