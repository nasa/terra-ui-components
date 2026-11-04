import {
    type DefaultedQueryObserverOptions,
    type DefaultError,
    type FetchQueryOptions,
    QueryClient,
    type QueryExecuteOptions,
    type QueryKey,
    type QueryObserverOptions,
} from '@tanstack/query-core'
import {
    persistQueryClientRestore,
    persistQueryClientSubscribe,
} from '@tanstack/query-persist-client-core'
import type { LitElement } from 'lit'
import { duration } from '../constants.js'
import { HttpException } from '../exceptions/http.exception.js'
import { createIDBPersister } from '../lib/indexeddb-persister.js'
import type { Constructor } from './mixin.types.js'

declare module '@tanstack/query-core' {
    interface QueryOptions<
        TQueryFnData = unknown,
        TError = DefaultError,
        TData = TQueryFnData,
        TQueryKey extends QueryKey = QueryKey,
        TPageParam = never,
    > {
        /**
         * Optional per-query cache buster. Changing this value invalidates
         * previously cached in-memory and IndexedDB entries for this query.
         */
        buster?: string | number
    }
}

/**
 * Global cache buster for the persisted IndexedDB QueryClient state.
 * Incrementing or changing this value invalidates the entire persisted cache on boot.
 */
export const QUERY_CACHE_BUSTER = 'v1'

export const queryClientPersister = createIDBPersister('terraQuery', {
    dbName: 'terra-query',
    storeName: 'query-client',
})

let mountCount = 0

/**
 * Specialized QueryClient for Terra components that enforces two invariants:
 * 1. Offline Hydration Gate: All `query()` and `fetchQuery()` calls await IndexedDB
 *    restoration before evaluating cache hits or issuing network requests.
 * 2. Per-Query Cache Busting: Injects `{ __buster }` into query keys when `buster`
 *    is specified in query options.
 */
export class TerraQueryClient extends QueryClient {
    #restorePromise?: Promise<void>
    #persistUnsubscribe?: () => void

    /**
     * Returns a cached promise for the initial IndexedDB restoration cycle.
     * All `query()` and `fetchQuery()` calls gate on this promise to guarantee
     * that offline cache entries populate the QueryClient before issuing network requests.
     */
    ensureRestored(): Promise<void> {
        if (!this.#restorePromise) {
            const currentRestore = persistQueryClientRestore({
                queryClient: this,
                persister: queryClientPersister,
                maxAge: duration.days(1),
                buster: QUERY_CACHE_BUSTER,
            })
                .catch(() => undefined)
                .then(() => {
                    if (this.#restorePromise === currentRestore) {
                        this.syncPersistenceSubscription()
                    }
                })
            this.#restorePromise = currentRestore
        } else {
            const currentRestore = this.#restorePromise
            void currentRestore.then(() => {
                if (this.#restorePromise === currentRestore) {
                    this.syncPersistenceSubscription()
                }
            })
        }

        return this.#restorePromise
    }

