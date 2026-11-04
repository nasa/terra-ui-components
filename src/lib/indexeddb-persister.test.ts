import type { PersistedClient } from '@tanstack/query-persist-client-core'
import { expect } from '@open-wc/testing'
import { deleteDB } from 'idb'
import { clearIDBConnectionCache, createIDBPersister } from './indexeddb-persister.js'

describe('createIDBPersister', () => {
    const testDbNames = new Set<string>()

    function getUniqueDbName(prefix = 'test-idb') {
        const name = `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
        testDbNames.add(name)
        return name
    }

    const sampleClient: PersistedClient = {
        timestamp: Date.now(),
        buster: 'v1',
        clientState: {
            queries: [],
            mutations: [],
        },
    }

    afterEach(async () => {
        await clearIDBConnectionCache()
        for (const dbName of testDbNames) {
            try {
                await deleteDB(dbName)
            } catch {
                // Ignore cleanup errors
            }
        }
        testDbNames.clear()
    })

    it('persists and restores client state for a single store', async () => {
        const dbName = getUniqueDbName()
        const persister = createIDBPersister('testKey', {
            dbName,
            storeName: 'query-client',
        })

        await persister.persistClient(sampleClient)
        const restored = await persister.restoreClient()

        expect(restored).to.deep.equal(sampleClient)
    })

    it('removes persisted client state', async () => {
        const dbName = getUniqueDbName()
        const persister = createIDBPersister('testKey', {
            dbName,
            storeName: 'query-client',
        })

        await persister.persistClient(sampleClient)
        await persister.removeClient()
        const restored = await persister.restoreClient()

        expect(restored).to.be.undefined
    })

    it('supports multiple stores on the same database name without NotFoundError', async () => {
        const dbName = getUniqueDbName()

        const persister1 = createIDBPersister('key1', {
            dbName,
            storeName: 'first-store',
        })
        const client1: PersistedClient = {
            ...sampleClient,
            buster: 'store-1',
        }
        await persister1.persistClient(client1)

        // Second persister shares dbName but targets a different store
        const persister2 = createIDBPersister('key2', {
            dbName,
            storeName: 'second-store',
        })
        const client2: PersistedClient = {
            ...sampleClient,
            buster: 'store-2',
        }
        await persister2.persistClient(client2)

        // Both stores should be accessible and maintain separate data
        const restored1 = await persister1.restoreClient()
        const restored2 = await persister2.restoreClient()

        expect(restored1).to.deep.equal(client1)
        expect(restored2).to.deep.equal(client2)
    })

    it('handles concurrent operations across multiple stores on the same database', async () => {
        const dbName = getUniqueDbName()

        const persisterA = createIDBPersister('keyA', {
            dbName,
            storeName: 'concurrent-store-a',
        })
        const persisterB = createIDBPersister('keyB', {
            dbName,
            storeName: 'concurrent-store-b',
        })

        const clientA: PersistedClient = {
            ...sampleClient,
            buster: 'concurrent-a',
        }
        const clientB: PersistedClient = {
            ...sampleClient,
            buster: 'concurrent-b',
        }

        // Persist concurrently
        await Promise.all([
            persisterA.persistClient(clientA),
            persisterB.persistClient(clientB),
        ])

        const [restoredA, restoredB] = await Promise.all([
            persisterA.restoreClient(),
            persisterB.restoreClient(),
        ])

        expect(restoredA).to.deep.equal(clientA)
        expect(restoredB).to.deep.equal(clientB)
    })
})
