import { Task } from '@lit/task'
import type { StatusRenderer } from '@lit/task'
import type { ReactiveControllerHost } from 'lit'
import type TerraDataSubsetter from './data-subsetter.component.js'
import {
    type BoundingBox,
    type SubsetJobStatus,
    Status,
} from '../../data-services/types.js'
import {
    FINAL_STATUSES,
    HarmonyDataService,
} from '../../data-services/harmony-data-service.js'
import { getUTCDate } from '../../utilities/date.js'
import Fuse from 'fuse.js'
import type {
    CmrSamplingOfGranules,
    MetadataCatalogInterface,
} from '../../metadata-catalog/types.js'
import { CmrCatalog } from '../../metadata-catalog/cmr-catalog.js'

const JOB_STATUS_POLL_MILLIS = 3000

export class DataSubsetterController {
    jobStatusTask: Task<[], SubsetJobStatus | undefined>
    fetchCollectionTask: Task<[string], any | undefined>
    searchCmrTask: Task<[string | undefined, string], any | undefined>
    samplingTask: Task<[string | undefined], CmrSamplingOfGranules | undefined>
    giovanniConfiguredVariablesTask: Task<[], Set<string> | undefined>
    currentJob: SubsetJobStatus | null

    #host: ReactiveControllerHost & TerraDataSubsetter
    #dataService: HarmonyDataService
    #metadataCatalog: MetadataCatalogInterface
    #sampling?: CmrSamplingOfGranules

    constructor(host: ReactiveControllerHost & TerraDataSubsetter) {
        this.#host = host
        this.#dataService = this.#getDataService()
        this.#metadataCatalog = this.#getMetadataCatalog()

        this.fetchCollectionTask = new Task(host, {
            task: async ([collectionEntryId], { signal }) => {
                this.#host.collectionWithServices = collectionEntryId
                    ? await this.#dataService.getCollectionWithAvailableServices(
                          collectionEntryId,
                          {
                              signal,
                              environment: this.#host.environment,
                          }
                      )
                    : undefined

                return this.#host.collectionWithServices
            },
            args: (): [string | undefined] => [this.#host.collectionEntryId],
        })

        this.searchCmrTask = new Task(host, {
            task: async ([searchQuery, searchType], { signal }) => {
                if (!searchQuery) {
                    this.#host.collectionSearchResults = undefined
                    return this.#host.collectionSearchResults
                }

                // reset the results
                this.#host.collectionSearchLoading = true

                const results = await this.#metadataCatalog.searchCmr(
                    searchQuery,
                    searchType as 'collection' | 'variable' | 'all',
                    {
                        signal,
                    }
                )

                const fuse = new Fuse(results, {
                    keys: ['title', 'entryId', 'provider'],
                })

                this.#host.collectionSearchResults = fuse
                    .search(searchQuery)
                    .map(result => result.item)

                this.#host.collectionSearchLoading = false

                return this.#host.collectionSearchResults
            },
            args: (): [string | undefined, string] => [
                this.#host.collectionSearchQuery,
                this.#host.collectionSearchType,
            ],
        })

