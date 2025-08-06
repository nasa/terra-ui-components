import { Task } from '@lit/task'
import type { StatusRenderer } from '@lit/task'
import type { ReactiveControllerHost } from 'lit'
import type TerraDataSubsetterHistory from './data-subsetter-history.component.js'
import { type SubsetJobs } from '../../data-services/types.js'
import { HarmonyDataService } from '../../data-services/harmony-data-service.js'

// we want to keep a relatively fresh jobs list, but if the history is collapsed we don't need to trigger it as often
const JOBS_POLL_MILLIS = 3000

export class DataSubsetterHistoryController {
    jobs?: SubsetJobs
    task: Task<[], SubsetJobs | undefined>

    #host: ReactiveControllerHost & TerraDataSubsetterHistory
    #dataService: HarmonyDataService
    #windowIsVisible: boolean = true
    #jobTimeout: any

    constructor(host: ReactiveControllerHost & TerraDataSubsetterHistory) {
        this.#host = host
        this.#dataService = this.#getDataService()

        this.task = new Task(host, {
            task: async ([], { signal }) => {
                clearTimeout(this.#jobTimeout)

                // only fetch new jobs if:
                //      we have a token
                //      this is the first time the task has run
                //      the history panel is expanded
                //      the browser window is focused
                const shouldFetch =
                    this.#windowIsVisible && (!this.#host.collapsed || !this.jobs)

                if (shouldFetch && this.#host.bearerToken) {
                    // only fetch new jobs if the history panel is expanded AND the user is looking at the browser window
                    this.jobs = await this.#dataService.getSubsetJobs({
                        bearerToken: this.#host.bearerToken,
                        signal,
                        environment: this.#host.environment,
                    })
                }

                // call the task again automatically after a bit
                this.#jobTimeout = setTimeout(() => this.task.run(), JOBS_POLL_MILLIS)

                return this.jobs
            },
            args: (): any => [this.#host.bearerToken],
        })
    }

    hostConnected() {
        document.addEventListener(
            'visibilitychange',
            this.#handleVisibilityChange.bind(this)
        )
    }

    hostDisconnected() {
        document.removeEventListener(
            'visibilitychange',
            this.#handleVisibilityChange.bind(this)
        )
    }

    render(renderFunctions: StatusRenderer<any>) {
        return this.task.render(renderFunctions)
    }

    #getDataService() {
        return new HarmonyDataService()
    }

    #handleVisibilityChange() {
        this.#windowIsVisible = document.visibilityState === 'visible'

        this.task.run()
    }
}
