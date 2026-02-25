import type { QueryObserverOptions } from '@tanstack/query-core'
import nasaHarmonyApi from '../apis/nasa-harmony.api.js'
import type { RequestOptions } from '../apis/types.js'

export function queryHarmonyCapabilities(
    collectionConceptId?: string,
    options?: RequestOptions
): QueryObserverOptions<Awaited<
    ReturnType<typeof nasaHarmonyApi.getCollectionCapabilities>
> | null> {
    return {
        queryKey: ['harmony', 'capabilities', collectionConceptId],
        queryFn: async () => {
            return nasaHarmonyApi.getCollectionCapabilities(
                collectionConceptId,
                options
            )
        },
        enabled: !!collectionConceptId, // prevent firing when collectionConceptId is undefined
    }
}
