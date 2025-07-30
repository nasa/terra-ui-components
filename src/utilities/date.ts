import { isValid } from 'date-fns'
import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone.js'
import utc from 'dayjs/plugin/utc.js'

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.tz.setDefault('Etc/GMT')

type MaybeDate = string | number | Date

export function isValidDate(date: any): boolean {
    const parsedDate = Date.parse(date)
    return !isNaN(parsedDate) && isValid(parsedDate)
}

export function getUTCDate(date: MaybeDate, endOfDay: boolean = false) {
    const utcDate = dayjs.utc(date).toDate()

    if (endOfDay) utcDate.setUTCHours(23, 59, 59, 999)

    return utcDate
}

/**
 * formats a date, see https://day.js.org/docs/en/display/format for available formatting options
 */
export function formatDate(date: dayjs.Dayjs | MaybeDate, format?: string) {
    if (!dayjs.isDayjs(date)) {
        date = dayjs.utc(date)
    }

    return date.format(format)
}

/**
 * Helper to check if a date range is contained within another date range.
 * This is useful for determining if existing data covers the requested range.
 */
export function isDateRangeContained(
    start1: Date,
    end1: Date,
    start2: Date,
    end2: Date
): boolean {
    const startOfDay1 = new Date(
        start1.getFullYear(),
        start1.getMonth(),
        start1.getDate()
    )
    const startOfDay2 = new Date(
        start2.getFullYear(),
        start2.getMonth(),
        start2.getDate()
    )

    const endOfDay1 = new Date(
        end1.getFullYear(),
        end1.getMonth(),
        end1.getDate(),
        23,
        59,
        59,
        999
    )
    const endOfDay2 = new Date(
        end2.getFullYear(),
        end2.getMonth(),
        end2.getDate(),
        23,
        59,
        59,
        999
    )

    return startOfDay1 >= startOfDay2 && endOfDay1 <= endOfDay2
}
