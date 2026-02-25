import type { QueryObserverOptions } from '@tanstack/query-core'
import nasaCmrApi from '../apis/nasa-cmr.api.js'
import type { RequestOptions } from '../apis/types.js'

export function queryCmrCollection(
    collectionEntryId?: string,
    options?: RequestOptions
): QueryObserverOptions<Awaited<
    ReturnType<typeof nasaCmrApi.getCollectionByEntryId>
> | null> {
    return {
        queryKey: ['cmr', 'collection', collectionEntryId],
        queryFn: async ({ signal }) => {
            return nasaCmrApi.getCollectionByEntryId(collectionEntryId, {
                ...options,
                signal,
            })
        },
        enabled: !!collectionEntryId, // prevent firing when collectionEntryId is undefined
    }
}
