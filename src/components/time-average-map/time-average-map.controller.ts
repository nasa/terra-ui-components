import { Task } from '@lit/task'
import type { StatusRenderer } from '@lit/task'
import type { ReactiveControllerHost } from 'lit'
import GeoTIFF from 'ol/source/GeoTIFF.js';
import { format } from 'date-fns'
import {
    type SubsetJobStatus,
    Status,
} from '../../data-services/types.js'
import {
    FINAL_STATUSES,
    HarmonyDataService,
} from '../../data-services/harmony-data-service.js'
import type TerraTimeAvgMap from './time-average-map.component.js'

const JOB_STATUS_POLL_MILLIS = 3000

export class TimeAvgMapController {
    jobStatusTask: Task<[], SubsetJobStatus | undefined>
    currentJob: SubsetJobStatus | null

    #host: ReactiveControllerHost & TerraTimeAvgMap
    #dataService: HarmonyDataService

    constructor(host: ReactiveControllerHost & TerraTimeAvgMap) {
        this.#host = host
        this.#dataService = this.#getDataService()

        this.jobStatusTask = new Task(host, {
            task: async ([], { signal }) => {
                let job
                if (this.currentJob?.jobID) {
                    console.log("Polling status of job...")
                    // we already have a job, get it's status
                    job = await this.#dataService.getSubsetJobStatus(
                        this.currentJob.jobID,
                        { signal, bearerToken: this.#host.bearerToken }
                    )
                } else {

                    const start_date = new Date(this.#host?.startDate ?? Date.now());
                    const end_date = new Date(this.#host?.endDate ?? Date.now());;
                    const [w, s, e, n] = this.#host.location?.split(',') ?? [];

                    let subsetOptions = {
                      collectionEntryId: "M2T1NXAER_5.12.4", //TODO: This is currently hardcoded 
                      variableConceptIds: ['parameter_vars'],
                      variableEntryIds: [this.#host.collection!],
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
                    console.log(
                        `Creating a job with options`,
                        subsetOptions
                    )

                    // we'll start with an empty job to clear out any existing job
                    this.currentJob = this.#getEmptyJob()
                    
                    job = await this.#dataService.createSubsetJob(subsetOptions, {
                        signal,
                        bearerToken: this.#host.bearerToken,
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
    
    fetchGeotiffMetadata(gtSource: GeoTIFF) {
        gtSource.getView().then(() => {
          const internal = gtSource as any;
          console.log('sourceImagery_:', internal.sourceImagery_);
          const gtImage = internal.sourceImagery_[0][0];
          const gtMetadata = gtImage.fileDirectory?.GDAL_METADATA;
          console.log(typeof (gtMetadata))
          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(gtMetadata, "application/xml");
          const items = xmlDoc.querySelectorAll("Item");
          console.log("items: ",items)
    
          const dataObj: { [key: string]: string } = {};
    
          for (let i = 0; i < items.length; i++) {
            const item = items[i];
            const name = item.getAttribute("name");
            const value = item.textContent ? item.textContent.trim() : "";
            if(name) {
            dataObj[name] = value
            }
          }
          // const description = dataObj["DESCRIPTION"]
          // const conventions = dataObj["Conventions"]
          // const DOI = dataObj["DOI"]
          // const cell_methods = dataObj["cell_methods"]
          // const latitude_resolution = dataObj["latitude_resolution"]
          // const long_name = dataObj["long_name"]
          // const product_short_name = dataObj["product_short_name"]
          // const product_version = dataObj["product_version"]
          // const units = dataObj["units"]
          // const userenddate = dataObj["userenddate"]
          // const userstartdate = dataObj['userstartdate']
          console.log("Data obj: ",dataObj)
          return dataObj
        })
      }
}
