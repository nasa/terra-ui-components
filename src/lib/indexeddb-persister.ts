import type { PersistedClient, Persister } from '@tanstack/query-persist-client-core'
import { type IDBPDatabase, openDB } from 'idb'

export interface IDBPersisterOptions {
    dbName: string
    storeName: string
}

/**
 * Registry of all requested store names grouped by database name.
 * Registered stores are created during initial database creation or subsequent version upgrades.
 */
const requestedStoresByDb = new Map<string, Set<string>>()

/**
 * Currently active database connections keyed by database name.
 */
const activeDbs = new Map<string, IDBPDatabase>()

/**
 * Serialization queue per database name to prevent concurrent version upgrade collisions.
 */
const dbQueues = new Map<string, Promise<unknown>>()

/**
 * Enqueues an asynchronous operation for a specific database to ensure sequential schema management.
 */
function enqueueDbTask<T>(dbName: string, task: () => Promise<T>): Promise<T> {
    const prevQueue = dbQueues.get(dbName) ?? Promise.resolve()

    let resolveResult!: (value: T) => void
    let rejectResult!: (error: unknown) => void
    const resultPromise = new Promise<T>((resolve, reject) => {
        resolveResult = resolve
        rejectResult = reject
    })

    const run = async () => {
        try {
            await prevQueue
        } catch {
            // Ignore previous errors so subsequent operations do not stall
        }
        try {
            const result = await task()
            resolveResult(result)
        } catch (error) {
            rejectResult(error)
        }
    }

    dbQueues.set(dbName, run())
    return resultPromise
}

/**
 * Retrieves an open IDBPDatabase instance guaranteed to have `storeName` created.
 * Upgrades the schema if the store does not yet exist.
 */
async function getDb(dbName: string, storeName: string): Promise<IDBPDatabase> {
    return enqueueDbTask(dbName, async () => {
        const existingDb = activeDbs.get(dbName)
        if (existingDb && existingDb.objectStoreNames.contains(storeName)) {
            return existingDb
        }

        let requestedStores = requestedStoresByDb.get(dbName)
        if (!requestedStores) {
            requestedStores = new Set<string>()
            requestedStoresByDb.set(dbName, requestedStores)
        }
        requestedStores.add(storeName)

        const upgradeStores = (db: IDBPDatabase) => {
            for (const store of requestedStores) {
                if (!db.objectStoreNames.contains(store)) {
                    db.createObjectStore(store)
                }
            }
        }

        let db: IDBPDatabase

        if (!existingDb) {
            // First time opening this database in the session.
            // Calling openDB without a version opens at the current version on disk,
            // or fires upgradeneeded at version 1 if the database does not exist yet.
            db = await openDB(dbName, undefined, {
                upgrade(upgradedDb) {
                    upgradeStores(upgradedDb)
                },
                blocking() {
                    const active = activeDbs.get(dbName)
                    if (active) {
                        active.close()
                        activeDbs.delete(dbName)
                    }
                },
                terminated() {
                    activeDbs.delete(dbName)
                },
            })

            // If the database already existed on disk at an earlier version without this store,
            // upgrade it to version + 1.
            if (!db.objectStoreNames.contains(storeName)) {
                const nextVersion = db.version + 1
                db.close()
                db = await openDB(dbName, nextVersion, {
                    upgrade(upgradedDb) {
                        upgradeStores(upgradedDb)
                    },
                    blocking() {
                        const active = activeDbs.get(dbName)
                        if (active) {
                            active.close()
                            activeDbs.delete(dbName)
                        }
                    },
                    terminated() {
                        activeDbs.delete(dbName)
                    },
                })
            }
        } else {
            // An active connection exists, but lacks storeName; close and upgrade.
            const nextVersion = existingDb.version + 1
            existingDb.close()
            activeDbs.delete(dbName)

            db = await openDB(dbName, nextVersion, {
                upgrade(upgradedDb) {
                    upgradeStores(upgradedDb)
                },
                blocking() {
                    const active = activeDbs.get(dbName)
                    if (active) {
                        active.close()
                        activeDbs.delete(dbName)
                    }
                },
                terminated() {
                    activeDbs.delete(dbName)
                },
            })
        }

        activeDbs.set(dbName, db)
        return db
    })
}

/**
 * Executes a database operation against a specific store, automatically retrying once
 * if a concurrent schema upgrade closed the previous connection handle.
 */
async function withStore<T>(
    dbName: string,
    storeName: string,
    operation: (db: IDBPDatabase) => Promise<T>
): Promise<T> {
    const db = await getDb(dbName, storeName)
    try {
        return await operation(db)
    } catch (err) {
        if (err instanceof DOMException && err.name === 'InvalidStateError') {
            const freshDb = await getDb(dbName, storeName)
            return await operation(freshDb)
        }
        throw err
    }
}

/**
 * Closes and clears cached database connections and registrations.
 * Useful for test suites that delete databases between tests.
 */
export async function clearIDBConnectionCache(dbName?: string): Promise<void> {
    if (dbName) {
        const db = activeDbs.get(dbName)
        if (db) {
            db.close()
            activeDbs.delete(dbName)
        }
        requestedStoresByDb.delete(dbName)
        dbQueues.delete(dbName)
    } else {
        for (const db of activeDbs.values()) {
            db.close()
        }
        activeDbs.clear()
        requestedStoresByDb.clear()
        dbQueues.clear()
    }
}

/**
 * Creates an IndexedDB persister for TanStack Query to persist state across reloads.
 *
 * Automatically manages database version upgrades when multiple stores share the same
 * database name, serializing schema alterations to avoid version change collisions.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API
 */
export function createIDBPersister(
    idbValidKey: IDBValidKey,
    options: IDBPersisterOptions
): Persister {
    const { dbName, storeName } = options

    let requestedStores = requestedStoresByDb.get(dbName)
    if (!requestedStores) {
        requestedStores = new Set<string>()
        requestedStoresByDb.set(dbName, requestedStores)
    }
    requestedStores.add(storeName)

    return {
        persistClient: async (client: PersistedClient) => {
            await withStore(dbName, storeName, db =>
                db.put(storeName, client, idbValidKey)
            )
        },
        restoreClient: async () => {
            return await withStore(dbName, storeName, db =>
                db.get(storeName, idbValidKey)
            )
        },
        removeClient: async () => {
            await withStore(dbName, storeName, db =>
                db.delete(storeName, idbValidKey)
            )
        },
    } satisfies Persister
}
