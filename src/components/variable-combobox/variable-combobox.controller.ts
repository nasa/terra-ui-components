import { Task, TaskStatus } from '@lit/task'
import type { StatusRenderer } from '@lit/task'
import type { ReactiveControllerHost } from 'lit'
import { cherryPickDocInfo } from './lib.js'

export type ListItem = {
    entryId: string
    collectionLongName: string
    collectionShortName: string
    collectionVersion: string
    collectionBeginningDateTime: string
    collectionEndingDateTime: string
    name: string
    longName: string
    standardName: string
    units: string
    /* data used to emit event detail when option is selected */
    eventDetail: string
}

export type GroupedListItem = {
    collectionEntryId: string
    variables: ListItem[]
}

export type ReadableTaskStatus = 'INITIAL' | 'PENDING' | 'COMPLETE' | 'ERROR'

const apiError = new Error(
    'Failed to fetch the data required to make a list of searchable items.'
)

export class FetchController {
    #apiTask: Task<[], ListItem[]>

    constructor(host: ReactiveControllerHost) {
        const isLocalHost = globalThis.location.hostname === 'localhost' // if running on localhost, we'll route API calls through a local proxy

        this.#apiTask = new Task(host, {
            task: async () => {
                const response = await fetch(
                    isLocalHost
                        ? 'http://localhost:9000/variables'
                        : 'https://dev.gesdisc.eosdis.nasa.gov/~jdcarlso/collection+variable.json'
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
