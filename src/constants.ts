const SECOND_MS = 1_000
const MINUTE_MS = 60 * SECOND_MS
const HOUR_MS = 60 * MINUTE_MS
const DAY_MS = 24 * HOUR_MS

export const duration = {
    seconds: (n: number) => n * SECOND_MS,
    minutes: (n: number) => n * MINUTE_MS,
    hours: (n: number) => n * HOUR_MS,
    days: (n: number) => n * DAY_MS,
} as const
