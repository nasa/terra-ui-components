import { Task } from '@lit/task'
import type { StatusRenderer } from '@lit/task'
import type { ReactiveControllerHost } from 'lit'
import { format } from 'date-fns'
import {
    type SubsetJobStatus,
    type SubsetJobError,
    Status,
} from '../../data-services/types.js'
import { FINAL_STATUSES } from '../../apis/harmony.api.js'
import type TerraTimeAvgMap from './time-average-map.component.js'
import { formatDate } from '../../utilities/date.js'
import { extractHarmonyError } from '../../utilities/harmony.js'
import { CollectionController } from '../../controllers/collection.controller.js'
import { HarmonyRequestController } from '../../controllers/harmony-request.controller.js'
import { HarmonyRequest } from '../../lib/harmony/harmony.request.js'
import { LatLngBounds } from '../map/models/LatLngBounds.js'
import type { QueryClientHost } from '../../mixins/query-client.mixin.js'
import TimeAvgMapCacheService from './time-average-map-cache.service.js'

const HARMONY_LINK_PROXY_URL =
    'https://lpo4uv7f0h.execute-api.us-east-1.amazonaws.com/default/harmony-link-proxy'
const HARMONY_STATUS_WAIT_INTERVAL_MS = 300
const MAX_COLLECTION_CONCEPT_ID_WAIT_MS = 10000

export class TimeAvgMapController {
    jobStatusTask: Task<[], Blob | undefined>

    #host: ReactiveControllerHost & TerraTimeAvgMap & QueryClientHost
    #cacheService = new TimeAvgMapCacheService()
    #collectionController: CollectionController
    #harmonyRequestController: HarmonyRequestController

    blobUrl: Blob | undefined

