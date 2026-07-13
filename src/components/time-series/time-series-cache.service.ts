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

function getStartOfUtcDay(date: Date): Date {
    return new Date(
        Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()),
    )
}

function getEndOfUtcDay(date: Date): Date {
    return new Date(
        Date.UTC(
            date.getUTCFullYear(),
            date.getUTCMonth(),
            date.getUTCDate(),
            23,
            59,
            59,
            999,
        ),
    )
}

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
            .map((coord) => Number(coord).toFixed(2))
        const normalizedLocation = normalizedCoordinates.join(',%20')
        const normalizedEnvironment = environment ?? 'prod'

        return `${variableEntryId}_${normalizedLocation}_${normalizedEnvironment}`
    }

    async getValidCacheEntry(
        cacheKey: string,
    ): Promise<VariableDbEntry | undefined> {
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

        const requestedStart = getStartOfUtcDay(start)
        const requestedEnd = getEndOfUtcDay(end)
        const existingStartDate = getStartOfUtcDay(
            new Date(existingData.startDate),
        )
        const existingEndDate = getEndOfUtcDay(new Date(existingData.endDate))
        const gaps: Array<{ start: Date; end: Date }> = []

        if (requestedStart < existingStartDate) {
            const leadingGapEnd = new Date(existingStartDate.getTime() - 1)

            if (requestedStart <= leadingGapEnd) {
                gaps.push({ start: requestedStart, end: leadingGapEnd })
            }
        }

        if (requestedEnd > existingEndDate) {
            const trailingGapStart = new Date(existingEndDate.getTime() + 1)

            if (trailingGapStart <= requestedEnd) {
                gaps.push({ start: trailingGapStart, end: requestedEnd })
            }
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

    getDataInRange(
        data: TimeSeriesData,
        startDate: Date,
        endDate: Date,
    ): TimeSeriesData {
        return {
            ...data,
            data: data.data
                .filter((row) => {
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
        /** The originally-requested start date. When provided, the stored range covers at least
         *  this date so that future requests for the same range don't detect a spurious gap
         *  just because Harmony returned data starting later than the requested start. */
        requestedStartDate?: Date
        /** The originally-requested end date. Same rationale as requestedStartDate. */
        requestedEndDate?: Date
    }): Promise<void> {
        const {
            cacheKey,
            variableEntryId,
            environment,
            metadata,
            data,
            requestedStartDate,
            requestedEndDate,
        } = options

        if (!cacheKey) {
            return
        }

        const sortedData = [...data].sort(
            (a, b) =>
                new Date(a.timestamp).getTime() -
                new Date(b.timestamp).getTime(),
        )

        // Use the requested range as the stored range when it extends beyond the actual data.
        // This prevents a cache-miss loop when the dataset simply has no data at the edges
        // (e.g. requesting Jan 1 but the first available data point is Jan 15).
        const storedStart =
            requestedStartDate && sortedData.length > 0
                ? new Date(
                      Math.min(
                          requestedStartDate.getTime(),
                          new Date(sortedData[0].timestamp).getTime(),
                      ),
                  ).toISOString()
                : sortedData[0]?.timestamp
        const storedEnd =
            requestedEndDate && sortedData.length > 0
                ? new Date(
                      Math.max(
                          requestedEndDate.getTime(),
                          new Date(
                              sortedData[sortedData.length - 1].timestamp,
                          ).getTime(),
                      ),
                  ).toISOString()
                : sortedData[sortedData.length - 1]?.timestamp

        if (!storedStart || !storedEnd) {
            return
        }

        await storeDataByKey<VariableDbEntry>(
            IndexedDbStores.TIME_SERIES,
            cacheKey,
            {
                variableEntryId,
                key: cacheKey,
                startDate: storedStart,
                endDate: storedEnd,
                metadata: metadata as TimeSeriesMetadata,
                data: sortedData,
                environment,
                cachedAt: Date.now(),
            },
        )
    }
}

export default TimeSeriesCacheService
