import { gql } from '@apollo/client/core'

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
