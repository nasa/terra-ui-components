import type { PersistedClient, Persister } from '@tanstack/query-persist-client-core'
import { openDB } from 'idb'

export interface IDBPersisterOptions {
    dbName: string
    storeName: string
}

/**
 * Cached database connection promise keyed by database name.
 *
 * Caching the open promise (rather than opening a new connection handle on every
 * `createIDBPersister` invocation or waiting for resolution) prevents resource
 * leaks from unclosed database connections across repeated component mounts.
 * It also ensures concurrent callers share the single in-flight connection and
 * schema upgrade request, avoiding version change collisions and lock contention.
 */
const dbPromiseCache = new Map<string, ReturnType<typeof openDB>>()

/**
 * Creates an Indexed DB persister for Tanstack Query to persist API responses to IndexedDB
 * @see https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API
 */
export function createIDBPersister(
    idbValidKey: IDBValidKey,
    options: IDBPersisterOptions
) {
    const dbName = options.dbName
    const storeName = options.storeName

    let dbPromise = dbPromiseCache.get(dbName)

    if (!dbPromise) {
        dbPromise = openDB(dbName, 1, {
            upgrade(db) {
                if (!db.objectStoreNames.contains(storeName)) {
                    db.createObjectStore(storeName)
                }
            },
        })
        dbPromiseCache.set(dbName, dbPromise)
    }

    return {
        persistClient: async (client: PersistedClient) => {
            const db = await dbPromise
            await db.put(storeName, client, idbValidKey)
        },
        restoreClient: async () => {
            const db = await dbPromise
            return await db.get(storeName, idbValidKey)
        },
        removeClient: async () => {
            const db = await dbPromise
            await db.delete(storeName, idbValidKey)
        },
    } satisfies Persister
}
