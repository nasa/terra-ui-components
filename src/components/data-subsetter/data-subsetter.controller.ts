import { Task } from '@lit/task'
import type { StatusRenderer } from '@lit/task'
import type { ReactiveControllerHost } from 'lit'
import type TerraDataSubsetter from './data-subsetter.component.js'
import { type SubsetJobStatus, Status } from '../../data-services/types.js'
import {
    FINAL_STATUSES,
    HarmonyDataService,
} from '../../data-services/harmony-data-service.js'

const JOB_STATUS_POLL_MILLIS = 3000

export class DataSubsetterController {
    jobStatusTask: Task<[], SubsetJobStatus | undefined>
    currentJob: SubsetJobStatus

    #host: ReactiveControllerHost & TerraDataSubsetter
    #dataService: HarmonyDataService

    constructor(host: ReactiveControllerHost & TerraDataSubsetter) {
        this.#host = host
        this.#dataService = this.#getDataService()

        this.jobStatusTask = new Task(host, {
            task: async ([], { signal }) => {
                let job

                if (this.currentJob?.jobID) {
                    // we already have a job, get it's status
                    job = await this.#dataService.getSubsetJobStatus(
                        this.currentJob.jobID,
                        { signal }
                    )
                } else {
                    const subsetOptions = {
                        variableConceptId: this.#host.variableConceptId,
                    }

                    console.log(
                        `Creating a job for collection, ${this.#host.collectionConceptId}, with subset options`,
                        subsetOptions
                    )

                    // we don't have a job, create one
                    job = await this.#dataService.createSubsetJob(
                        this.#host.collectionConceptId,
                        {
                            ...subsetOptions,
                            signal,
                        }
                    )
                }

                console.log('Job status: ', job)

                if (job) {
                    this.currentJob = job
                }

                if (!FINAL_STATUSES.has(this.currentJob.status)) {
                    // if the job status isn't done yet, we will trigger the task again after a bit
                    setTimeout(() => {
                        this.jobStatusTask.run()
                    }, JOB_STATUS_POLL_MILLIS)
                }

                return job
            },
            args: (): any => [],
            autoRun: false, // this task won't automatically be triggered, the component has to trigger it manually
        })
    }

    render(renderFunctions: StatusRenderer<any>) {
        return this.jobStatusTask.render(renderFunctions)
    }

    #getDataService() {
        return new HarmonyDataService()
    }

    public startJobPlaceholder() {
        this.currentJob = {
            jobID: '',
            status: Status.RUNNING,
            message: 'Starting request... Please wait.',
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