        this.samplingTask = new Task(host, {
            task: async ([collectionEntryId], { signal }) => {
                if (!collectionEntryId) {
                    return
                }

                const sampling = await this.#metadataCatalog.getSamplingOfGranules(
                    collectionEntryId,
                    {
                        signal,
                    }
                )

                this.#sampling = sampling?.collections?.items?.[0]

                this.#host.granuleMinDate =
                    this.#sampling?.firstGranules?.items[0]?.temporalExtent?.rangeDateTime?.beginningDateTime
                this.#host.granuleMaxDate =
                    this.#sampling?.lastGranules?.items.slice(
                        -1
                    )[0]?.temporalExtent?.rangeDateTime?.endingDateTime

                console.log(
                    'Updated sampling: ',
                    collectionEntryId,
                    this.#sampling,
                    this.#host.granuleMinDate,
                    this.#host.granuleMaxDate
                )

                return this.#sampling
            },
            args: (): [string | undefined] => [this.#host.collectionEntryId],
        })

        this.giovanniConfiguredVariablesTask = new Task(host, {
            task: async ([], { signal }) => {
                try {
                    const response = await fetch(
                        'https://api.giovanni.earthdata.nasa.gov/configured-variables/',
                        { signal }
                    )

                    if (!response.ok) {
                        console.warn(
                            'Failed to fetch Giovanni configured variables:',
                            response.status
                        )
                        return undefined
                    }

                    const data = await response.json()

                    const variableNames = new Set(
                        data['configured_variables'] as string[]
                    )

                    this.#host.giovanniConfiguredVariables = variableNames
                    return variableNames
                } catch (error) {
                    console.warn(
                        'Error fetching Giovanni configured variables:',
                        error
                    )
                    // Return undefined to indicate failure - will show all variables
                    return undefined
                }
            },
            args: (): [] => [],
        })

        this.jobStatusTask = new Task(host, {
            task: async ([], { signal }) => {
                let job

                if (this.currentJob?.jobID) {
                    // we already have a job, get it's status
                    job = await this.#dataService.getSubsetJobStatus(
                        this.currentJob.jobID,
                        {
                            signal,
                            bearerToken: this.#host.bearerToken,
                            environment: this.#host.environment,
                        }
                    )
                } else {
                    const isGiovanniFormat =
                        this.#host.selectedFormat === 'text/csv' ||
                        this.#host.selectedFormat === 'image/tiff'

                    // For CSV/TIFF, use collectionEntryId format like time-average-map
                    // For other formats, use collectionConceptId
                    const collectionId = isGiovanniFormat
                        ? `${this.#host.collectionWithServices?.shortName}_${this.#host.collectionWithServices?.collection?.Version}`
                        : this.#host.collectionWithServices?.conceptId ?? ''

                    let subsetOptions = {
                        ...(isGiovanniFormat
                            ? { collectionEntryId: collectionId }
                            : { collectionConceptId: collectionId }),
                        ...(this.#host.collectionWithServices?.variableSubset &&
                            (isGiovanniFormat
                                ? {
                                      variableConceptIds: ['parameter_vars'],
                                      variableEntryIds:
                                          this.#host.selectedVariables.map(v =>
                                              `${this.#host.collectionWithServices?.shortName}_${this.#host.collectionWithServices?.collection?.Version}_${v.name}`.replace(
                                                  /\./g,
                                                  '_'
                                              )
                                          ),
                                  }
                                : {
                                      variableConceptIds:
                                          this.#host.selectedVariables.map(
                                              v => v.conceptId
                                          ),
                                  })),
                        ...('w' in (this.#host.spatialSelection ?? {}) &&
                            this.#host.collectionWithServices?.bboxSubset && {
                                boundingBox: this.#host
                                    .spatialSelection as BoundingBox,
                            }),
                        ...(this.#host.selectedDateRange.startDate &&
                            this.#host.selectedDateRange.endDate &&
                            this.#host.collectionWithServices?.temporalSubset && {
                                startDate: this.isSubDaily
                                    ? this.#host.selectedDateRange.startDate
                                    : getUTCDate(
                                          this.#host.selectedDateRange.startDate
                                      ).toISOString(),
                                endDate: this.isSubDaily
                                    ? this.#host.selectedDateRange.endDate
                                    : getUTCDate(
                                          this.#host.selectedDateRange.endDate,
                                          true
                                      ).toISOString(),
                            }),
                        ...(this.#host.selectedFormat &&
                            this.#host.collectionWithServices?.outputFormats
                                ?.length && {
                                // For Giovanni services, always use text/csv format (not image/tiff)
                                format: isGiovanniFormat
                                    ? 'text/csv'
                                    : this.#host.selectedFormat,
                            }),
                        // Add Cloud Giovanni specific average parameters
                        ...(this.#host.selectedFormat === 'text/csv' && {
                            average: 'area',
                        }),
                        ...(this.#host.selectedFormat === 'image/tiff' && {
                            average: 'time',
                        }),
                        labels: [] as string[],
                    }
                    subsetOptions.labels = this.#buildJobLabels(subsetOptions) // Overwrite the empty labels

                    console.log(
                        `Creating a job for collection, ${this.#host.collectionWithServices?.conceptId}, with subset options`,
                        subsetOptions
                    )

                    // we'll start with an empty job to clear out any existing job
                    this.currentJob = this.#getEmptyJob()

                    // create the new job
                    try {
                        job = await this.#dataService.createSubsetJob(subsetOptions, {
                            signal,
                            bearerToken: this.#host.bearerToken,
                            environment: this.#host.environment,
                        })
                    } catch (error) {
                        console.error('createSubsetJob ERROR: ', error)
                        // Set the job to failed state so UI can show the error
                        this.currentJob = {
                            ...this.currentJob,
                            status: Status.FAILED,
                            message:
                                error instanceof Error
                                    ? error.message
                                    : 'Failed to create subset job',
                        }
                        // Re-throw so the task goes into ERROR state
                        throw error
                    }
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
                } else if (job) {
                    console.log('Subset job completed ', job)
                    this.#host.emit('terra-subset-job-complete', {
                        detail: job,
                    })
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

    cancelCurrentJob() {
        if (!this.currentJob?.jobID) {
            return
        }

        this.#dataService.cancelSubsetJob(this.currentJob.jobID, {
            bearerToken: this.#host.bearerToken,
            environment: this.#host.environment,
        })
    }

    #getMetadataCatalog() {
        return new CmrCatalog()
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

    #buildJobLabels(subsetOptions: Record<string, any>): Array<string> {
        const labels: string[] = []
        // Using every subsetOptions key/value pair as a label to append
        for (const key of Object.keys(subsetOptions)) {
            if (key !== 'labels') {
                // Prevents empty label from being
                const value = subsetOptions[key]

                // Convert to string
                const valueStr =
                    typeof value === 'object' ? JSON.stringify(value) : value
                labels.push(encodeURIComponent(`${key}: ${valueStr}`))
            }
        }

        // Extra labels not from subsetOptions
        if (this.#host.collectionEntryId) {
            labels.push(
                encodeURIComponent(
                    `collection-entry-id: ${this.#host.collectionEntryId}`
                )
            )
        }

        if (this.#host.collectionWithServices?.collection?.EntryTitle) {
            labels.push(
                encodeURIComponent(
                    `collection-entry-title: ${this.#host.collectionWithServices.collection.EntryTitle}`
                )
            )
        }
        return labels
    }

    get granuleMinDate() {
        if (!this.#sampling?.firstGranules) {
            return null
        }

        return (
            this.#sampling.firstGranules.items[0]?.temporalExtent?.rangeDateTime
                ?.beginningDateTime ?? null
        )
    }

    get granuleMaxDate() {
        if (!this.#sampling?.lastGranules) {
            return null
        }

        const granules = this.#sampling.lastGranules.items
        return (
            granules[granules.length - 1].temporalExtent?.rangeDateTime
                ?.endingDateTime ?? null
        )
    }

    get isSubDaily() {
        if (!this.#sampling?.firstGranules?.items?.[0]) {
            return false
        }

        const firstGranule = this.#sampling.firstGranules.items[0]

        const timeStart =
            firstGranule.temporalExtent?.rangeDateTime?.beginningDateTime
        const timeEnd = firstGranule.temporalExtent?.rangeDateTime?.endingDateTime

        if (!timeStart || !timeEnd) {
            return false
        }

        // Parse the dates and calculate the difference in hours
        const start = new Date(timeStart)
        const end = new Date(timeEnd)
        const diffMs = end.getTime() - start.getTime()
        const diffHours = diffMs / (1000 * 60 * 60)

        // If the temporal extent is less than 24 hours, it's sub-daily
        return diffHours < 24
    }

    get spatialConstraints() {
        const boundingRects =
            this.#sampling?.spatialExtent?.horizontalSpatialDomain?.geometry
                ?.boundingRectangles

        if (!boundingRects || boundingRects.length === 0) {
            return '-180, -90, 180, 90'
        }

        const boundingRect = boundingRects[0]
        const {
            westBoundingCoordinate,
            southBoundingCoordinate,
            eastBoundingCoordinate,
            northBoundingCoordinate,
        } = boundingRect

        return `${westBoundingCoordinate}, ${southBoundingCoordinate}, ${eastBoundingCoordinate}, ${northBoundingCoordinate}`
    }
}
