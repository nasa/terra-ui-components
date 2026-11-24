import { Temporal } from 'temporal-polyfill'

export type Disambiguation = 'earlier' | 'later' | 'compatible'

/**
 * A self-contained snapshot of a selected date, time, and DST disambiguation.
 *
 * Grouping these fields together lets callers treat a date+time selection as one
 * unit (when converting timezones, validating bounds, or swapping start and end
 * values) instead of passing five separate arguments or mutating state early.
 */
export interface DateTimeSelection {
    date: Temporal.PlainDate
    hour: number
    minute: number
    second: number
    disambiguation: Disambiguation
}

/**
 * Resolves an optional IANA timezone identifier, defaulting to `'UTC'` when
 * omitted or invalid. Optionally notifies `onInvalid` when a non-empty value
 * is not a recognized IANA timezone.
 */
export function resolveTimezone(
    tz?: string,
    onInvalid?: (tz: string) => void
): string {
    if (!tz) {
        return 'UTC'
    }

    try {
        Intl.DateTimeFormat(undefined, { timeZone: tz })
        return tz
    } catch {
        onInvalid?.(tz)
        return 'UTC'
    }
}

/**
 * Records whether `zdt` fell on the first (`'earlier'`) or second (`'later'`)
 * occurrence of a repeated hour when clocks fall back for DST.
 *
 * Asking Temporal to resolve the same wall-clock time with `'earlier'` and
 * `'later'` yields two different instants only during a fall-back repeat; for
 * every other hour they match, so we return `'compatible'`.
 */
export function disambiguationFor(
    zdt: Temporal.ZonedDateTime,
    timeZone: string
): Disambiguation {
    const pdt = zdt.toPlainDateTime()
    const earlierZdt = pdt.toZonedDateTime(timeZone, {
        disambiguation: 'earlier',
    })
    const laterZdt = pdt.toZonedDateTime(timeZone, {
        disambiguation: 'later',
    })

    if (earlierZdt.epochNanoseconds === laterZdt.epochNanoseconds) {
        return 'compatible'
    }

    return zdt.epochNanoseconds === laterZdt.epochNanoseconds ? 'later' : 'earlier'
}

/**
 * Parses `min-date` or `max-date` into a `Temporal.Instant` when the string
 * includes a time component.
 *
 * Returns `undefined` for date-only `YYYY-MM-DD` strings; otherwise a date-only
 * `max-date` like `"2024-01-01"` would be treated as `00:00:00` midnight and
 * reject valid times later that same day.
 */
export function parseBoundInstant(
    dateString: string | undefined,
    timeZone: string
): Temporal.Instant | undefined {
    if (!dateString) {
        return undefined
    }

    const trimmed = dateString.trim()
    if (!trimmed || /^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
        return undefined
    }

    try {
        if (trimmed.endsWith('Z') || /[+-]\d{2}:\d{2}$/.test(trimmed)) {
            return Temporal.Instant.from(trimmed)
        }

        const isoNaive = trimmed.includes(' ') ? trimmed.replace(' ', 'T') : trimmed
        return Temporal.PlainDateTime.from(isoNaive)
            .toZonedDateTime(timeZone)
            .toInstant()
    } catch {
        return undefined
    }
}

/**
 * Converts a `DateTimeSelection` in `timeZone` to an exact `Temporal.Instant`.
 */
export function toInstant(
    selection: DateTimeSelection,
    timeZone: string
): Temporal.Instant {
    return selection.date
        .toPlainDateTime({
            hour: selection.hour,
            minute: selection.minute,
            second: selection.second,
        })
        .toZonedDateTime(timeZone, { disambiguation: selection.disambiguation })
        .toInstant()
}