    constructor(
        host: ReactiveControllerHost & TerraTimeAvgMap & QueryClientHost,
    ) {
        this.#host = host

        this.#collectionController = new CollectionController(this.#host, {
            getCollectionEntryId: () => this.#getCollectionEntryId(),
            getBearerToken: () => this.#host.bearerToken,
        })

        this.#harmonyRequestController = new HarmonyRequestController(
            this.#host,
        )

        this.jobStatusTask = new Task(host, {
            task: async ([], { signal }) => {
                const startDate = this.#host.startDate
                const endDate = this.#host.endDate
                const location = this.#host.location
                const catalogVariable = this.#host.catalogVariable

                if (!startDate || !endDate || !location || !catalogVariable) {
                    return undefined
                }

                // Reset job state
                this.#harmonyRequestController.reset()
                this.#host.harmonyJobId = undefined

                // Try cache first
                const cacheKey = this.getCacheKey()
                {
                    const existing =
                        await this.#cacheService.getValidCacheEntry(cacheKey)

                    if (existing) {
                        console.log(
                            'Returning existing map blob from cache',
                            cacheKey,
                        )
                        this.#host.harmonyJobId = existing.harmonyJobId
                        this.#updateGeoTIFFLayer(existing.blob)
                        return existing.blob
                    }
                }

                // Build the Harmony request
                const collectionConceptId =
                    await this.#waitForCollectionConceptId(signal)

                const [w, s, e, n] = location.split(',').map(Number)
                const locationBounds = new LatLngBounds([w, s, e, n])

                const harmonyRequest = new HarmonyRequest({
                    collectionConceptId,
                    location: locationBounds,
                    environment: this.#host.environment as any,
                })
                    .variable(
                        `${this.#host.collection!}_${this.#host.variable}`,
                    )
                    .dateRange(
                        format(new Date(startDate), "yyyy-MM-dd'T'00:00:00'Z'"),
                        format(new Date(endDate), "yyyy-MM-dd'T'00:00:00'Z'"),
                    )
                    .format('image/tiff')
                    .average('time')
                    .label('terra-time-average-map')

                console.log('Creating time average map job...')

                let jobId: string
                try {
                    const job = await this.#harmonyRequestController.startJob({
                        harmonyRequest,
                        options: {
                            signal,
                            bearerToken: this.#host.bearerToken,
                            environment: this.#host.environment,
                        },
                    })

                    jobId = job.jobID

                    this.#host.emit('terra-harmony-job-status-update', {
                        detail: job,
                    })
                } catch (error) {
                    this.#handleHarmonyError(error)
                    throw error
                }

                console.log('Waiting for harmony job...')
                const jobStatus = await this.#waitForHarmonyJob(jobId, signal)

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

                // Fetch the blob output
                const blob = await this.#fetchJobBlob(jobStatus, signal)

                // Store in cache
                await this.#cacheService.storeEntry(cacheKey, {
                    blob,
                    environment: this.#host.environment,
                    harmonyJobId: jobStatus.jobID,
                })

                this.#updateGeoTIFFLayer(blob)

                return blob
            },
            args: (): [] => [],
            autoRun: false,
        })
    }

    render(renderFunctions: StatusRenderer<Blob | undefined>) {
        return this.jobStatusTask.render(renderFunctions)
    }

    getCacheKey(): string {
        const collection = this.#host.collection ?? ''
        const variable = this.#host.variable ?? ''
        const start = this.#host.startDate ?? ''
        const end = this.#host.endDate ?? ''
        const location = this.#host.location ?? ''
        const environment = this.#host.environment ?? 'prod'
        return this.#cacheService.getCacheKey(
            collection,
            variable,
            start,
            end,
            location,
            environment,
        )
    }

    #getCollectionEntryId(): string | undefined {
        const collection = this.#host.collection
        const variable = this.#host.catalogVariable

        if (!collection || !variable) return undefined

        return `${variable.dataProductShortName}_${variable.dataProductVersion}`
    }

    async #waitForCollectionConceptId(signal: AbortSignal): Promise<string> {
        const deadline = Date.now() + MAX_COLLECTION_CONCEPT_ID_WAIT_MS

        while (true) {
            if (signal.aborted) {
                throw new Error(
                    'Aborted while waiting for collection concept ID',
                )
            }

            const conceptId = this.#collectionController.conceptId
            if (conceptId) {
                return conceptId
            }

            if (Date.now() > deadline) {
                throw new Error('Timed out waiting for collection concept ID')
            }

            await this.#sleep(200, signal)
        }
    }

    async #waitForHarmonyJob(
        jobId: string,
        signal: AbortSignal,
    ): Promise<SubsetJobStatus> {
        this.#harmonyRequestController.startPollForJobStatus(jobId)

        while (true) {
            if (signal.aborted) {
                throw new Error('Job polling was aborted')
            }

            const jobStatus = this.#harmonyRequestController.data

            if (jobStatus) {
                this.#host.emit('terra-harmony-job-status-update', {
                    detail: jobStatus,
                })
            }

            if (
                jobStatus?.jobID === jobId &&
                FINAL_STATUSES.has(jobStatus.status)
            ) {
                return jobStatus
            }

            await this.#sleep(HARMONY_STATUS_WAIT_INTERVAL_MS, signal)
        }
    }

    async #fetchJobBlob(
        jobStatus: SubsetJobStatus,
        signal: AbortSignal,
    ): Promise<Blob> {
        const dataLink = jobStatus.links.find(
            (link) => link.rel === 'data',
        )?.href

        if (!dataLink) {
            throw new Error('No data link found for Harmony job')
        }

        const proxyUrl = `${HARMONY_LINK_PROXY_URL}?url=${encodeURIComponent(dataLink)}`

        const response = await fetch(proxyUrl, {
            signal,
            headers: {
                ...(this.#host.bearerToken
                    ? { Authorization: `Bearer ${this.#host.bearerToken}` }
                    : {}),
            },
        })

        if (!response.ok) {
            throw new Error(
                `Failed to fetch subset job data: ${response.statusText}`,
            )
        }

        return response.blob()
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

    #handleHarmonyError(
        error: unknown,
        jobErrors?: Array<SubsetJobError>,
    ): void {
        const errorDetails = extractHarmonyError(error, jobErrors)

        this.#host.dispatchEvent(
            new CustomEvent('terra-time-average-map-error', {
                detail: errorDetails,
                bubbles: true,
                composed: true,
            }),
        )
    }

    #sleep(ms: number, signal: AbortSignal): Promise<void> {
        return new Promise((resolve, reject) => {
            if (signal.aborted) {
                reject(new Error('Aborted'))
                return
            }

            const timer = setTimeout(resolve, ms)
            signal.addEventListener('abort', () => {
                clearTimeout(timer)
                reject(new Error('Aborted'))
            })
        })
    }
}
