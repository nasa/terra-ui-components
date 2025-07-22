import type { StatusRenderer } from '@lit/task'
import { Task, TaskStatus } from '@lit/task'
import type { ReactiveControllerHost } from 'lit'
import type { ReadableTaskStatus } from './variable-keyword-search.types.js'
import { GiovanniVariableCatalog } from '../../metadata-catalog/giovanni-variable-catalog.js'
import type { SearchKeywordsResponse } from '../../metadata-catalog/types.js'

export class FetchController {
    #apiTask: Task<[], SearchKeywordsResponse>

    constructor(host: ReactiveControllerHost) {
        const variableCatalog = new GiovanniVariableCatalog()

        this.#apiTask = new Task(host, {
            task: async () => variableCatalog.getSearchKeywords(),
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

    render(renderFunctions: StatusRenderer<SearchKeywordsResponse>) {
        return this.#apiTask.render(renderFunctions)
    }
}
