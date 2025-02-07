import { Task } from '@lit/task'
import type { StatusRenderer } from '@lit/task'
import type { ReactiveControllerHost } from 'lit'

export class GiovanniBrowseController {
    #task: Task<[], any[]>

    constructor(host: ReactiveControllerHost) {
        this.#task = new Task(host, {
            task: async (_args, { signal }) => {
                const response = await fetch(
                    'https://windmill-load-balancer-641499207.us-east-1.elb.amazonaws.com/api/r/giovanni/catalog',
                    { signal }
                )

                if (!response.ok) {
                    console.error(response)
                    // TODO: better error handling for Catalog I/O
                    throw new Error('Failed to fetch catalog')
                }

                return await response.json()
            },
            args: (): any => [],
        })
    }

    render(renderFunctions: StatusRenderer<any>) {
        return this.#task.render(renderFunctions)
    }
}
