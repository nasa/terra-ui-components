import { openDB, type IDBPDatabase } from 'idb'
import type { TimeSeriesData } from './time-series.types.js'

const INDEXEDDB_NAME = 'time-series'
const STORE_NAME = 'time-series-data'

export type VariableDbEntry = TimeSeriesData & {
    variableEntryId: string
    startDate: string
    endDate: string
}

/**
 * Get the indexedDB database
 */
export async function getDb() {
    return await openDB(INDEXEDDB_NAME, 1, {
        upgrade(db) {
            db.createObjectStore(STORE_NAME, {
                keyPath: 'variableEntryId',
            })
        },
    })
}

/**
 * a helper for wrapping code that depends on an active database connection
 * this function will open the database, run the callback, and then close the database
 */
export async function withDb<T>(callback: (db: IDBPDatabase) => Promise<T>) {
    const db = await getDb()

    try {
        return await callback(db)
    } finally {
        await db.close()
    }
}

/**
 * retrieve any downloaded data we have for the given variable
 */
export function getDownloadDataForVariable(
    variableEntryId: string
): Promise<VariableDbEntry> {
    console.log('look for ', variableEntryId)

    return withDb(async db => {
        return await db.get(STORE_NAME, variableEntryId)
    })
}

export function storeDataForVariable(variableEntryId: string, data: TimeSeriesData) {
    return withDb(async db => {
        await db.put(STORE_NAME, {
            variableEntryId,
            startDate: data.data[0].timestamp,
            endDate: data.data[data.data.length - 1].timestamp,
            ...data,
        })
    })
}
