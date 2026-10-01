import { withDb, IndexedDbStores } from '../../internal/indexeddb.js'

export type ThumbnailRecord = {
    harmonyJobId: string
    blob: Blob
    createdAt: number
}

/**
 * Service for storing and retrieving plot/map thumbnails in the Terra IndexedDB.
 * Records are keyed by Harmony job ID.
 */
export class ThumbnailService {
    async store(harmonyJobId: string, blob: Blob): Promise<void> {
        await withDb(async (db) => {
            const record: ThumbnailRecord = {
                harmonyJobId,
                blob,
                createdAt: Date.now(),
            }
            await db.put(IndexedDbStores.THUMBNAILS, record)
        })
    }

    async get(harmonyJobId: string): Promise<Blob | undefined> {
        return withDb(async (db) => {
            const record: ThumbnailRecord | undefined = await db.get(
                IndexedDbStores.THUMBNAILS,
                harmonyJobId,
            )
            return record?.blob
        })
    }

    async delete(harmonyJobId: string): Promise<void> {
        await withDb(async (db) => {
            await db.delete(IndexedDbStores.THUMBNAILS, harmonyJobId)
        })
    }
}
