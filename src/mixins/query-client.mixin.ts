import { QueryClient } from '@tanstack/query-core'
import { persistQueryClient } from '@tanstack/query-persist-client-core'
import type { LitElement } from 'lit'
import { duration } from '../constants.js'
import { HttpException } from '../exceptions/http.exception.js'
import { createIDBPersister } from '../lib/indexeddb-persister.js'
import type { Constructor } from './mixin.types.js'

export const sharedQueryClient = new QueryClient({
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
            maxAge: duration.days(1),
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
    queryClientReady?: Promise<void>
}

export const QueryClientMixin = <T extends Constructor<LitElement>>(Base: T) => {
    class WithQueryClient extends Base implements QueryClientHost {
        queryClient: QueryClient = sharedQueryClient
        queryClientReady?: Promise<void>

        connectedCallback() {
            if (++mountCount === 1) {
                this.queryClientReady = ensureMounted(this.queryClient)
            } else {
                this.queryClientReady = mountPromise
            }

            super.connectedCallback()
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
