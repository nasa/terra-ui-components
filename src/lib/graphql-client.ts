import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client/core'
import { CachePersistor } from 'apollo3-cache-persist'
import localforage from 'localforage'

localforage.config({
    name: 'terra-general-cache',
    storeName: 'terra-general-cache-store',
    description: 'General cache for the Terra Component Library',
})

class GraphQLClientManager {
    private static instance: GraphQLClientManager
    private client: ApolloClient<any>
    private initializationPromise: Promise<void>

    private constructor() {
        const cache = new InMemoryCache()
        const persistor = new CachePersistor({
            cache,
            storage: {
                getItem: async (key: string) => {
                    return await localforage.getItem(key)
                },
                setItem: async (key: string, value: any) => {
                    return await localforage.setItem(key, value)
                },
                removeItem: async (key: string) => {
                    return await localforage.removeItem(key)
                },
            },
            debug: process.env.NODE_ENV === 'development',
        })

        this.client = new ApolloClient({
            link: new HttpLink({
                uri: 'https://u2u5qu332rhmxpiazjcqz6gkdm.appsync-api.us-east-1.amazonaws.com/graphql',
                headers: {
                    'x-api-key': 'da2-hg7462xbijdjvocfgx2xlxuytq',
                },
            }),
            cache,
            defaultOptions: {
                query: {
                    fetchPolicy: 'cache-first',
                },
            },
        })

        this.initializationPromise = persistor.restore().catch(error => {
            console.error('Error restoring Apollo cache:', error)
        })
    }

    public static getInstance(): GraphQLClientManager {
        if (!GraphQLClientManager.instance) {
            GraphQLClientManager.instance = new GraphQLClientManager()
        }
        return GraphQLClientManager.instance
    }

    public async getClient(): Promise<ApolloClient<any>> {
        await this.initializationPromise
        return this.client
    }
}

// Export a function that returns the initialized client
export async function getGraphQLClient(): Promise<ApolloClient<any>> {
    return await GraphQLClientManager.getInstance().getClient()
}
