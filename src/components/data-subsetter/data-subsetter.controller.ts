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
import type { MetadataCatalogInterface } from '../../metadata-catalog/types.js'
import { CmrCatalog } from '../../metadata-catalog/cmr-catalog.js'

const JOB_STATUS_POLL_MILLIS = 3000

export class DataSubsetterController {
    jobStatusTask: Task<[], SubsetJobStatus | undefined>
    fetchCollectionTask: Task<[string, string | undefined], any | undefined>
    searchCmrTask: Task<[string | undefined, string], any | undefined>
    currentJob: SubsetJobStatus | null

    #host: ReactiveControllerHost & TerraDataSubsetter
    #dataService: HarmonyDataService
    #metadataCatalog: MetadataCatalogInterface

    constructor(host: ReactiveControllerHost & TerraDataSubsetter) {
        this.#host = host
        this.#dataService = this.#getDataService()
        this.#metadataCatalog = this.#getMetadataCatalog()

        this.fetchCollectionTask = new Task(host, {
            task: async ([collectionEntryId], { signal }) => {
                if (!this.#host.bearerToken) {
                    return undefined
                }

                this.#host.collectionWithServices = collectionEntryId
                    ? await this.#dataService.getCollectionWithAvailableServices(
                          collectionEntryId,
                          {
                              signal,
                              bearerToken: this.#host.bearerToken,
                              environment: this.#host.environment,
                          }
                      )
                    : undefined

                return this.#host.collectionWithServices
            },
            args: (): [string | undefined, string | undefined] => [
                this.#host.collectionEntryId,
                this.#host.bearerToken,
            ],
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

        this.jobStatusTask = new Task(host, {
            task: async ([], { signal }) => {
                let job

                // TODO: can this go elsewhere? Feels like an odd place
                this.#host.renderHistoryPanel()

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
                    const labels = this.#buildJobLabels()

                    let subsetOptions = {
                        collectionConceptId:
                            this.#host.collectionWithServices?.conceptId ?? '',
                        ...(this.#host.collectionWithServices?.variableSubset && {
                            variableConceptIds: this.#host.selectedVariables.map(
                                v => v.conceptId
                            ),
                        }),
                        ...('w' in (this.#host.spatialSelection ?? {}) &&
                            this.#host.collectionWithServices?.bboxSubset && {
                                boundingBox: this.#host
                                    .spatialSelection as BoundingBox,
                            }),
                        ...(this.#host.selectedDateRange.startDate &&
                            this.#host.selectedDateRange.endDate &&
                            this.#host.collectionWithServices?.temporalSubset && {
                                startDate: getUTCDate(
                                    this.#host.selectedDateRange.startDate
                                ).toISOString(),
                                endDate: getUTCDate(
                                    this.#host.selectedDateRange.endDate,
                                    true
                                ).toISOString(),
                            }),
                        ...(this.#host.selectedFormat &&
                            this.#host.collectionWithServices?.outputFormats
                                ?.length && {
                                format: this.#host.selectedFormat,
                            }),
                        labels,
                    }

                    console.log(
                        `Creating a job for collection, ${this.#host.collectionWithServices?.conceptId}, with subset options`,
                        subsetOptions
                    )

                    // we'll start with an empty job to clear out any existing job
                    this.currentJob = this.#getEmptyJob()

                    // create the new job
                    job = await this.#dataService.createSubsetJob(subsetOptions, {
                        signal,
                        bearerToken: this.#host.bearerToken,
                        environment: this.#host.environment,
                    })
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

    #buildJobLabels(): string[] {
        const labels = []

        if (this.#host.collectionWithServices?.collection?.EntryTitle) {
            labels.push(
                encodeURIComponent(
                    this.#host.collectionWithServices?.collection?.EntryTitle
                )
            )
        }

        return labels
    }
}
