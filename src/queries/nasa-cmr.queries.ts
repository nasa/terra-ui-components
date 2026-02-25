import type { QueryObserverOptions } from '@tanstack/query-core'
import nasaCmrApi from '../apis/nasa-cmr.api.js'

export function queryCmrCollection(
    collectionEntryId?: string
): QueryObserverOptions<Awaited<
    ReturnType<typeof nasaCmrApi.getCollectionByEntryId>
> | null> {
    return {
        queryKey: ['cmr', 'collection', collectionEntryId],
        queryFn: async () => {
            return nasaCmrApi.getCollectionByEntryId(collectionEntryId)
        },
        enabled: !!collectionEntryId, // prevent firing when collectionEntryId is undefined
    }
}
