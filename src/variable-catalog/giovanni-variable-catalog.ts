import { graphQLClient } from '../lib/graphql-client.js'
import { GET_SEARCH_KEYWORDS } from './queries.js'
import type { SearchKeywordsResponse, VariableCatalogInterface } from './types.js'

export class GiovanniVariableCatalog implements VariableCatalogInterface {
    async getSearchKeywords() {
        const response = await graphQLClient.query<{
            aesirKeywords: SearchKeywordsResponse
        }>({
            query: GET_SEARCH_KEYWORDS,
            fetchPolicy: 'cache-first',
        })

        if (response.errors) {
            throw new Error(
                `Failed to fetch search keywords: ${response.errors[0].message}`
            )
        }

        return response.data!.aesirKeywords
    }
}
