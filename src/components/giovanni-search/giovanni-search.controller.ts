import { Task, TaskStatus } from '@lit/task'
import type { StatusRenderer } from '@lit/task'
import type { ReactiveControllerHost } from 'lit'
import { adaptReponse } from './lib.js'
import type { ListItem, ReadableTaskStatus } from './giovanni-search.types.ts'

const apiError = new Error(
    'Failed to fetch the data required to make a list of searchable items.'
)

export class FetchController {
    #apiTask: Task<[], any[]>

    constructor(host: ReactiveControllerHost) {
        const isLocalHost = globalThis.location.hostname === 'localhost' // if running on localhost, we'll route API calls through a local proxy

        this.#apiTask = new Task(host, {
            task: async () => {
                /** @see {@link https://solr.apache.org/guide/solr/latest/query-guide/terms-component.html} */
                const response = await fetch(
                    isLocalHost
                        ? 'http://localhost:9000/keywords'
                        : 'https://giovanni.gsfc.nasa.gov/giovanni/daac-bin/aesir_proxy.pl/terms?terms.fl=dataFieldKeywords&terms.limit=-1&wt=json&terms.sort=count'
                )

                if (!response.ok) {
                    throw apiError
                }

                return adaptReponse(await response.json())
            },
            args: (): any => [],
        })
    }

    get taskComplete() {
        return this.#apiTask.taskComplete
    }

    get value() {
        return this.#apiTask.value
    }

    get taskStatus() {
        const readableStatus = Object.entries(TaskStatus).reduce<
            Record<number, ReadableTaskStatus>
        >((accumulator, [key, value]) => {
            accumulator[value] = key as ReadableTaskStatus

            return accumulator
        }, {})

        return readableStatus[this.#apiTask.status]
    }

    render(renderFunctions: StatusRenderer<ListItem[]>) {
        return this.#apiTask.render(renderFunctions)
    }
}
