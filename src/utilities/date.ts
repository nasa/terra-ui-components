import { isValid } from 'date-fns'

type MaybeDate = string | number | Date

export function isValidDate(date: string | number | Date): boolean {
    const parsedDate =
        date instanceof Date ? date.getTime() : Date.parse(String(date))

    return !Number.isNaN(parsedDate) && isValid(parsedDate)
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

    if (endOfDay) {
        utcDate.setUTCHours(23, 59, 59, 999)
    }

    return utcDate
}

function pad2(value: number): string {
    return String(value).padStart(2, '0')
}

function pad4(value: number): string {
    return String(value).padStart(4, '0')
}

function formatUtcWithPattern(date: Date, pattern: string): string {
    const replacements: Record<string, string> = {
        yyyy: pad4(date.getUTCFullYear()),
        MM: pad2(date.getUTCMonth() + 1),
        dd: pad2(date.getUTCDate()),
        HH: pad2(date.getUTCHours()),
        mm: pad2(date.getUTCMinutes()),
    }

    return pattern.replace(/yyyy|MM|dd|HH|mm/g, token => replacements[token])
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
    return formatUtcWithPattern(dateObj, formatString || defaultFormat)
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
        Date.UTC(start1.getUTCFullYear(), start1.getUTCMonth(), start1.getUTCDate())
    )
    const startOfDay2 = new Date(
        Date.UTC(start2.getUTCFullYear(), start2.getUTCMonth(), start2.getUTCDate())
    )

    const endOfDay1 = new Date(
        Date.UTC(
            end1.getUTCFullYear(),
            end1.getUTCMonth(),
            end1.getUTCDate(),
            23,
            59,
            59,
            999
        )
    )
    const endOfDay2 = new Date(
        Date.UTC(
            end2.getUTCFullYear(),
            end2.getUTCMonth(),
            end2.getUTCDate(),
            23,
            59,
            59,
            999
        )
    )

    return startOfDay1 >= startOfDay2 && endOfDay1 <= endOfDay2
}
