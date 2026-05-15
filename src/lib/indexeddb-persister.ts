import { openDB } from 'idb'
import type { PersistedClient, Persister } from '@tanstack/query-persist-client-core'

export interface IDBPersisterOptions {
    dbName: string
    storeName: string
}

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

    const dbPromise = openDB(dbName, 1, {
        upgrade(db) {
            if (!db.objectStoreNames.contains(storeName)) {
                db.createObjectStore(storeName)
            }
        },
    })

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
