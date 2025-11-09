import { gql } from '@apollo/client/core'
import { getGraphQLClient } from '../lib/graphql-client.js'
import {
    GET_CMR_GRANULES_BY_ENTRY_ID,
    GET_CMR_COLLECTION_CITATIONS_BY_ENTRY_ID,
    GET_CMR_SEARCH_RESULTS_ALL,
    GET_CMR_SEARCH_RESULTS_COLLECTIONS,
    GET_CMR_SEARCH_RESULTS_VARIABLES,
} from './queries.js'
import {
    type CmrSearchResultsResponse,
    type CmrSearchResult,
    type MetadataCatalogInterface,
    type SearchOptions,
    type CmrGranulesResponse,
    type CmrSamplingOfGranulesResponse,
    type CloudCoverRange,
    type CmrCollectionCitationsResponse,
    type CmrCollectionCitationItem,
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

    async getGranules(collectionEntryId: string, options?: SearchOptions) {
        const client = await getGraphQLClient('cmr')

        const response = await client.query<CmrGranulesResponse>({
            query: GET_CMR_GRANULES_BY_ENTRY_ID,
            variables: {
                collectionEntryId,
                limit: options?.limit ?? 50,
                offset: options?.offset ?? 0,
                sortKey: this.#getGranuleSortKey(
                    options?.sortBy ?? 'title',
                    options?.sortDirection ?? 'asc'
                ),
                search: options?.search ? [`*${options.search}*`] : undefined,
                temporal:
                    options?.startDate && options?.endDate
                        ? `${options.startDate},${options.endDate}`
                        : undefined,
                boundingBox:
                    options?.location?.type === 'bbox'
                        ? options.location.bounds.toBBoxString()
                        : undefined,
                cloudCover:
                    options?.cloudCover?.min && options?.cloudCover?.max
                        ? `${options.cloudCover.min ?? ''},${options.cloudCover.max ?? ''}`
                        : undefined,
            },
            context: {
                fetchOptions: {
                    signal: options?.signal,
                },
            },
            fetchPolicy: 'network-only',
        })

        if (response.errors) {
            throw new Error(`Failed to fetch granules: ${response.errors[0].message}`)
        }

        return response.data
    }

    async getSamplingOfGranules(collectionEntryId: string, options?: SearchOptions) {
        const client = await getGraphQLClient('cmr')

        const response = await client.query<CmrSamplingOfGranulesResponse>({
            query: gql`
                query Collections($collectionEntryId: String!) {
                    collections(params: { entryId: [$collectionEntryId] }) {
                        items {
                            conceptId
                            firstGranules: granules(
                                params: { limit: 2, sortKey: "startDate" }
                            ) {
                                count
                                items {
                                    dataGranule
                                }
                            }
                            lastGranules: granules(
                                params: { limit: 2, sortKey: "-endDate" }
                            ) {
                                count
                                items {
                                    dataGranule
                                }
                            }
                        }
                    }
                }
            `,
            variables: {
                collectionEntryId,
            },
            context: {
                fetchOptions: {
                    signal: options?.signal,
                },
            },
            fetchPolicy: 'network-only',
        })

        if (response.errors) {
            throw new Error(`Failed to fetch granules: ${response.errors[0].message}`)
        }

        return response.data
    }

    async getCloudCoverRange(
        collectionEntryId: string,
        options?: SearchOptions
    ): Promise<CloudCoverRange | null> {
        const client = await getGraphQLClient('cmr')

        const response = await client.query({
            query: gql`
                query Collections($collectionEntryId: String!) {
                    collections(params: { entryId: [$collectionEntryId] }) {
                        items {
                            lowestCloudCover: granules(
                                params: { sortKey: "cloudCover", limit: 1 }
                            ) {
                                items {
                                    cloudCover
                                }
                            }
                            highestCloudCover: granules(
                                params: { sortKey: "-cloudCover", limit: 1 }
                            ) {
                                items {
                                    cloudCover
                                }
                            }
                        }
                    }
                }
            `,
            variables: {
                collectionEntryId,
            },
            context: {
                fetchOptions: {
                    signal: options?.signal,
                },
            },
            fetchPolicy: 'network-only',
        })

        if (response.errors) {
            throw new Error(`Failed to fetch granules: ${response.errors[0].message}`)
        }

        console.log(
            'Response data: ',
            response.data,
            response.data.collections.items[0].lowestCloudCover.items[0].cloudCover,
            response.data.collections.items[0].highestCloudCover.items[0].cloudCover
        )

        if (
            typeof response.data.collections.items[0].lowestCloudCover.items[0]
                .cloudCover === 'number' &&
            typeof response.data.collections.items[0].highestCloudCover.items[0]
                .cloudCover === 'number'
        ) {
            console.log('Returning cloud cover range: ', {
                min: response.data.collections.items[0].lowestCloudCover.items[0]
                    .cloudCover,
                max: response.data.collections.items[0].highestCloudCover.items[0]
                    .cloudCover,
            })

            return {
                min: response.data.collections.items[0].lowestCloudCover.items[0]
                    .cloudCover,
                max: response.data.collections.items[0].highestCloudCover.items[0]
                    .cloudCover,
            }
        }

        return null
    }

    async getCollectionCitation(
        collectionEntryId: string,
        options?: SearchOptions
    ): Promise<CmrCollectionCitationItem> {
        const client = await getGraphQLClient('cmr')

        const response = await client.query<CmrCollectionCitationsResponse>({
            query: GET_CMR_COLLECTION_CITATIONS_BY_ENTRY_ID,
            variables: {
                entryId: collectionEntryId,
            },
            context: {
                fetchOptions: {
                    signal: options?.signal,
                },
            },
            fetchPolicy: 'network-only',
        })

        if (
            response.errors ||
            response.data.collections.items.length === 0 ||
            response.data.collections.items[0].collectionCitations.length === 0
        ) {
            throw new Error(
                `Failed to retrieve collection citations from CMR: ${response.errors?.[0]?.message}`
            )
        }

        return response.data.collections.items[0]
    }

    /**
     * the GraphQL properties and the sort keys differ (https://cmr.earthdata.nasa.gov/search/site/docs/search/api.html#sorting-granule-results)
     * this function returns the correct sort key for the GraphQL query
     */
    #getGranuleSortKey(sortBy: string, sortDirection: string) {
        let sortKey = sortBy

        switch (sortBy) {
            case 'title':
                sortKey = 'granuleUr' // not a typo, this should NOT be "granuleUrl"
                break
            case 'size':
                sortKey = 'dataSize'
                break
            case 'timeStart':
                sortKey = 'startDate'
                break
            case 'timeEnd':
                sortKey = 'endDate'
                break
        }

        return sortDirection === 'asc' ? sortKey : `-${sortKey}`
    }
}
