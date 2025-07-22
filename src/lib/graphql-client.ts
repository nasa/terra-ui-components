import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client/core'
import { CachePersistor } from 'apollo3-cache-persist'
import localforage from 'localforage'

const CACHE_TIMESTAMP_KEY = 'terra-general-cache-timestamp'
const CACHE_TTL_MS = 6 * 60 * 60 * 1000 // 6 hours in milliseconds

localforage.config({
    name: 'terra-general-cache',
    storeName: 'terra-general-cache-store',
    description: 'General cache for the Terra Component Library',
})

class GraphQLClientManager {
    private static instance: GraphQLClientManager
    private clients: Map<string, ApolloClient<any>> = new Map()
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

        this.clients.set('terra', this.getTerraGraphQLClient(cache))
        this.clients.set('cmr', this.getCmrGraphQLClient(cache))

        this.initializationPromise = this.initCache(persistor)
    }

    private getTerraGraphQLClient(cache: InMemoryCache) {
        return new ApolloClient({
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
    }

    private getCmrGraphQLClient(cache: InMemoryCache) {
        return new ApolloClient({
            link: new HttpLink({
                uri: 'https://graphql.earthdata.nasa.gov/api',
            }),
            cache,
            defaultOptions: {
                query: {
                    fetchPolicy: 'cache-first',
                },
            },
        })
    }

    private async initCache(persistor: CachePersistor<any>): Promise<void> {
        try {
            const timestamp = await localforage.getItem<number>(CACHE_TIMESTAMP_KEY)
            const now = Date.now()
            if (!timestamp || now - timestamp > CACHE_TTL_MS) {
                console.log('purging cache')
                await persistor.purge()
                await localforage.setItem(CACHE_TIMESTAMP_KEY, now)
            } else {
                console.log('restoring cache')
                await persistor.restore()
            }
        } catch (error) {
            console.error('Error initializing Apollo cache:', error)
        }
    }

    public static getInstance(): GraphQLClientManager {
        if (!GraphQLClientManager.instance) {
            GraphQLClientManager.instance = new GraphQLClientManager()
        }
        return GraphQLClientManager.instance
    }

    public async getClient(clientKey: string = 'terra'): Promise<ApolloClient<any>> {
        await this.initializationPromise
        return this.clients.get(clientKey)!
    }
}

// Export a function that returns the initialized client
export async function getGraphQLClient(
    clientKey?: string
): Promise<ApolloClient<any>> {
    return await GraphQLClientManager.getInstance().getClient(clientKey)
}
