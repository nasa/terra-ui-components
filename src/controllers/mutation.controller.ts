import { MutationObserver } from '@tanstack/query-core'
import type {
    MutationObserverOptions,
    MutationObserverResult,
} from '@tanstack/query-core'
import type { ReactiveController, ReactiveControllerHost } from 'lit'
import type { QueryClientHost } from '../mixins/query-client.mixin.js'

export type { MutationObserverOptions, MutationObserverResult }

/**
 * A Lit ReactiveController that wraps MutationObserver from @tanstack/query-core.
 * Mirrors the QueryController pattern for consistency.
 *
 * @example
 * class MyController {
 *   #mutation = new MutationController(host, {
 *     mutationFn: (variables) => api.doSomething(variables),
 *   })
 *
 *   async submit(data: MyData) {
 *     return this.#mutation.mutate(data)
 *   }
 *
 *   get isPending() {
 *     return this.#mutation.result?.isPending ?? false
 *   }
 * }
 */
export class MutationController<
    TData = unknown,
    TError = Error,
    TVariables = void,
> implements ReactiveController
{
    result?: MutationObserverResult<TData, TError, TVariables>

    #observer: MutationObserver<TData, TError, TVariables>
    #unsubscribe?: () => void

    constructor(
        protected host: ReactiveControllerHost & QueryClientHost,
        options: MutationObserverOptions<TData, TError, TVariables>,
    ) {
        this.host.addController(this)
        this.#observer = new MutationObserver(host.queryClient, options)
    }

    /**
     * Trigger the mutation with the given variables.
     * Returns a promise that resolves with the mutation result data.
     */
    mutate(variables: TVariables) {
        return this.#observer.mutate(variables)
    }

    /**
     * Reset the mutation back to its idle state.
     */
    reset() {
        this.#observer.reset()
        this.host.requestUpdate()
    }

    hostConnected() {
        this.#unsubscribe = this.#observer.subscribe((result) => {
            this.result = result
            this.host.requestUpdate()
        })
    }

    hostDisconnected() {
        this.#unsubscribe?.()
        this.#unsubscribe = undefined
    }
}
