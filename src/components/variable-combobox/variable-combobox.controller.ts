import type { StatusRenderer } from '@lit/task'
import { Task, TaskStatus } from '@lit/task'
import type { ReactiveControllerHost } from 'lit'
import { cherryPickDocInfo } from './lib.js'
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

        const isLocalHost = globalThis.location.hostname === 'localhost' // if running on localhost, we'll route API calls through a local proxy

        this.#apiTask = new Task(host, {
            task: async () => {
                const response = await fetch(
                    isLocalHost
                        ? 'http://localhost:9000/variables'
                        : 'https://uui-test.gesdisc.eosdis.nasa.gov/api/proxy/dev/~jdcarlso/collection+variable.json',
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

                return cherryPickDocInfo(docs)
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
