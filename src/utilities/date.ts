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

/**
 * Returns yesterday's date in ISO format: YYYY-MM-DD.
 */
export function getYesterdayIsoDate(): string {
    const yesterday = new Date(Date.now() - 86_400_000) // 24 * 60 * 60 * 1000 milliseconds in a day

    return yesterday.toISOString().slice(0, 10)
}

export interface TimezoneInfo {
    short: string
    full: string
}

export interface TimeComponents {
    hour: number
    minute: number
    second: number
}

export interface TwelveHourTime {
    hour: number
    period: 'AM' | 'PM'
}

/**
 * Get the display timezone offset in minutes relative to UTC for a given reference date and timezone.
 * Returns a positive value for timezones ahead of UTC (e.g. Asia/Kolkata = +330),
 * and a negative value for timezones behind UTC (e.g. America/New_York EST = -300).
 * Returns 0 if no timezone is configured or if the identifier is invalid.
 */
export function getTimezoneOffsetMinutes(
    timezone?: string,
    refDate: Date = new Date()
): number {
    if (!timezone) return 0
    try {
        const fmt = new Intl.DateTimeFormat('en-US', {
            timeZone: timezone,
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            hour12: false,
        })
        const parts = fmt.formatToParts(refDate)
        const get = (type: string) =>
            parseInt(parts.find(p => p.type === type)?.value ?? '0', 10)
        const tzYear = get('year')
        const tzMonth = get('month')
        const tzDay = get('day')
        // hour12: false can yield 24 for midnight in some engines
        const tzHour = get('hour') % 24
        const tzMinute = get('minute')
        const tzSecond = get('second')
        // Interpret the timezone wall-clock time as if it were UTC
        const tzAsIfUtc = Date.UTC(
            tzYear,
            tzMonth - 1,
            tzDay,
            tzHour,
            tzMinute,
            tzSecond
        )
        // Offset = (local wall-clock as UTC) – actual UTC ref (in minutes)
        return Math.round((tzAsIfUtc - refDate.getTime()) / 60000)
    } catch {
        return 0
    }
}

/**
 * Returns localized short abbreviation and full display name for a given timezone and reference date.
 * When no timezone is provided, defaults to 'UTC'.
 */
export function getTimezoneInfo(
    timezone?: string,
    refDate: Date = new Date()
): TimezoneInfo {
    const tz = timezone || 'UTC'
    try {
        const d = refDate && !Number.isNaN(refDate.getTime()) ? refDate : new Date()
        const shortPart =
            new Intl.DateTimeFormat('en-US', {
                timeZone: tz,
                timeZoneName: 'short',
                hour: 'numeric',
            })
                .formatToParts(d)
                .find(p => p.type === 'timeZoneName')?.value || tz

        const longPart = new Intl.DateTimeFormat('en-US', {
            timeZone: tz,
            timeZoneName: 'long',
            hour: 'numeric',
        })
            .formatToParts(d)
            .find(p => p.type === 'timeZoneName')?.value

        return {
            short: shortPart,
            full: longPart
                ? tz === 'UTC'
                    ? 'Coordinated Universal Time (UTC)'
                    : `${tz} (${longPart})`
                : tz,
        }
    } catch {
        return {
            short: tz,
            full: tz,
        }
    }
}

/**
 * Convert UTC time components to display time in the configured timezone.
 * When no timezone or reference date is set, returns the input values unchanged.
 */
export function getDisplayTimeComponents(
    utcH: number,
    utcM: number,
    utcS: number,
    refDate: Date | null,
    timezone?: string
): TimeComponents {
    if (!timezone || !refDate) return { hour: utcH, minute: utcM, second: utcS }
    const offsetMinutes = getTimezoneOffsetMinutes(timezone, refDate)
    let totalMinutes = utcH * 60 + utcM + offsetMinutes
    totalMinutes = ((totalMinutes % 1440) + 1440) % 1440
    return {
        hour: Math.floor(totalMinutes / 60),
        minute: totalMinutes % 60,
        second: utcS,
    }
}

/**
 * Convert display time (in the configured timezone) back to UTC time components.
 * When no timezone or reference date is set, returns the input values unchanged.
 */
export function getUtcTimeFromDisplay(
    dispH: number,
    dispM: number,
    dispS: number,
    refDate: Date | null,
    timezone?: string
): TimeComponents {
    if (!timezone || !refDate) return { hour: dispH, minute: dispM, second: dispS }
    const offsetMinutes = getTimezoneOffsetMinutes(timezone, refDate)
    let totalMinutes = dispH * 60 + dispM - offsetMinutes
    totalMinutes = ((totalMinutes % 1440) + 1440) % 1440
    return {
        hour: Math.floor(totalMinutes / 60),
        minute: totalMinutes % 60,
        second: dispS,
    }
}

/** Convert a 24-hour value to 12-hour with AM/PM period. */
export function to12Hour(hour24: number): TwelveHourTime {
    const period: 'AM' | 'PM' = hour24 < 12 ? 'AM' : 'PM'
    const hour = hour24 % 12 || 12
    return { hour, period }
}

/** Convert a 12-hour value with AM/PM period to 24-hour. */
export function to24Hour(hour12: number, period: 'AM' | 'PM'): number {
    if (period === 'AM') {
        return hour12 === 12 ? 0 : hour12
    }
    return hour12 === 12 ? 12 : hour12 + 12
}
