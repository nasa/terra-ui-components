import { Task } from '@lit/task'
import type { StatusRenderer } from '@lit/task'
import type { ReactiveControllerHost } from 'lit'
import type TerraDataSubsetterHistory from './data-subsetter-history.component.js'
import { type SubsetJobs } from '../../data-services/types.js'
import { HarmonyDataService } from '../../data-services/harmony-data-service.js'

// we want to keep a relatively fresh jobs list, but if the history is collapsed we don't need to trigger it as often
const EXPANDED_JOBS_POLL_MILLIS = 3000
const COLLAPSED_JOBS_POLL_MILLIS = 10000

export class DataSubsetterHistoryController {
    jobs?: SubsetJobs
    task: Task<[], SubsetJobs>

    #host: ReactiveControllerHost & TerraDataSubsetterHistory
    #dataService: HarmonyDataService
    #windowIsVisible: boolean = true
    #jobTimeout: any

    constructor(host: ReactiveControllerHost & TerraDataSubsetterHistory) {
        this.#host = host
        this.#dataService = this.#getDataService()

        this.task = new Task(host, {
            task: async ([], { signal }) => {
                this.jobs = await this.#dataService.getSubsetJobs({
                    bearerToken: this.#host.bearerToken,
                    signal,
                })

                return this.jobs
            },
            args: (): any => [],
            autoRun: false,
        })

        this.#poll()
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

        this.#poll()
    }

    async #poll() {
        clearTimeout(this.#jobTimeout)

        if (!this.#windowIsVisible) {
            // stop polling if the user isn't looking at the window
            return
        }

        await this.task.run()

        this.#jobTimeout = setTimeout(
            () => this.#poll(),
            !this.#host.collapsed
                ? EXPANDED_JOBS_POLL_MILLIS
                : COLLAPSED_JOBS_POLL_MILLIS
        )
    }
}
