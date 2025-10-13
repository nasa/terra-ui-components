import { cherryPickDocInfo } from './lib.js'
import { Task, TaskStatus } from '@lit/task'
import type { StatusRenderer } from '@lit/task'
import type { ReactiveControllerHost } from 'lit'
import type {
    ListItem,
    MaybeBearerToken,
    ReadableTaskStatus,
} from './variable-combobox.types.js'

const apiError = new Error(
    'Failed to fetch the data required to make a list of searchable items.'
)

export class FetchController {
    #apiTask: Task<[], ListItem[]>
    #bearerToken: MaybeBearerToken = null

    constructor(host: ReactiveControllerHost, bearerToken: MaybeBearerToken) {
        this.#bearerToken = bearerToken

        this.#apiTask = new Task(host, {
            task: async () => {
                const response = await fetch(
                    'https://4nad4npjmf.execute-api.us-east-1.amazonaws.com/default/data-rods',
                    {
                        headers: {
                            Accept: 'application/json',
                            ...(this.#bearerToken
                                ? { Authorization: `Bearer: ${this.#bearerToken}` }
                                : {}),
                        },
                    }
                )

                if (!response.ok) {
                    throw apiError
                }

                const {
                    response: { docs },
                } = await response.json()

                return cherryPickDocInfo(docs).sort(
                    (a, b) =>
                        // sort by collection short name, then by long name if variables are in the same collection
                        a.collectionShortName.localeCompare(b.collectionShortName) ||
                        a.longName.localeCompare(b.longName)
                )
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
