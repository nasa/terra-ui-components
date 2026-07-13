import { TimeInterval } from '../types.js'

const MAX_DATAPOINTS_PER_REQUEST = 200000 // this is a limit imposed by the Cloud Giovanni API
const MILLIS_IN_HOUR = 1000 * 60 * 60
const MILLIS_IN_DAY = MILLIS_IN_HOUR * 24

function getIntervalMs(timeInterval: TimeInterval): number {
    switch (timeInterval) {
        case TimeInterval.HalfHourly:
            return MILLIS_IN_HOUR / 2
        case TimeInterval.Hourly:
            return MILLIS_IN_HOUR
        case TimeInterval.ThreeHourly:
            return MILLIS_IN_HOUR * 3
        case TimeInterval.EightDaily:
            return MILLIS_IN_DAY * 8
        case TimeInterval.Daily:
            return MILLIS_IN_DAY
        case TimeInterval.Weekly:
            return MILLIS_IN_DAY * 7
        case TimeInterval.Monthly:
            return MILLIS_IN_DAY * 30
        default:
            throw new Error(`Unsupported time interval: ${timeInterval}`)
    }
}

export function calculateDataPoints(
    timeInterval: TimeInterval,
    startDate: Date,
    endDate: Date,
) {
    const diffMs = endDate.getTime() - startDate.getTime()

    switch (timeInterval) {
        case TimeInterval.HalfHourly:
            return Math.floor(diffMs / (MILLIS_IN_HOUR / 2)) + 1

        case TimeInterval.Hourly:
            return Math.floor(diffMs / MILLIS_IN_HOUR) + 1

        case TimeInterval.ThreeHourly:
            return Math.floor(diffMs / (MILLIS_IN_HOUR * 3)) + 1

        case TimeInterval.EightDaily:
            return Math.floor(diffMs / (MILLIS_IN_DAY * 8)) + 1

        case TimeInterval.Daily:
            return Math.floor(diffMs / MILLIS_IN_DAY) + 1

        case TimeInterval.Weekly:
            return Math.floor(diffMs / (MILLIS_IN_DAY * 7)) + 1

        case TimeInterval.Monthly:
            return Math.floor(diffMs / (MILLIS_IN_DAY * 30)) + 1

        default:
            throw new Error(`Unsupported time interval: ${timeInterval}`)
    }
}

/**
 * Calculates date chunks for multiple API requests based on the maximum allowed data points
 */
export function calculateDateChunks(
    timeInterval: TimeInterval,
    startDate: Date,
    endDate: Date,
): Array<{ start: Date; end: Date }> {
    // Get total data points for the full range
    const totalDataPoints = calculateDataPoints(
        timeInterval,
        startDate,
        endDate,
    )

    if (totalDataPoints <= MAX_DATAPOINTS_PER_REQUEST) {
        // Within the allowed number of data points, return the whole range
        return [{ start: startDate, end: endDate }]
    }

    // Build chunks using the native interval step to avoid overlapping boundaries
    // and near-zero-length tail chunks due to millisecond rounding drift.
    const chunks: Array<{ start: Date; end: Date }> = []
    const intervalMs = getIntervalMs(timeInterval)
    const maxChunkSpanMs = intervalMs * (MAX_DATAPOINTS_PER_REQUEST - 1)

    let chunkStartMs = startDate.getTime()
    const endMs = endDate.getTime()

    while (chunkStartMs <= endMs) {
        const chunkEndMs = Math.min(chunkStartMs + maxChunkSpanMs, endMs)

        chunks.push({
            start: new Date(chunkStartMs),
            end: new Date(chunkEndMs),
        })

        if (chunkEndMs >= endMs) {
            break
        }

        const nextChunkStartMs = chunkEndMs + intervalMs

        // Safety guard against invalid interval configuration.
        if (nextChunkStartMs <= chunkStartMs) {
            break
        }

        chunkStartMs = nextChunkStartMs
    }

    return chunks
}
