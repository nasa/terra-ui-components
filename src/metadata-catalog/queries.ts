import { gql } from '@apollo/client/core'

export const GET_CMR_SEARCH_RESULTS_ALL = gql`
    query GetCMRSearchResultsAll($keyword: String!) {
        collections(params: { keyword: $keyword }) {
            items {
                conceptId
                nativeId
                provider
                title
            }
        }
        variables(params: { keyword: $keyword }) {
            items {
                conceptId
                name
                providerId
                longName
                collections {
                    items {
                        conceptId
                        nativeId
                        title
                    }
                }
            }
        }
    }
`

export const GET_CMR_SEARCH_RESULTS_COLLECTIONS = gql`
    query GetCMRSearchResultsCollections($keyword: String!) {
        collections(params: { keyword: $keyword }) {
            items {
                conceptId
                nativeId
                provider
                title
            }
        }
    }
`

export const GET_CMR_SEARCH_RESULTS_VARIABLES = gql`
    query GetCMRSearchResultsVariables($keyword: String!) {
        variables(params: { keyword: $keyword }) {
            items {
                conceptId
                name
                providerId
                longName
                collections {
                    items {
                        conceptId
                        nativeId
                    }
                }
            }
        }
    }
`

export const GET_CMR_GRANULES_BY_ENTRY_ID = gql`
    query Collections(
        $collectionEntryId: String!
        $search: [String]
        $limit: Int
        $offset: Int
        $sortKey: String
        $temporal: String
        $boundingBox: [String]
    ) {
        collections(params: { entryId: [$collectionEntryId] }) {
            items {
                conceptId
                granules(
                    params: {
                        limit: $limit
                        offset: $offset
                        sortKey: [$sortKey]
                        readableGranuleName: $search
                        options: { readableGranuleName: { pattern: true } }
                        temporal: $temporal
                        boundingBox: $boundingBox
                    }
                ) {
                    count
                    items {
                        conceptId
                        dataGranule
                        title
                        timeEnd
                        timeStart
                        relatedUrls
                    }
                }
            }
        }
    }
`

export const GET_FIRST_AND_LAST_GRANULES_BY_ENTRY_ID = gql`
    query Collections($collectionEntryId: String!) {
        collections(params: { entryId: [$collectionEntryId] }) {
            items {
                conceptId
                firstGranules: granules(params: { limit: 2, sortKey: "startDate" }) {
                    count
                    items {
                        dataGranule
                    }
                }
                lastGranules: granules(params: { limit: 2, sortKey: "-endDate" }) {
                    count
                    items {
                        dataGranule
                    }
                }
            }
        }
    }
`

export const GET_SEARCH_KEYWORDS = gql`
    query {
        aesirKeywords {
            id
        }
    }
`

export const GET_VARIABLES = gql`
    query GetVariables(
        $q: String
        $includeFields: String
        $rows: String
        $filter: FilterInput
        $variableEntryIds: [String]
    ) {
        getVariables(
            q: $q
            includeFields: $includeFields
            rows: $rows
            filter: $filter
            variableEntryIds: $variableEntryIds
        ) {
            count
            total
            variables {
                dataFieldId
                dataProductShortName
                dataProductVersion
                dataFieldShortName
                dataFieldAccessName
                dataFieldLongName
                dataProductLongName
                dataProductTimeInterval
                dataProductWest
                dataProductSouth
                dataProductEast
                dataProductNorth
                dataProductSpatialResolution
                dataProductBeginDateTime
                dataProductEndDateTime
                dataFieldKeywords
                dataFieldUnits
                dataProductDescriptionUrl
                dataFieldDescriptionUrl
                dataProductInstrumentShortName
            }
            facets {
                category
                values {
                    name
                    count
                }
            }
        }
    }
`
