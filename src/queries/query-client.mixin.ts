import type { LitElement } from 'lit'
import { QueryClient } from '@tanstack/query-core'
import { HttpException } from '../exceptions/http.exception.js'

export const sharedQueryClient = new QueryClient({
    defaultOptions: {
        queries: {
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

export interface QueryClientHost {
    queryClient: QueryClient
}

export const QueryClientMixin = <T extends Constructor<LitElement>>(Base: T) => {
    class WithQueryClient extends Base implements QueryClientHost {
        queryClient: QueryClient = sharedQueryClient

        connectedCallback() {
            super.connectedCallback()
            if (++mountCount === 1) this.queryClient.mount()
        }

        disconnectedCallback() {
            super.disconnectedCallback()
            if (--mountCount === 0) this.queryClient.unmount()
        }
    }

    return WithQueryClient as unknown as T & Constructor<QueryClientHost>
}
