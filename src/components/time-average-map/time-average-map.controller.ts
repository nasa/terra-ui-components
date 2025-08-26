import { Task } from '@lit/task'
import type { StatusRenderer } from '@lit/task'
import type { ReactiveControllerHost } from 'lit'
import { format } from 'date-fns'
import { type SubsetJobStatus, Status } from '../../data-services/types.js'
import {
    FINAL_STATUSES,
    HarmonyDataService,
} from '../../data-services/harmony-data-service.js'
import type TerraTimeAvgMap from './time-average-map.component.js'
import {
    IndexedDbStores,
    getDataByKey,
    storeDataByKey,
} from '../../internal/indexeddb.js'
import { formatDate } from '../../utilities/date.js'

const REFRESH_HARMONY_DATA_INTERVAL = 2000

export class TimeAvgMapController {
    jobStatusTask: any
    currentJob: SubsetJobStatus | null

    #host: ReactiveControllerHost & TerraTimeAvgMap
    #dataService: HarmonyDataService
    blobUrl: Blob

    constructor(host: ReactiveControllerHost & TerraTimeAvgMap) {
        this.#host = host
        this.#dataService = this.#getDataService()

        this.jobStatusTask = new Task(host, {
            task: async ([], { signal }) => {
                let job

                const start_date = new Date(this.#host?.startDate ?? Date.now())
                const end_date = new Date(this.#host?.endDate ?? Date.now())
                const [w, s, e, n] = this.#host.location?.split(',') ?? []

                const parts = this.#host.collection!.split('_')
                const collectionEntryId = parts[0] + '_' + parts.slice(1).join('.')

                let subsetOptions = {
                    collectionEntryId: `${collectionEntryId}`,
                    variableConceptIds: ['parameter_vars'],
                    variableEntryIds: [
                        `${this.#host.collection!}_${this.#host.variable}`,
                    ],
                    startDate: format(start_date, 'yyyy-MM-dd') + 'T00%3A00%3A00',
                    endDate: format(end_date, 'yyyy-MM-dd') + 'T00%3A00%3A00',
                    format: 'text/csv',
                    boundingBox: {
                        w: parseFloat(w),
                        s: parseFloat(s),
                        e: parseFloat(e),
                        n: parseFloat(n),
                    },
                    average: 'time',
                }
                console.log(`Creating a job with options`, subsetOptions)

                // we'll start with an empty job to clear out any existing job
                this.currentJob = this.#getEmptyJob()

                try {
                    // Try cache first
                    const cacheKey = this.getCacheKey()
                    const existing = await getDataByKey<{
                        key: string
                        cachedAt: number
                        environment?: string
                        blob: Blob
                    }>(IndexedDbStores.TIME_AVERAGE_MAP, cacheKey)

                    if (existing) {
                        console.log(
                            'Returning existing map blob from cache',
                            cacheKey
                        )
                        this.blobUrl = existing.blob
                        return existing.blob
                    }

                    console.log('Calling create subset job..')
                    job = await this.#dataService.createSubsetJob(subsetOptions, {
                        signal,
                        bearerToken: this.#host.bearerToken,
                        environment: this.#host.environment,
                    })

                    if (!job) {
                        throw new Error('Failed to create subset job')
                    }

                    console.log('Waiting for harmony job..')
                    const jobStatus = await this.#waitForHarmonyJob(job, signal)

                    // the job is completed, fetch the data for the job
                    const { blob } = await this.#dataService.getSubsetJobData(
                        jobStatus,
                        {
                            signal,
                            bearerToken: this.#host.bearerToken,
                            environment: this.#host.environment,
                        }
                    )
                    this.blobUrl = blob

                    this.#host.emit('terra-time-average-map-data-change', {
                        detail: {
                            data: blob,
                            variable: this.#host.catalogVariable!,
                            startDate: formatDate(this.#host.startDate!),
                            endDate: formatDate(this.#host.endDate!),
                            location: this.#host.location!,
                        },
                    })

                    // Store in cache
                    await storeDataByKey(IndexedDbStores.TIME_AVERAGE_MAP, cacheKey, {
                        key: cacheKey,
                        cachedAt: new Date().getTime(),
                        environment: this.#host.environment,
                        blob,
                    })

                    return blob
                } catch (err) {
                    const error_msg = `Failed to create subset job: ${err}`
                    console.error(error_msg)
                    throw new Error(error_msg)
                }
            },
            args: (): any => [],
            autoRun: false,
        })
    }

    render(renderFunctions: StatusRenderer<any>) {
        return this.jobStatusTask.render(renderFunctions)
    }

    fetchJobByID(jobID: string) {
        this.currentJob = {
            jobID,
            status: Status.FETCHING,
            message: 'Your job is being retrieved.',
            progress: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            dataExpiration: '',
            request: '',
            numInputGranules: 0,
            links: [],
        }

        // run the job status task to get the job details
        this.jobStatusTask.run()
    }

    #waitForHarmonyJob(job: SubsetJobStatus, signal: AbortSignal) {
        return new Promise<SubsetJobStatus>(async resolve => {
            let jobStatus: SubsetJobStatus | undefined

            try {
                jobStatus = await this.#dataService.getSubsetJobStatus(job.jobID, {
                    signal,
                    bearerToken: this.#host.bearerToken,
                    environment: this.#host.environment,
                })
                console.log('Job status', jobStatus)
            } catch (error) {
                console.error('Error checking harmony job status', error)
            }

            if (jobStatus && FINAL_STATUSES.has(jobStatus.status)) {
                console.log('Job is done', jobStatus)
                resolve(jobStatus)
            } else {
                setTimeout(async () => {
                    resolve(await this.#waitForHarmonyJob(job, signal))
                }, REFRESH_HARMONY_DATA_INTERVAL)
            }
        })
    }

    #getDataService() {
        return new HarmonyDataService()
    }

    #getEmptyJob() {
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

    getCacheKey(): string {
        const environment = this.#host.environment ?? 'prod'
        const location = this.#host.location ?? ''
        const collection = this.#host.collection ?? ''
        const variable = this.#host.variable ?? ''
        const start = this.#host.startDate ?? ''
        const end = this.#host.endDate ?? ''
        return `map_${collection}_${variable}_${start}_${end}_${location}_${environment}`
    }
}
