import type { LitElement } from 'lit'
import { QueryClient } from '@tanstack/query-core'
import { persistQueryClient } from '@tanstack/query-persist-client-core'
import { HttpException } from '../exceptions/http.exception.js'
import { createIDBPersister } from '../lib/indexeddb-persister.js'

const fifteenMinutesMs = 1000 * 60 * 15

export const sharedQueryClient = new QueryClient({
    defaultOptions: {
        queries: {
            gcTime: fifteenMinutesMs,
            retry: (failureCount, error) => {
                if (
                    error instanceof HttpException &&
                    error.status >= 400 &&
                    error.status < 500
                ) {
                    // don't retry for client errors
                    return false
                }

                return failureCount < 3
            },
        },
    },
})

export type Constructor<T = object> = new (...args: any[]) => T

let mountCount = 0
let mountPromise: Promise<void> | undefined
let persistUnsubscribe: (() => void) | undefined

const ensureMounted = (queryClient: QueryClient) => {
    if (!mountPromise) {
        const persister = createIDBPersister('terraQuery', {
            dbName: 'terra-query',
            storeName: 'query-client',
        })

        const [unsubscribe, restorePromise] = persistQueryClient({
            queryClient,
            persister,
            maxAge: fifteenMinutesMs,
        })
        persistUnsubscribe = unsubscribe
        mountPromise = restorePromise
            .catch(() => undefined)
            .then(() => {
                queryClient.mount()
            })
    }

    return mountPromise
}

export interface QueryClientHost {
    queryClient: QueryClient
}

export const QueryClientMixin = <T extends Constructor<LitElement>>(Base: T) => {
    class WithQueryClient extends Base implements QueryClientHost {
        queryClient: QueryClient = sharedQueryClient

        connectedCallback() {
            super.connectedCallback()
            if (++mountCount === 1) void ensureMounted(this.queryClient)
        }

        disconnectedCallback() {
            super.disconnectedCallback()
            if (--mountCount === 0) {
                if (mountPromise) {
                    void mountPromise.then(() => {
                        persistUnsubscribe?.()
                        this.queryClient.unmount()
                    })
                } else {
                    persistUnsubscribe?.()
                    this.queryClient.unmount()
                }
            }
        }
    }

    return WithQueryClient as unknown as T & Constructor<QueryClientHost>
}