    /**
     * Subscribes to QueryClient cache mutations to persist state back to IndexedDB.
     *
     * NOTE: We attach the persistence subscriber only after `persistQueryClientRestore` settles.
     * Attaching the subscriber prior to initial hydration would flush an incomplete or empty
     * cache to IndexedDB, erasing valid persisted data.
     */
    syncPersistenceSubscription(): void {
        if (mountCount > 0 && !this.#persistUnsubscribe) {
            this.#persistUnsubscribe = persistQueryClientSubscribe({
                queryClient: this,
                persister: queryClientPersister,
                buster: QUERY_CACHE_BUSTER,
            })
        }
    }

    /**
     * Unsubscribes from persistence cache mutations when all host components disconnect.
     */
    stopPersistenceSubscription(): void {
        this.#persistUnsubscribe?.()
        this.#persistUnsubscribe = undefined
    }

    /**
     * Resets the one-time persistence restore state so callers can trigger a fresh
     * hydration cycle (e.g. for cold-start testing or session restart).
     */
    resetPersistence(): void {
        this.stopPersistenceSubscription()
        this.#restorePromise = undefined
    }
    override defaultQueryOptions<
        TQueryFnData = unknown,
        TError = DefaultError,
        TData = TQueryFnData,
        TQueryData = TQueryFnData,
        TQueryKey extends QueryKey = QueryKey,
        TPageParam = never,
    >(
        options:
            | QueryObserverOptions<
                  TQueryFnData,
                  TError,
                  TData,
                  TQueryData,
                  TQueryKey,
                  TPageParam
              >
            | DefaultedQueryObserverOptions<
                  TQueryFnData,
                  TError,
                  TData,
                  TQueryData,
                  TQueryKey
              >
    ): DefaultedQueryObserverOptions<
        TQueryFnData,
        TError,
        TData,
        TQueryData,
        TQueryKey
    > {
        if (
            !('_defaulted' in options && options._defaulted) &&
            options.buster !== undefined &&
            Array.isArray(options.queryKey) &&
            !options.queryKey.some(
                part =>
                    typeof part === 'object' && part !== null && '__buster' in part
            )
        ) {
            return super.defaultQueryOptions({
                ...options,
                queryKey: [
                    ...options.queryKey,
                    { __buster: options.buster },
                ] as unknown as TQueryKey,
            })
        }
        return super.defaultQueryOptions(options)
    }

    override async query<
        TQueryFnData,
        TError = DefaultError,
        TData = TQueryFnData,
        TQueryData = TQueryFnData,
        TQueryKey extends QueryKey = QueryKey,
        TPageParam = never,
    >(
        options: QueryExecuteOptions<
            TQueryFnData,
            TError,
            TData,
            TQueryData,
            TQueryKey,
            TPageParam
        >
    ): Promise<TData> {
        await this.ensureRestored()
        return super.query(options)
    }

    override async fetchQuery<
        TQueryFnData,
        TError = DefaultError,
        TData = TQueryFnData,
        TQueryKey extends QueryKey = QueryKey,
        TPageParam = never,
    >(
        options: FetchQueryOptions<TQueryFnData, TError, TData, TQueryKey, TPageParam>
    ): Promise<TData> {
        await this.ensureRestored()
        return super.fetchQuery(options)
    }
}

const ensureRestored = (queryClient: QueryClient): Promise<void> => {
    if (queryClient instanceof TerraQueryClient) {
        return queryClient.ensureRestored()
    }
    return Promise.resolve()
}

export const sharedQueryClient: QueryClient = new TerraQueryClient({
    defaultOptions: {
        queries: {
            gcTime: duration.days(1),
            retry: (failureCount, error) => {
                if (
                    error instanceof HttpException &&
                    error.status >= 400 &&
                    error.status < 500 &&
                    error.status !== 401
                ) {
                    // don't retry for client errors
                    return false
                }

                return failureCount < 3
            },
        },
    },
})

export interface QueryClientHost {
    queryClient: QueryClient
    queryClientReady?: Promise<void>
}

export const QueryClientMixin = <T extends Constructor<LitElement>>(Base: T) => {
    class WithQueryClient extends Base implements QueryClientHost {
        queryClient: QueryClient = sharedQueryClient
        queryClientReady?: Promise<void>

        connectedCallback() {
            if (++mountCount === 1) {
                this.queryClient.mount()
            }
            this.queryClientReady = ensureRestored(this.queryClient)
            super.connectedCallback()
        }

        disconnectedCallback() {
            super.disconnectedCallback()
            this.queryClientReady = undefined
            if (--mountCount === 0) {
                if (this.queryClient instanceof TerraQueryClient) {
                    this.queryClient.stopPersistenceSubscription()
                }
                this.queryClient.unmount?.()
            }
        }
    }

    return WithQueryClient as unknown as T & Constructor<QueryClientHost>
}
