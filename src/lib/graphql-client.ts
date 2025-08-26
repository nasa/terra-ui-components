import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client/core'
import { CachePersistor } from 'apollo3-cache-persist'
import localforage from 'localforage'

const CACHE_TIMESTAMP_KEY = 'terra-general-cache-timestamp'
const CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds

localforage.config({
    name: 'terra-general-cache',
    storeName: 'terra-general-cache-store',
    description: 'General cache for the Terra Component Library',
})

class GraphQLClientManager {
    private static instance: GraphQLClientManager
    private clients: Map<string, ApolloClient<any>> = new Map()
    private initializationPromise: Promise<void>
    private persistor: CachePersistor<any>

    private constructor() {
        const cache = new InMemoryCache()
        this.persistor = new CachePersistor({
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

        this.initializationPromise = this.initCache(this.persistor)
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
                await persistor.purge()
                await localforage.setItem(CACHE_TIMESTAMP_KEY, now)
            } else {
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

    public async purgeCache() {
        localforage.clear()
        await this.clients.forEach(client => client.resetStore())
    }
}

export async function purgeGraphQLCache() {
    await GraphQLClientManager.getInstance().purgeCache()
}

export async function getGraphQLClient(
    clientKey?: string
): Promise<ApolloClient<any>> {
    return await GraphQLClientManager.getInstance().getClient(clientKey)
}
