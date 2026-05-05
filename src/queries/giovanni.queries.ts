import type { QueryObserverOptions } from '@tanstack/query-core'
import giovanniApi from '../apis/giovanni.api.js'

export function queryGiovanniConfiguredVariables(): QueryObserverOptions<Awaited<
    ReturnType<typeof giovanniApi.getConfiguredVariables>
> | null> {
    return {
        queryKey: ['giovanni', 'configuredVariables'],
        queryFn: async ({ signal }) => {
            return giovanniApi.getConfiguredVariables({
                signal,
            })
        },
    }
}
