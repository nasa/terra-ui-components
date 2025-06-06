import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client'
import { CachePersistor } from 'apollo3-cache-persist'
import localforage from 'localforage'

// Configure localforage to use IndexedDB
localforage.config({
    name: 'apollo-cache',
    storeName: 'apollo-cache-store',
    description: 'Apollo Client Cache',
})

const cache = new InMemoryCache()

// Initialize the cache persistor
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
    maxSize: 10485760, // 10MB
    debug: process.env.NODE_ENV === 'development',
})

// Create the client
const graphQLClient = new ApolloClient({
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

// Start restoring the cache
persistor.restore().catch(error => {
    console.error('Error restoring Apollo cache:', error)
})

export { graphQLClient }
