import { gql } from '@apollo/client'

export const GET_SEARCH_KEYWORDS = gql`
    query {
        aesirKeywords {
            id
        }
    }
`
