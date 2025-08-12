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
