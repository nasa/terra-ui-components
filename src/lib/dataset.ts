import { TimeInterval } from '../types.js'

const MAX_DATAPOINTS_PER_REQUEST = 200000 // this is a limit imposed by the Cloud Giovanni API
const MILLIS_IN_HOUR = 1000 * 60 * 60
const MILLIS_IN_DAY = MILLIS_IN_HOUR * 24

export function calculateDataPoints(
    timeInterval: TimeInterval,
    startDate: Date,
    endDate: Date
) {
    const diffMs = endDate.getTime() - startDate.getTime()

    switch (timeInterval) {
        case TimeInterval.HalfHourly:
            return Math.floor(diffMs / (MILLIS_IN_HOUR / 2)) + 1

        case TimeInterval.Hourly:
            return Math.floor(diffMs / MILLIS_IN_HOUR) + 1

        case TimeInterval.ThreeHourly:
            return Math.floor(diffMs / (MILLIS_IN_HOUR * 3)) + 1

        case TimeInterval.Daily:
            return Math.floor(diffMs / MILLIS_IN_DAY) + 1

        case TimeInterval.Weekly:
            return Math.floor(diffMs / (MILLIS_IN_DAY * 7)) + 1

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
    endDate: Date
): Array<{ start: Date; end: Date }> {
    // Get total data points for the full range
    const totalDataPoints = calculateDataPoints(timeInterval, startDate, endDate)

    if (totalDataPoints <= MAX_DATAPOINTS_PER_REQUEST) {
        // Within the allowed number of data points, return the whole range
        return [{ start: startDate, end: endDate }]
    }

    // We are over the max datapoints so we'll need to chunk the data into multiple requests
    const chunks: Array<{ start: Date; end: Date }> = []
    const totalDurationMs = endDate.getTime() - startDate.getTime()

    // Calculate roughly how many chunks we'll need
    const numChunks = Math.ceil(totalDataPoints / MAX_DATAPOINTS_PER_REQUEST)

    // Calculate approximate chunk size in milliseconds
    const chunkSizeMs = Math.floor(totalDurationMs / numChunks)

    // Create each chunk
    let chunkStart = new Date(startDate)
    let remainingDuration = totalDurationMs

    while (remainingDuration > 0) {
        let potentialChunkEnd = new Date(chunkStart.getTime() + chunkSizeMs)

        if (potentialChunkEnd > endDate) {
            // Chunk end date is past the overall end date, use the overall end date
            potentialChunkEnd = endDate
        }

        // Verify this chunk won't exceed the data point limit
        const chunkDataPoints = calculateDataPoints(
            timeInterval,
            chunkStart,
            potentialChunkEnd
        )

        if (chunkDataPoints > MAX_DATAPOINTS_PER_REQUEST) {
            // Chunk is too large, need to adjust the end date to fit within the restrictions
            const maxDurationMs =
                (chunkSizeMs * MAX_DATAPOINTS_PER_REQUEST) / chunkDataPoints
            potentialChunkEnd = new Date(chunkStart.getTime() + maxDurationMs)
        }

        chunks.push({
            start: new Date(chunkStart),
            end: new Date(potentialChunkEnd),
        })

        remainingDuration = endDate.getTime() - potentialChunkEnd.getTime()
        chunkStart = potentialChunkEnd
    }

    return chunks
}
