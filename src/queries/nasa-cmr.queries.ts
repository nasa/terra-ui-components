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

export function queryCmrGranules(
    searchParams: Parameters<typeof nasaCmrApi.searchGranules>[0],
    options?: RequestOptions
): QueryObserverOptions<Awaited<
    ReturnType<typeof nasaCmrApi.searchGranules>
> | null> {
    return {
        queryKey: ['cmr', 'granules', searchParams],
        queryFn: async ({ signal }) => {
            return nasaCmrApi.searchGranules(searchParams, {
                ...options,
                signal,
            })
        },
        enabled:
            !!searchParams.collectionEntryId || !!searchParams.collectionConceptId, // prevent firing when collectionEntryId and collectionConceptId are undefined
    }
}

export function queryCmrVariables(
    searchParams: Parameters<typeof nasaCmrApi.searchVariables>[0],
    options?: RequestOptions
): QueryObserverOptions<Awaited<
    ReturnType<typeof nasaCmrApi.searchVariables>
> | null> {
    return {
        queryKey: ['cmr', 'variables', searchParams],
        queryFn: async ({ signal }) => {
            return nasaCmrApi.searchVariables(searchParams, {
                ...options,
                signal,
            })
        },
        enabled: !!searchParams.collectionConceptId, // prevent firing when collectionConceptId is undefined
    }
}
