import { isValid } from 'date-fns'

export function isValidDate(date: any): boolean {
    const parsedDate = Date.parse(date)
    return !isNaN(parsedDate) && isValid(parsedDate)
}
