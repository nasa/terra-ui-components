import { Task } from '@lit/task'
import type { StatusRenderer } from '@lit/task'
import type { ReactiveControllerHost } from 'lit'
import { format } from 'date-fns'
import {
    type SubsetJobStatus,
    type SubsetJobError,
    Status,
} from '../../data-services/types.js'
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
import { extractHarmonyError } from '../../utilities/harmony.js'

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

                const collection = `${this.#host.catalogVariable!.dataProductShortName}_${this.#host.catalogVariable!.dataProductVersion}`

                let subsetOptions = {
                    collectionEntryId: `${collection}`,
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
                this.#host.harmonyJobId = undefined

                try {
                    // Try cache first
                    const cacheKey = this.getCacheKey()
                    const existing = await getDataByKey<{
                        key: string
                        cachedAt: number
                        environment?: string
                        blob: Blob
                        harmonyJobId?: string
                    }>(IndexedDbStores.TIME_AVERAGE_MAP, cacheKey)

                    if (existing) {
                        console.log(
                            'Returning existing map blob from cache',
                            cacheKey
                        )

                        this.#host.harmonyJobId = existing.harmonyJobId
                        this.#updateGeoTIFFLayer(existing.blob)

                        return existing.blob
                    }

                    console.log('Calling create subset job..')
                    try {
                        job = await this.#dataService.createSubsetJob(subsetOptions, {
                            signal,
                            bearerToken: this.#host.bearerToken,
                            environment: this.#host.environment,
                        })
                    } catch (error) {
                        // Handle GraphQL errors from Harmony
                        this.#handleHarmonyError(error)
                        throw error
                    }

                    if (!job) {
                        const error = new Error('Failed to create subset job')
                        this.#handleHarmonyError(error)
                        throw error
                    }

                    console.log('Waiting for harmony job..')
                    const jobStatus = await this.#waitForHarmonyJob(job, signal)

                    // Check if job failed or has errors
                    if (jobStatus.status === Status.FAILED) {
                        const errorMessage =
                            jobStatus.message ||
                            jobStatus.errors?.[0]?.message ||
                            'The subset job failed'
                        const error = new Error(errorMessage)
                        this.#handleHarmonyError(error, jobStatus.errors)
                        throw error
                    }

                    if (
                        jobStatus.status === Status.COMPLETE_WITH_ERRORS &&
                        jobStatus.errors &&
                        jobStatus.errors.length > 0
                    ) {
                        const errorMessage =
                            jobStatus.errors[0].message ||
                            'The subset job completed with errors'
                        const error = new Error(errorMessage)
                        this.#handleHarmonyError(error, jobStatus.errors)
                        throw error
                    }

                    // the job is completed, fetch the data for the job
                    let blob: Blob
                    try {
                        const result = await this.#dataService.getSubsetJobData(
                            jobStatus,
                            {
                                signal,
                                bearerToken: this.#host.bearerToken,
                                environment: this.#host.environment,
                            }
                        )
                        blob = result.blob
                    } catch (error) {
                        this.#handleHarmonyError(error)
                        throw error
                    }

                    // Store in cache
                    await storeDataByKey(IndexedDbStores.TIME_AVERAGE_MAP, cacheKey, {
                        key: cacheKey,
                        cachedAt: new Date().getTime(),
                        environment: this.#host.environment,
                        blob,
                        harmonyJobId: jobStatus.jobID,
                    })

                    this.#updateGeoTIFFLayer(blob)

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

    #updateGeoTIFFLayer(blob: Blob) {
        this.blobUrl = blob

        this.#host.emit('terra-time-average-map-data-change', {
            detail: {
                data: blob,
                variable: this.#host.catalogVariable!,
                startDate: formatDate(this.#host.startDate!),
                endDate: formatDate(this.#host.endDate!),
                location: this.#host.location!,
                colorMap: this.#host.colorMapName,
                harmonyJobId: this.#host.harmonyJobId,
            },
        })

        this.#host.updateGeoTIFFLayer(blob)
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
        return new Promise<SubsetJobStatus>(async (resolve, reject) => {
            if (signal.aborted) {
                reject(new Error('Job polling was aborted'))
                return
            }

            let jobStatus: SubsetJobStatus | undefined

            try {
                jobStatus = await this.#dataService.getSubsetJobStatus(job.jobID, {
                    signal,
                    bearerToken: this.#host.bearerToken,
                    environment: this.#host.environment,
                })
                console.log('Job status', jobStatus)

                this.#host.harmonyJobId = jobStatus.jobID
            } catch (error) {
                console.error('Error checking harmony job status', error)

                // If aborted, reject the promise to stop polling (don't show error)
                if (signal.aborted || (error as Error)?.name === 'AbortError') {
                    reject(error)
                    return
                }

                // Handle GraphQL errors from status check
                this.#handleHarmonyError(error)
                reject(error)
                return
            }

            if (jobStatus && FINAL_STATUSES.has(jobStatus.status)) {
                console.log('Job is done', jobStatus)
                resolve(jobStatus)
            } else {
                if (signal.aborted) {
                    reject(new Error('Job polling was aborted'))
                    return
                }

                // Set up abort listener to immediately reject if aborted during the wait
                const abortHandler = () => {
                    reject(new Error('Job polling was aborted'))
                }
                signal.addEventListener('abort', abortHandler, { once: true })

                setTimeout(async () => {
                    // Remove the abort listener since we're about to check again
                    signal.removeEventListener('abort', abortHandler)

                    // Check if aborted immediately when timeout fires
                    if (signal.aborted) {
                        reject(new Error('Job polling was aborted'))
                        return
                    }

                    try {
                        resolve(await this.#waitForHarmonyJob(job, signal))
                    } catch (error) {
                        reject(error)
                    }
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

    /**
     * Handles errors from Harmony GraphQL operations and dispatches them as events
     */
    #handleHarmonyError(error: unknown, jobErrors?: Array<SubsetJobError>): void {
        const errorDetails = extractHarmonyError(error, jobErrors)

        // Dispatch the error event
        this.#host.dispatchEvent(
            new CustomEvent('terra-time-average-map-error', {
                detail: errorDetails,
                bubbles: true,
                composed: true,
            })
        )
    }
}
