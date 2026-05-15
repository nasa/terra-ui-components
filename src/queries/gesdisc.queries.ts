import type { QueryObserverOptions } from '@tanstack/query-core'
import gesdiscApi from '../apis/gesdisc.api.js'
import type { RequestOptions } from '../lib/api.client.js'

export function queryGesDiscCollection(
    params: {
        collectionEntryId?: string
        collectionConceptId?: string
    },
    options?: RequestOptions
): QueryObserverOptions<Awaited<
    ReturnType<typeof gesdiscApi.getCollectionByEntryId>
> | null> {
    return {
        queryKey: ['gesdisc', 'collection', params.collectionEntryId],
        queryFn: async ({ signal }) => {
            return gesdiscApi.getCollectionByEntryId(params.collectionEntryId, {
                ...options,
                signal,
            })
        },
        // prevent firing when collectionEntryId is undefined or this is not a GES DISC collection
        enabled:
            !!params.collectionEntryId &&
            isGesDiscCollection(params.collectionConceptId),
    }
}

function isGesDiscCollection(conceptId?: string) {
    return conceptId?.endsWith('GES_DISC') ?? false
}
