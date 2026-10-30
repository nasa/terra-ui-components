import type {
    QueryKey,
    QueryObserverOptions,
    QueryObserverResult,
} from '@tanstack/query-core'
import { QueryObserver } from '@tanstack/query-core'
import type { ReactiveController, ReactiveControllerHost } from 'lit'
import type { QueryClientHost } from '../mixins/query-client.mixin.js'

export type { QueryObserverOptions }

export class QueryController<
    TQueryFnData = unknown,
    TError = unknown,
    TData = TQueryFnData,
    TQueryData = TQueryFnData,
    TQueryKey extends QueryKey = QueryKey,
> implements ReactiveController
{
    result?: QueryObserverResult<TData, TError>

    protected queryObserver?: QueryObserver<
        TQueryFnData,
        TError,
        TData,
        TQueryData,
        TQueryKey
    >

    protected unsubscribe?: () => void

    protected hostPropertyName?: string

    #isConnected = false

    #resolveDefaultedOptions(
        options:
            | QueryObserverOptions<TQueryFnData, TError, TData, TQueryData, TQueryKey>
            | (() => QueryObserverOptions<
                  TQueryFnData,
                  TError,
                  TData,
                  TQueryData,
                  TQueryKey
              >)
    ) {
        return this.host.queryClient.defaultQueryOptions<
            TQueryFnData,
            TError,
            TData,
            TQueryData,
            TQueryKey
        >(typeof options === 'function' ? options() : options)
    }

    constructor(
        protected host: ReactiveControllerHost & QueryClientHost,
        protected optionsFn?: () => QueryObserverOptions<
            TQueryFnData,
            TError,
            TData,
            TQueryData,
            TQueryKey
        >,
        hostPropertyName?: string
    ) {
        this.host.addController(this)
        this.hostPropertyName = hostPropertyName

        // If you want to start observing immediately (safe; subscribe happens on connect)
        if (this.optionsFn) {
            this.observeQuery(this.optionsFn)
        }
    }

    observeQuery(
        options:
            | QueryObserverOptions<TQueryFnData, TError, TData, TQueryData, TQueryKey>
            | (() => QueryObserverOptions<
                  TQueryFnData,
                  TError,
                  TData,
                  TQueryData,
                  TQueryKey
              >),
        optimistic: boolean = true
    ) {
        const queryClient = this.host.queryClient
        const defaultedOptions = this.#resolveDefaultedOptions(options)

        this.queryObserver = new QueryObserver(queryClient, defaultedOptions)

        this.result = optimistic
            ? this.queryObserver.getOptimisticResult(defaultedOptions)
            : undefined

        this.host.requestUpdate()
    }

    hostUpdate() {
        if (!this.optionsFn || !this.queryObserver) return
        const defaultedOptions = this.#resolveDefaultedOptions(this.optionsFn)
        this.queryObserver.setOptions(defaultedOptions)
    }

    hostConnected() {
        this.#isConnected = true
        this.subscribe()
    }

    async subscribe() {
        if (this.host.queryClientReady) {
            await this.host.queryClientReady

            if (!this.#isConnected) {
                return
            }
        }

        if (!this.queryObserver) {
            // In case observeQuery wasn't called in ctor
            if (this.optionsFn) {
                this.observeQuery(this.optionsFn)
            }

            if (!this.queryObserver) {
                return
            }
        } else if (this.optionsFn) {
            this.queryObserver.setOptions(
                this.#resolveDefaultedOptions(this.optionsFn)
            )
        }

        this.unsubscribe?.()

        this.unsubscribe = this.queryObserver.subscribe(
            (result: typeof this.result) => {
                this.result = result
                // If a host property was specified, update it to trigger watchers and updated()
                if (this.hostPropertyName) {
                    ;(this.host as any)[this.hostPropertyName] = result
                }

                this.host.requestUpdate()
            }
        )

        this.queryObserver.updateResult()
        this.result = this.queryObserver.getCurrentResult()
        this.host.requestUpdate()
    }

    hostDisconnected() {
        this.#isConnected = false
        this.unsubscribe?.()
        this.unsubscribe = undefined
    }
}
