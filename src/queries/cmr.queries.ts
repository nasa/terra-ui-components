import type { QueryObserverOptions } from '@tanstack/query-core'
import cmrApi from '../apis/cmr.api.js'
import { duration } from '../constants.js'
import type { RequestOptions } from '../lib/api.client.js'

export function queryCmrCollection(
    collectionEntryId?: string,
    options?: RequestOptions
): QueryObserverOptions<Awaited<
    ReturnType<typeof cmrApi.getCollectionByEntryId>
> | null> {
    return {
        queryKey: ['cmr', 'collection', collectionEntryId],
        queryFn: async ({ signal }) => {
            return cmrApi.getCollectionByEntryId(collectionEntryId, {
                ...options,
                signal,
            })
        },
        enabled: !!collectionEntryId, // prevent firing when collectionEntryId is undefined
    }
}

export function queryCmrCollectionByConceptId(
    collectionConceptId?: string,
    options?: RequestOptions
): QueryObserverOptions<Awaited<
    ReturnType<typeof cmrApi.getCollectionByConceptId>
> | null> {
    return {
        queryKey: ['cmr', 'collection-by-concept-id', collectionConceptId],
        queryFn: async ({ signal }) => {
            return cmrApi.getCollectionByConceptId(collectionConceptId, {
                ...options,
                signal,
            })
        },
        enabled: !!collectionConceptId, // prevent firing when collectionConceptId is undefined
    }
}

export function queryCmrGranules(
    searchParams: Parameters<typeof cmrApi.searchGranules>[0],
    options?: RequestOptions
): QueryObserverOptions<Awaited<ReturnType<typeof cmrApi.searchGranules>> | null> {
    return {
        queryKey: ['cmr', 'granules', searchParams],
        queryFn: async ({ signal }) => {
            return cmrApi.searchGranules(searchParams, {
                ...options,
                signal,
            })
        },
        enabled:
            !!searchParams.collectionEntryId || !!searchParams.collectionConceptId, // prevent firing when collectionEntryId and collectionConceptId are undefined
    }
}

export function queryCmrVariables(
    searchParams: Parameters<typeof cmrApi.searchVariables>[0],
    options?: RequestOptions
): QueryObserverOptions<Awaited<ReturnType<typeof cmrApi.searchVariables>> | null> {
    return {
        queryKey: ['cmr', 'variables', searchParams],
        queryFn: async ({ signal }) => {
            return cmrApi.searchVariables(searchParams, {
                ...options,
                signal,
            })
        },
        enabled: !!searchParams.collectionConceptId, // prevent firing when collectionConceptId is undefined
    }
}

export function queryCmrCollectionTags(
    collectionId?: string,
    options?: RequestOptions
): QueryObserverOptions<Awaited<ReturnType<typeof cmrApi.getCollectionTags>> | null> {
    return {
        queryKey: ['cmr', 'collection-tags', collectionId],
        queryFn: async ({ signal }) => {
            return cmrApi.getCollectionTags(collectionId as string, {
                ...options,
                signal,
            })
        },
        enabled: !!collectionId, // prevent firing when collectionId is undefined
        staleTime: duration.hours(1),
    }
}

export function queryCmrSampling(
    collectionEntryId?: string,
    options?: RequestOptions
): QueryObserverOptions<Awaited<
    ReturnType<typeof cmrApi.getSamplingOfGranules>
> | null> {
    return {
        queryKey: ['cmr', 'sampling', collectionEntryId],
        queryFn: async ({ signal }) => {
            if (!collectionEntryId) {
                return null
            }
            return cmrApi.getSamplingOfGranules(collectionEntryId, {
                ...options,
                signal,
            })
        },
        enabled: !!collectionEntryId,
    }
}
