import type { ReactiveController, ReactiveControllerHost } from 'lit'
import {
    harmonyApi,
    IN_FLIGHT_STATUSES,
    Status,
    type SubsetJobStatus,
} from '../apis/harmony.api.js'
import type { SearchOptions } from '../apis/harmony.api.js'
import { HarmonyRequest } from '../lib/harmony/harmony.request.js'
import type { QueryClientHost } from '../mixins/query-client.mixin.js'
import {
    queryCancelHarmonySubsetJob,
    queryCreateHarmonySubsetJob,
    queryHarmonyJobStatus,
    queryResumeHarmonySubsetJob,
    type CancelHarmonyJobVariables,
    type CreateHarmonyJobVariables,
    type ResumeHarmonyJobVariables,
} from '../queries/harmony.queries.js'
import { MutationController } from './mutation.controller.js'
import { QueryController } from './query.controller.js'

// How many of the user's most recent jobs to search when looking for an existing job to
// reuse before creating a new one.
const DEDUPE_SEARCH_LIMIT = 50

/**
 * Whether a job in this status is eligible to be reused for a dedup match: jobs still
 * working toward a result are always reusable, and completed jobs are reusable only while
 * their output is still downloadable.
 */
function isReusableJobStatus(job: SubsetJobStatus): boolean {
    if (IN_FLIGHT_STATUSES.has(job.status)) return true

    if (
        job.status === Status.SUCCESSFUL ||
        job.status === Status.COMPLETE_WITH_ERRORS
    ) {
        return new Date(job.dataExpiration).getTime() > Date.now()
    }

    return false
}

/**
 * Parses a job's `request` URL back into a HarmonyRequest for comparison, tolerating
 * malformed/legacy URLs that can't be parsed (treated as simply not matching, rather than
 * failing the whole dedup lookup over one bad record).
 */
function safeParseRequest(request: string): HarmonyRequest | null {
    try {
        return HarmonyRequest.fromUrl(request)
    } catch {
        return null
    }
}

export class HarmonyRequestController implements ReactiveController {
    #jobId: string | null = null
    #options?: SearchOptions

    hostConnected() {
        // no-op, required to satisfy ReactiveController interface
    }

    #createJob: MutationController<
        SubsetJobStatus,
        Error,
        CreateHarmonyJobVariables
    >

    #jobStatus: QueryController<SubsetJobStatus | null>

    #cancelJob: MutationController<
        SubsetJobStatus,
        Error,
        CancelHarmonyJobVariables
    >

    #resumeJob: MutationController<
        SubsetJobStatus,
        Error,
        ResumeHarmonyJobVariables
    >

    constructor(private host: ReactiveControllerHost & QueryClientHost) {
        host.addController(this)

        this.#createJob = new MutationController(
            host,
            queryCreateHarmonySubsetJob(),
        )

        this.#jobStatus = new QueryController(host, () =>
            queryHarmonyJobStatus(this.#jobId, this.#options),
        )

        this.#cancelJob = new MutationController(
            host,
            queryCancelHarmonySubsetJob(),
        )

        this.#resumeJob = new MutationController(
            host,
            queryResumeHarmonySubsetJob(),
        )
    }

    async startJob(variables: CreateHarmonyJobVariables) {
        this.#options = variables.options

        this.#jobId = 'new'

        try {
            const existingJob = await this.#findReusableJob(variables)

            if (existingJob) {
                this.#jobId = existingJob.jobID
                return existingJob
            }

            const result = await this.#createJob.mutate(variables)

            this.#jobId = result.jobID

            return result
        } catch (error) {
            this.#jobId = null
            // TODO: where to handle error?
            throw error
        } finally {
            this.host.requestUpdate()
        }
    }

    /**
     * Looks for an existing job of the user's that's equivalent to the one we're about to
     * create, so we can reuse it instead. (de-dupe)
     *
     * Skipped entirely for anonymous requests (no bearer token) — there's no durable
     * per-user job list to search through the anonymous proxy.
     */
    async #findReusableJob(
        variables: CreateHarmonyJobVariables,
    ): Promise<SubsetJobStatus | null> {
        if (!variables.options?.bearerToken) return null

        try {
            const { jobs } = await harmonyApi.getJobs(
                { limit: DEDUPE_SEARCH_LIMIT },
                variables.options,
            )

            const candidates = jobs
                .filter(isReusableJobStatus)
                .map((job) => ({
                    job,
                    parsedRequest: safeParseRequest(job.request),
                }))
                .filter(
                    (
                        candidate,
                    ): candidate is {
                        job: SubsetJobStatus
                        parsedRequest: HarmonyRequest
                    } =>
                        candidate.parsedRequest !== null &&
                        candidate.parsedRequest.isEquivalentTo(
                            variables.harmonyRequest,
                        ),
                )
                .sort(
                    (a, b) =>
                        new Date(b.job.createdAt).getTime() -
                        new Date(a.job.createdAt).getTime(),
                )

            return candidates[0]?.job ?? null
        } catch (error) {
            console.warn(
                'Failed to look up existing Harmony jobs for dedup, falling back to creating a new job',
                error,
            )
            return null
        }
    }

    async cancelJob(options: CancelHarmonyJobVariables) {
        return this.#cancelJob.mutate(options)
    }

    async resumeJob(options: ResumeHarmonyJobVariables) {
        return this.#resumeJob.mutate(options)
    }

    startPollForJobStatus(jobId: string, options?: SearchOptions) {
        this.#options = options
        this.#jobId = jobId
    }

    reset() {
        this.#jobId = null
        this.#options = undefined
        this.host.requestUpdate()
    }

    get jobId() {
        return this.#jobId
    }

    get data() {
        if (this.#jobId === 'new') {
            return this.#getEmptyJob()
        }

        return this.#jobStatus.result?.data ?? null
    }

    get progress() {
        return this.data?.progress ?? 0
    }

    get status() {
        if (this.#jobId === 'new') {
            return Status.RUNNING
        }

        return this.#jobStatus.result?.data?.status
    }

    get isCreating() {
        if (this.#jobId === 'new') {
            return true
        }

        return this.#createJob.result?.isPending ?? false
    }

    get isPolling() {
        return this.#jobStatus.result?.fetchStatus === 'fetching'
    }

    #getEmptyJob(): SubsetJobStatus {
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
}
