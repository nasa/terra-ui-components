import {
    type DefaultError,
    type FetchQueryOptions,
    QueryClient,
    type QueryExecuteOptions,
    type QueryKey,
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

export const queryClientPersister = createIDBPersister('terraQuery', {
    dbName: 'terra-query',
    storeName: 'query-client',
})

let mountCount = 0
let restorePromise: Promise<void> | undefined
let persistUnsubscribe: (() => void) | undefined

const syncPersistenceSubscription = (queryClient: QueryClient) => {
    if (mountCount > 0 && !persistUnsubscribe) {
        persistUnsubscribe = persistQueryClientSubscribe({
            queryClient,
            persister: queryClientPersister,
        })
    }
}

const ensureRestored = (queryClient: QueryClient): Promise<void> => {
    if (!restorePromise) {
        const currentRestore = persistQueryClientRestore({
            queryClient,
            persister: queryClientPersister,
            maxAge: duration.days(1),
        })
            .catch(() => undefined)
            .then(() => {
                if (restorePromise === currentRestore) {
                    syncPersistenceSubscription(queryClient)
                }
            })
        restorePromise = currentRestore
    } else {
        const currentRestore = restorePromise
        void currentRestore.then(() => {
            if (restorePromise === currentRestore) {
                syncPersistenceSubscription(queryClient)
            }
        })
    }

    return restorePromise
}

/**
 * Resets the one-time persistence restore state so tests can simulate a cold-start
 * IndexedDB restoration cycle.
 */
export function resetQueryClientPersistence() {
    persistUnsubscribe?.()
    persistUnsubscribe = undefined
    restorePromise = undefined
}

class TerraQueryClient extends QueryClient {
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
        await ensureRestored(this)
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
        await ensureRestored(this)
        return super.fetchQuery(options)
    }
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
                persistUnsubscribe?.()
                persistUnsubscribe = undefined
                this.queryClient.unmount?.()
            }
        }
    }

    return WithQueryClient as unknown as T & Constructor<QueryClientHost>
}
