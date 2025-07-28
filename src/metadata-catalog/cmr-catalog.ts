import { getGraphQLClient } from '../lib/graphql-client.js'
import {
    GET_CMR_SEARCH_RESULTS_ALL,
    GET_CMR_SEARCH_RESULTS_COLLECTIONS,
    GET_CMR_SEARCH_RESULTS_VARIABLES,
} from './queries.js'
import {
    type CmrSearchResultsResponse,
    type CmrSearchResult,
    type MetadataCatalogInterface,
    type SearchOptions,
} from './types.js'

export class CmrCatalog implements MetadataCatalogInterface {
    async searchCmr(
        keyword: string,
        type: 'collection' | 'variable' | 'all',
        options?: SearchOptions
    ): Promise<Array<CmrSearchResult>> {
        const client = await getGraphQLClient('cmr')

        const response = await client.query<CmrSearchResultsResponse>({
            query:
                type === 'collection'
                    ? GET_CMR_SEARCH_RESULTS_COLLECTIONS
                    : type === 'variable'
                      ? GET_CMR_SEARCH_RESULTS_VARIABLES
                      : GET_CMR_SEARCH_RESULTS_ALL,
            variables: {
                keyword,
            },
            context: {
                fetchOptions: {
                    signal: options?.signal,
                },
            },
            fetchPolicy: 'network-only',
        })

        if (response.errors) {
            throw new Error(`Failed to search CMR: ${response.errors[0].message}`)
        }

        const collections: Array<CmrSearchResult> =
            response.data.collections?.items?.map(collection => ({
                type: 'collection',
                collectionConceptId: collection.conceptId,
                collectionEntryId: collection.nativeId,
                summary: collection.title,
                conceptId: collection.conceptId,
                entryId: collection.nativeId,
                provider: collection.provider,
                title: collection.title,
            })) ?? []

        const variables: Array<CmrSearchResult> =
            response.data.variables?.items?.map(variable => ({
                type: 'variable',
                collectionConceptId: variable.collections.items?.[0]?.conceptId,
                collectionEntryId: variable.collections.items?.[0]?.nativeId,
                summary: variable.collections.items?.[0]?.title ?? '',
                conceptId: variable.conceptId,
                entryId: variable.name,
                provider: variable.providerId,
                title: variable.longName,
            })) ?? []

        return [...collections, ...variables]
    }
}
