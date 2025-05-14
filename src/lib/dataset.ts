import { TimeInterval } from '../types.js'

const msInHour = 1000 * 60 * 60
const msInDay = msInHour * 24

export function calculateDataPoints(
    timeInterval: TimeInterval,
    startDate: Date,
    endDate: Date
) {
    const diffMs = endDate.getTime() - startDate.getTime()

    switch (timeInterval) {
        case TimeInterval.HalfHourly:
            return Math.floor(diffMs / (msInHour / 2)) + 1

        case TimeInterval.Hourly:
            return Math.floor(diffMs / msInHour) + 1

        case TimeInterval.ThreeHourly:
            return Math.floor(diffMs / (msInHour * 3)) + 1

        case TimeInterval.Daily:
            return Math.floor(diffMs / msInDay) + 1

        case TimeInterval.Weekly:
            return Math.floor(diffMs / (msInDay * 7)) + 1

        default:
            throw new Error(`Unsupported time interval: ${timeInterval}`)
    }
}
