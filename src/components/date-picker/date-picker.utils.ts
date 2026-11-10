/**
 * Pure time conversion utilities for 12-hour and 24-hour formats.
 */

/**
 * Convert a 24-hour value to 12-hour with AM/PM period.
 */
export function to12Hour(hour24: number): { hour: number; period: 'AM' | 'PM' } {
    const period: 'AM' | 'PM' = hour24 < 12 ? 'AM' : 'PM'
    const hour = hour24 % 12 || 12
    return { hour, period }
}

/**
 * Convert a 12-hour value with AM/PM period to 24-hour.
 */
export function to24Hour(hour12: number, period: 'AM' | 'PM'): number {
    if (period === 'AM') {
        return hour12 === 12 ? 0 : hour12
    }
    return hour12 === 12 ? 12 : hour12 + 12
}
