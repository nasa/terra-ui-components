import {
    IndexedDbStores,
    deleteDataByKey,
    getDataByKey,
    storeDataByKey,
} from '../../internal/indexeddb.js'

export const TIME_AVERAGE_MAP_CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000 // 7 days

export interface TimeAvgMapCacheEntry {
    key: string
    cachedAt: number
    environment?: string
    blob: Blob
    harmonyJobId?: string
}

export class TimeAvgMapCacheService {
    getCacheKey(
        collection: string,
        variable: string,
        startDate: string,
        endDate: string,
        location: string,
        environment?: string,
    ): string {
        const normalizedEnv = environment ?? 'prod'
        return `map_${collection}_${variable}_${startDate}_${endDate}_${location}_${normalizedEnv}`
    }

    async getValidCacheEntry(
        cacheKey: string,
    ): Promise<TimeAvgMapCacheEntry | undefined> {
        if (!cacheKey) return undefined

        const existing = await getDataByKey<TimeAvgMapCacheEntry>(
            IndexedDbStores.TIME_AVERAGE_MAP,
            cacheKey,
        )

        if (!existing) return undefined

        if (!this.isCacheValid(existing)) {
            await deleteDataByKey(IndexedDbStores.TIME_AVERAGE_MAP, cacheKey)
            return undefined
        }

        return existing
    }

    isCacheValid(entry?: TimeAvgMapCacheEntry): boolean {
        if (!entry?.cachedAt) return false
        return Date.now() - entry.cachedAt <= TIME_AVERAGE_MAP_CACHE_TTL_MS
    }

    async storeEntry(
        cacheKey: string,
        entry: Omit<TimeAvgMapCacheEntry, 'key' | 'cachedAt'>,
    ): Promise<void> {
        await storeDataByKey(IndexedDbStores.TIME_AVERAGE_MAP, cacheKey, {
            key: cacheKey,
            cachedAt: Date.now(),
            ...entry,
        })
    }
}

export default TimeAvgMapCacheService
