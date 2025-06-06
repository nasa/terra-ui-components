import type { StatusRenderer } from '@lit/task'
import { Task, TaskStatus } from '@lit/task'
import type { ReactiveControllerHost } from 'lit'
import type { ListItem, ReadableTaskStatus } from './variable-keyword-search.types.js'

const apiError = new Error(
    'Failed to fetch the data required to make a list of searchable items.'
)

export class FetchController {
    #apiTask: Task<[], any[]>

    constructor(host: ReactiveControllerHost) {
        this.#apiTask = new Task(host, {
            task: async () => {
                /** @see {@link https://solr.apache.org/guide/solr/latest/query-guide/terms-component.html} */
                const response = await fetch(
                    'https://lb.gesdisc.eosdis.nasa.gov/windmill/api/r/giovanni/aesir-keywords'
                )

                if (!response.ok) {
                    throw apiError
                }

                return await response.json()
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
