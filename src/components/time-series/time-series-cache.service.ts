import {
    IndexedDbStores,
    deleteDataByKey,
    getDataByKey,
    storeDataByKey,
} from '../../internal/indexeddb.js'
import type {
    TimeSeriesData,
    TimeSeriesDataRow,
    TimeSeriesMetadata,
    VariableDbEntry,
} from './time-series.types.js'

export const TIME_SERIES_CACHE_TTL_MS = 24 * 60 * 60 * 1000 // 24 hours

export class TimeSeriesCacheService {
    getCacheKeyForVariable(
        variableEntryId: string,
        location?: string,
        environment?: string,
    ): string {
        if (!location) {
            return ''
        }

        const normalizedCoordinates = location
            .split(',')
            .map(coord => Number(coord).toFixed(2))
        const normalizedLocation = normalizedCoordinates.join(',%20')
        const normalizedEnvironment = environment ?? 'prod'

        return `${variableEntryId}_${normalizedLocation}_${normalizedEnvironment}`
    }

    async getValidCacheEntry(cacheKey: string): Promise<VariableDbEntry | undefined> {
        if (!cacheKey) {
            return undefined
        }

        const existing = await getDataByKey<VariableDbEntry>(
            IndexedDbStores.TIME_SERIES,
            cacheKey,
        )

        if (!existing) {
            return undefined
        }

        if (!this.isCacheValid(existing)) {
            await deleteDataByKey(IndexedDbStores.TIME_SERIES, cacheKey)
            return undefined
        }

        return existing
    }

    isCacheValid(existingData?: VariableDbEntry): boolean {
        if (!existingData?.cachedAt) {
            return false
        }

        const now = Date.now()
        return now - existingData.cachedAt <= TIME_SERIES_CACHE_TTL_MS
    }

    calculateDataGaps(
        start: Date,
        end: Date,
        existingData?: VariableDbEntry,
    ): Array<{ start: Date; end: Date }> {
        if (!existingData) {
            return [{ start, end }]
        }

        const existingStartDate = new Date(existingData.startDate)
        const existingEndDate = new Date(existingData.endDate)
        const gaps: Array<{ start: Date; end: Date }> = []

        if (start < existingStartDate) {
            gaps.push({ start, end: existingStartDate })
        }

        if (end > existingEndDate) {
            gaps.push({ start: existingEndDate, end })
        }

        return gaps
    }

    deduplicateByTimestamp(data: TimeSeriesDataRow[]): TimeSeriesDataRow[] {
        const seen = new Map<string, TimeSeriesDataRow>()
        for (const row of data) {
            if (!seen.has(row.timestamp)) {
                seen.set(row.timestamp, row)
            }
        }

        return Array.from(seen.values())
    }

    getDataInRange(data: TimeSeriesData, startDate: Date, endDate: Date): TimeSeriesData {
        return {
            ...data,
            data: data.data
                .filter(row => {
                    const timestamp = new Date(row.timestamp)
                    return timestamp >= startDate && timestamp <= endDate
                })
                .sort(
                    (a, b) =>
                        new Date(a.timestamp).getTime() -
                        new Date(b.timestamp).getTime(),
                ),
        }
    }

    async storeConsolidatedData(options: {
        cacheKey: string
        variableEntryId: string
        environment?: string
        metadata: Partial<TimeSeriesMetadata>
        data: TimeSeriesDataRow[]
    }): Promise<void> {
        const { cacheKey, variableEntryId, environment, metadata, data } = options

        if (!cacheKey || !data.length) {
            return
        }

        const sortedData = [...data].sort(
            (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
        )

        await storeDataByKey<VariableDbEntry>(IndexedDbStores.TIME_SERIES, cacheKey, {
            variableEntryId,
            key: cacheKey,
            startDate: sortedData[0].timestamp,
            endDate: sortedData[sortedData.length - 1].timestamp,
            metadata: metadata as TimeSeriesMetadata,
            data: sortedData,
            environment,
            cachedAt: Date.now(),
        })
    }
}

export default TimeSeriesCacheService
