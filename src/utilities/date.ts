import { isValid, format } from 'date-fns'

type MaybeDate = string | number | Date

export function isValidDate(date: any): boolean {
    const parsedDate = Date.parse(date)
    return !isNaN(parsedDate) && isValid(parsedDate)
}

export function getUTCDate(date: MaybeDate, endOfDay: boolean = false) {
    let utcDate: Date

    if (date instanceof Date) {
        utcDate = new Date(date.getTime())
    } else if (typeof date === 'string') {
        utcDate = new Date(date)
    } else if (typeof date === 'number') {
        utcDate = new Date(date)
    } else {
        utcDate = new Date()
    }

    // Convert to UTC by adjusting for timezone offset
    const offset = utcDate.getTimezoneOffset()
    utcDate = new Date(utcDate.getTime() + offset * 60000)

    if (endOfDay) {
        utcDate.setUTCHours(23, 59, 59, 999)
    }

    return utcDate
}

/**
 * formats a date using date-fns format patterns
 * See https://date-fns.org/v3.6.0/docs/format for available formatting options
 */
export function formatDate(date: MaybeDate, formatString?: string) {
    let dateObj: Date

    if (date instanceof Date) {
        dateObj = date
    } else if (typeof date === 'string') {
        dateObj = new Date(date)
    } else if (typeof date === 'number') {
        dateObj = new Date(date)
    } else {
        dateObj = new Date()
    }

    // Default format if none provided
    const defaultFormat = 'yyyy-MM-dd'
    return format(dateObj, formatString || defaultFormat)
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
