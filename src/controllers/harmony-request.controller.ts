import type { ReactiveController, ReactiveControllerHost } from 'lit'
import { Status, type SubsetJobStatus } from '../data-services/types.js'
import type { SearchOptions } from '../metadata-catalog/types.js'
import type { QueryClientHost } from '../mixins/query-client.mixin.js'
import {
    queryCancelHarmonySubsetJob,
    queryCreateHarmonySubsetJob,
    queryHarmonyJobStatus,
    type CancelHarmonyJobVariables,
    type CreateHarmonyJobVariables,
} from '../queries/harmony.queries.js'
import { MutationController } from './mutation.controller.js'
import { QueryController } from './query.controller.js'

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
    }

    async startJob(variables: CreateHarmonyJobVariables) {
        this.#options = variables.options

        this.#jobId = 'new'

        try {
            const result = await this.#createJob.mutate(variables)

            this.#jobId = result.jobID
        } catch (error) {
            this.#jobId = null
            // TODO: where to handle error?
            throw error
        }

        this.host.requestUpdate()

        return this.#jobId
    }

    async cancelJob(options: CancelHarmonyJobVariables) {
        return this.#cancelJob.mutate(options)
    }

    startPollForJobStatus(jobId: string) {
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
