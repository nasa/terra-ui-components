import { openDB, type IDBPDatabase } from 'idb'

const DB_NAME = 'edux'

export enum IndexedDbStores {
    TIME_SERIES = 'time-series',
}

/**
 * Get the indexedDB database
 */
export async function getDb() {
    return await openDB(DB_NAME, 1, {
        upgrade(db) {
            db.createObjectStore(IndexedDbStores.TIME_SERIES, {
                keyPath: 'variableEntryId',
            })
        },
    })
}

/**
 * a helper for wrapping code that depends on an active database connection
 * this function will open the database, run the callback, and then cleanly close the database
 */
export async function withDb<T>(callback: (db: IDBPDatabase) => Promise<T>) {
    const db = await getDb()

    try {
        return await callback(db)
    } finally {
        await db.close()
    }
}

export function getDataByKey<T>(store: IndexedDbStores, key: string): Promise<T> {
    console.log('look for ', key)

    return withDb(async db => {
        return await db.get(store, key)
    })
}

export function storeDataByKey<T>(store: IndexedDbStores, key: string, data: T) {
    return withDb(async db => {
        await db.put(store, {
            key,
            ...data,
        })
    })
}
