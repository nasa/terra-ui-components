import { gql } from '@apollo/client/core'

export const GET_SEARCH_KEYWORDS = gql`
    query {
        aesirKeywords {
            id
        }
    }
`
