import { expect, fixture, html } from '@open-wc/testing'
import { elementUpdated } from '@open-wc/testing-helpers'
import { oneEvent } from '@open-wc/testing-helpers'
import './date-picker.js'
import type TerraDatePicker from './date-picker.js'

// Helper to get a date string in YYYY-MM-DD format
function formatDate(date: Date): string {
    return date.toISOString().split('T')[0]
}

// Helper to get month/year from a Date
function getMonthYear(date: Date): string {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
}

function getCalendar(
    el: TerraDatePicker,
    isLeft: boolean = true
): HTMLElement | undefined {
    const calendars = el.shadowRoot?.querySelectorAll<HTMLElement>('.calendar')
    return isLeft ? calendars?.[0] : calendars?.[1]
}

// Helper to find calendar day buttons in shadow root
function getCalendarDays(el: any, isLeft: boolean = true): NodeListOf<HTMLElement> {
    const calendars = el.shadowRoot?.querySelectorAll('.calendar')
    const calendar = isLeft ? calendars?.[0] : calendars?.[1]
    return calendar?.querySelectorAll('.calendar__day') || ([] as any)
}

// Helper to find a specific date button
function findDateButton(
    el: any,
    targetDate: Date,
    isLeft: boolean = true
): HTMLElement | null {
    const days = getCalendarDays(el, isLeft)
    for (const day of Array.from(days)) {
        const dateStr = day.textContent?.trim()
        if (dateStr && parseInt(dateStr, 10) === targetDate.getDate()) {
            // Check if it's in the current month (not grayed out)
            if (!day.classList.contains('calendar__day--outside')) {
                return day
            }
        }
    }
    return null
}

// Helper function to make selecting a specific date on the calendar easier
async function selectDate(el: TerraDatePicker, date: Date, isLeft: boolean = true) {
    const calendar = getCalendar(el, isLeft)

    if (!calendar) {
        throw new Error('Calendar not found')
    }

    const monthDropdown = calendar.querySelector<HTMLButtonElement>(
        '.calendar__month-button'
    )

    if (!monthDropdown) {
        throw new Error('Month dropdown not found')
    }

    monthDropdown.click()
    await elementUpdated(el)

    // find the month option that contains the text of the month of the date
    const monthOption = [
        ...(calendar.querySelectorAll<HTMLButtonElement>('.calendar__month-option') ||
            []),
    ].filter((option: HTMLElement) =>
        option.textContent?.includes(
            date.toLocaleString('default', { month: 'long' })
        )
    )

    if (!monthOption) {
        throw new Error('Month option not found')
    }

    monthOption[0]?.click()
    await elementUpdated(el)

    // select the year
    const yearInput = calendar.querySelector<HTMLInputElement>(
        '.calendar__year-input'
    )

    if (!yearInput) {
        throw new Error('Year input not found')
    }

    yearInput.value = date.getFullYear().toString()
    yearInput.dispatchEvent(new Event('input'))
    await elementUpdated(el)

    // Verify the calendar is showing the correct month/year
    const displayedMonth = isLeft ? el.leftMonth : el.rightMonth
    if (
        displayedMonth.getFullYear() !== date.getFullYear() ||
        displayedMonth.getMonth() !== date.getMonth()
    ) {
        throw new Error(
            `Calendar not showing correct month. Expected ${date.getFullYear()}-${date.getMonth() + 1}, got ${displayedMonth.getFullYear()}-${displayedMonth.getMonth() + 1}`
        )
    }

    // select the day
    const dayButton = findDateButton(el, date, isLeft)
    if (!dayButton) {
        throw new Error('Day button not found')
    }
    dayButton.click()
    await elementUpdated(el)
}

/**
 * Mock Date methods to simulate a specific timezone for deterministic testing.
 * This mocks getHours(), getMinutes(), and getTimezoneOffset() to return values
 * as if the system is in Pacific Daylight Time (PDT, UTC-7).
 *
 * Note: getTimezoneOffset() returns the offset in minutes from UTC.
 * For timezones behind UTC (like PDT), it returns a POSITIVE number.
 * PDT (UTC-7) = 420 minutes = 7 hours behind UTC.
 *
 * @param offsetMinutes - Timezone offset in minutes (e.g., 420 for PDT = UTC-7)
 * @returns A function to restore the original Date methods
 */
function mockTimezoneOffset(offsetMinutes: number): () => void {
    const originalGetHours = Date.prototype.getHours
    const originalGetMinutes = Date.prototype.getMinutes
    const originalGetTimezoneOffset = Date.prototype.getTimezoneOffset

    // Mock getTimezoneOffset to return the desired offset
    // Note: getTimezoneOffset() returns positive for timezones behind UTC
    Date.prototype.getTimezoneOffset = function () {
        return offsetMinutes
    }

    // Mock getHours and getMinutes to account for the timezone offset
    // getTimezoneOffset() returns the offset from local to UTC, so:
    // local time = UTC time - offset
    // For PDT (UTC-7): offset = 420 minutes, so subtract 7 hours
    Date.prototype.getHours = function () {
        const utcHours = this.getUTCHours()
        const offsetHours = Math.floor(offsetMinutes / 60)
        // Subtract offset to convert UTC to local time
        let localHours = utcHours - offsetHours
        if (localHours < 0) localHours += 24
        if (localHours >= 24) localHours -= 24
        return localHours
    }

    Date.prototype.getMinutes = function () {
        const utcMinutes = this.getUTCMinutes()
        const offsetMinutesRemainder = offsetMinutes % 60
        // Subtract offset to convert UTC to local time
        let localMinutes = utcMinutes - offsetMinutesRemainder
        if (localMinutes < 0) {
            localMinutes += 60
            // Note: This doesn't adjust hours, but for our test case (30 minutes),
            // the offset remainder is 0, so this won't be an issue
        }
        if (localMinutes >= 60) {
            localMinutes -= 60
        }
        return localMinutes
    }

    return () => {
        Date.prototype.getHours = originalGetHours
        Date.prototype.getMinutes = originalGetMinutes
        Date.prototype.getTimezoneOffset = originalGetTimezoneOffset
    }
}

describe('<terra-date-picker>', () => {
    describe('Basic Rendering', () => {
        it('should render a component', async () => {
            const el = await fixture(html` <terra-date-picker></terra-date-picker> `)
            expect(el).to.exist
        })

        it('should render with default label', async () => {
            const el: any = await fixture(html`
                <terra-date-picker></terra-date-picker>
            `)
            const input = el.shadowRoot?.querySelector('terra-input')
            expect(input?.label).to.equal('Select Date')
        })

        it('should render with custom label', async () => {
            const el: any = await fixture(html`
                <terra-date-picker label="Event Date"></terra-date-picker>
            `)
            const input = el.shadowRoot?.querySelector('terra-input')
            expect(input?.label).to.equal('Event Date')
        })

        it('should render with help text', async () => {
            const el: any = await fixture(html`
                <terra-date-picker help-text="Format: YYYY-MM-DD"></terra-date-picker>
            `)
            const input = el.shadowRoot?.querySelector('terra-input')
            expect(input?.helpText).to.equal('Format: YYYY-MM-DD')
        })
    })

    describe('Properties', () => {
        it('should accept id property', async () => {
            const el: any = await fixture(html`
                <terra-date-picker id="test-picker"></terra-date-picker>
            `)
            expect(el.id).to.equal('test-picker')
        })

        it('should accept range property', async () => {
            const el: any = await fixture(html`
                <terra-date-picker range></terra-date-picker>
            `)
            expect(el.range).to.be.true
        })

        it('should accept min-date and max-date', async () => {
            const el: any = await fixture(html`
                <terra-date-picker
                    min-date="2024-01-01"
                    max-date="2024-12-31"
                ></terra-date-picker>
            `)
            expect(el.minDate).to.equal('2024-01-01')
            expect(el.maxDate).to.equal('2024-12-31')
        })

        it('should accept start-date and end-date', async () => {
            const el: any = await fixture(html`
                <terra-date-picker
                    start-date="2024-03-20"
                    end-date="2024-03-25"
                ></terra-date-picker>
            `)
            expect(el.startDate).to.equal('2024-03-20')
            expect(el.endDate).to.equal('2024-03-25')
        })

        it('should accept inline property', async () => {
            const el: any = await fixture(html`
                <terra-date-picker inline></terra-date-picker>
            `)
            expect(el.inline).to.be.true
            expect(el.isOpen).to.be.true
        })

        it('should accept split-inputs property', async () => {
            const el: any = await fixture(html`
                <terra-date-picker range split-inputs></terra-date-picker>
            `)
            expect(el.splitInputs).to.be.true
        })

        it('should accept enable-time property', async () => {
            const el: any = await fixture(html`
                <terra-date-picker enable-time></terra-date-picker>
            `)
            expect(el.enableTime).to.be.true
        })

        it('should accept show-presets property', async () => {
            const el: any = await fixture(html`
                <terra-date-picker show-presets></terra-date-picker>
            `)
            expect(el.showPresets).to.be.true
        })
    })

    describe('Single Date Selection', () => {
        it('should initialize with start-date', async () => {
            const el: any = await fixture(html`
                <terra-date-picker start-date="2024-03-20"></terra-date-picker>
            `)
            await elementUpdated(el)
            expect(el.selectedStart).to.not.be.null
            expect(formatDate(el.selectedStart)).to.equal('2024-03-20')
        })

        it('should emit terra-date-range-change when date is selected', async () => {
            const el: any = await fixture(html`
                <terra-date-picker inline></terra-date-picker>
            `)
            await elementUpdated(el)

            const eventPromise = oneEvent(el, 'terra-date-range-change')

            await selectDate(el, new Date(2024, 2, 16)) // March 16, 2024

            const event = await eventPromise

            expect(event.detail.startDate).to.equal('2024-03-16')
            expect(event.detail.endDate).to.equal('')
        })

        it('should update display value when date is selected', async () => {
            const el: any = await fixture(html`
                <terra-date-picker inline></terra-date-picker>
            `)
            await elementUpdated(el)

            await selectDate(el, new Date(2023, 1, 5)) // February 5, 2023

            const input = el.shadowRoot?.querySelector('terra-input')
            expect(input?.value).to.include('2023-02-05')
        })
    })

    describe('Range Selection', () => {
        it('should initialize with start-date and end-date in range mode', async () => {
            const el: any = await fixture(html`
                <terra-date-picker
                    range
                    start-date="2024-03-20"
                    end-date="2024-03-25"
                ></terra-date-picker>
            `)
            await elementUpdated(el)
            expect(el.selectedStart).to.not.be.null
            expect(el.selectedEnd).to.not.be.null
            expect(formatDate(el.selectedStart)).to.equal('2024-03-20')
            expect(formatDate(el.selectedEnd)).to.equal('2024-03-25')
        })

        it('should emit terra-date-range-change when range is selected', async () => {
            const el: any = await fixture(html`
                <terra-date-picker range inline></terra-date-picker>
            `)
            await elementUpdated(el)

            const eventPromise = oneEvent(el, 'terra-date-range-change')

            // Select start date
            const startDate = new Date(2024, 2, 15) // March 15
            await selectDate(el, startDate, true)

            // Select end date
            const endDate = new Date(2024, 2, 20) // March 20
            await selectDate(el, endDate, true)

            const event = await eventPromise

            expect(event.detail.startDate).to.equal('2024-03-15')
            expect(event.detail.endDate).to.equal('2024-03-20')
        })

        it('should swap dates if end date is before start date', async () => {
            const el: any = await fixture(html`
                <terra-date-picker range inline></terra-date-picker>
            `)
            await elementUpdated(el)

            const eventPromise = oneEvent(el, 'terra-date-range-change')

            // Select later date first
            const laterDate = new Date(2024, 2, 20) // March 20
            await selectDate(el, laterDate, true)

            // Select earlier date
            const earlierDate = new Date(2024, 2, 15) // March 15
            await selectDate(el, earlierDate, true)

            const event = await eventPromise

            expect(event.detail.startDate).to.equal('2024-03-15')
            expect(event.detail.endDate).to.equal('2024-03-20')
        })

        it('should display range in input value', async () => {
            const el: any = await fixture(html`
                <terra-date-picker
                    range
                    start-date="2024-03-20"
                    end-date="2024-03-25"
                ></terra-date-picker>
            `)
            await elementUpdated(el)

            const input = el.shadowRoot?.querySelector('terra-input')
            expect(input?.value).to.include('2024-03-20')
            expect(input?.value).to.include('2024-03-25')
        })

        it('should emit correct dates without timezone conversion when dates are set programmatically', async () => {
            const el: any = await fixture(html`
                <terra-date-picker
                    range
                    inline
                    start-date="2026-02-06"
                    end-date="2026-02-07"
                ></terra-date-picker>
            `)
            await elementUpdated(el)

            // Verify dates are emitted correctly (not shifted due to timezone conversion)
            const eventPromise = oneEvent(el, 'terra-date-range-change')

            // Trigger a change by clicking the same dates (should emit the same dates)
            const feb6 = new Date(2026, 1, 6) // February 6
            const feb7 = new Date(2026, 1, 7) // February 7

            await selectDate(el, feb6, true)
            await selectDate(el, feb7, true)

            const event = await eventPromise

            // These should be the actual dates selected, not shifted by timezone
            expect(event.detail.startDate).to.equal('2026-02-06')
            expect(event.detail.endDate).to.equal('2026-02-07')
        })

        it('should display correct dates in split inputs without timezone shift', async () => {
            const el: any = await fixture(html`
                <terra-date-picker
                    range
                    split-inputs
                    start-date="2026-02-06"
                    end-date="2026-02-07"
                ></terra-date-picker>
            `)
            await elementUpdated(el)

            const inputs = el.shadowRoot?.querySelectorAll('terra-input')
            const startInput = inputs?.[0]
            const endInput = inputs?.[1]

            expect(startInput?.value).to.include('2026-02-06')
            expect(endInput?.value).to.include('2026-02-07')
        })
    })

    describe('Month Synchronization (Current Behavior)', () => {
        it('should set leftMonth to start date month when start-date changes', async () => {
            const el: any = await fixture(html`
                <terra-date-picker start-date="2024-03-20"></terra-date-picker>
            `)
            await elementUpdated(el)

            expect(getMonthYear(el.leftMonth)).to.equal('2024-03')
        })

        it('should set rightMonth to end date month when end-date changes in range mode', async () => {
            const el: any = await fixture(html`
                <terra-date-picker
                    range
                    start-date="2024-03-20"
                    end-date="2024-12-15"
                ></terra-date-picker>
            `)
            await elementUpdated(el)

            expect(getMonthYear(el.leftMonth)).to.equal('2024-03')
            expect(getMonthYear(el.rightMonth)).to.equal('2024-12')
        })

        it('should set rightMonth to leftMonth + 1 when no end-date in range mode', async () => {
            const el: any = await fixture(html`
                <terra-date-picker range start-date="2024-03-20"></terra-date-picker>
            `)
            await elementUpdated(el)

            expect(getMonthYear(el.leftMonth)).to.equal('2024-03')
            expect(getMonthYear(el.rightMonth)).to.equal('2024-04')
        })

        it('should preserve right calendar when single-month range is selected on left calendar', async () => {
            // Case 1: Left calendar shows September, right shows December
            // User selects September 2-4 on the left calendar
            // Right calendar should stay at December
            const el: any = await fixture(html`
                <terra-date-picker range inline></terra-date-picker>
            `)
            await elementUpdated(el)

            // Manually set calendars to different months (simulating user navigation)
            el.leftMonth = new Date(2024, 8, 1) // September
            el.rightMonth = new Date(2024, 11, 1) // December
            await elementUpdated(el)

            // Now set a range that's entirely in September
            el.startDate = '2024-09-02'
            el.endDate = '2024-09-04'
            await elementUpdated(el)

            // Left calendar should show September, right should stay at December
            expect(getMonthYear(el.leftMonth)).to.equal('2024-09')
            expect(getMonthYear(el.rightMonth)).to.equal('2024-12')
        })

        it('should preserve left calendar when single-month range is selected on right calendar', async () => {
            // Case 2: Left calendar shows September, right shows December
            // User selects December 1-2 on the right calendar
            // Left calendar should stay at September
            const el: any = await fixture(html`
                <terra-date-picker range inline></terra-date-picker>
            `)
            await elementUpdated(el)

            // Manually set calendars to different months
            el.leftMonth = new Date(2024, 8, 1) // September
            el.rightMonth = new Date(2024, 11, 1) // December
            await elementUpdated(el)

            // Now set a range that's entirely in December
            el.startDate = '2024-12-01'
            el.endDate = '2024-12-02'
            await elementUpdated(el)

            // Left calendar should stay at September, right should show December
            expect(getMonthYear(el.leftMonth)).to.equal('2024-09')
            expect(getMonthYear(el.rightMonth)).to.equal('2024-12')
        })

        it('should update only left calendar when single-month range is in neither visible month', async () => {
            // Case 3: Left calendar shows September, right shows December
            // User selects a range in a different month (e.g., March)
            // Only the left calendar should change to show March
            const el: any = await fixture(html`
                <terra-date-picker range inline></terra-date-picker>
            `)
            await elementUpdated(el)

            // Manually set calendars to different months
            el.leftMonth = new Date(2024, 8, 1) // September
            el.rightMonth = new Date(2024, 11, 1) // December
            await elementUpdated(el)

            // Now set a range that's entirely in March (neither visible month)
            el.startDate = '2024-03-10'
            el.endDate = '2024-03-15'
            await elementUpdated(el)

            // Left calendar should show March, right should stay at December
            expect(getMonthYear(el.leftMonth)).to.equal('2024-03')
            expect(getMonthYear(el.rightMonth)).to.equal('2024-12')
        })

        it('should set right calendar to next month on initial load with single-month range', async () => {
            // When a single-month range is provided on initial load,
            // left should show the selection month, right should show next month
            const el: any = await fixture(html`
                <terra-date-picker
                    range
                    start-date="2024-03-20"
                    end-date="2024-03-25"
                ></terra-date-picker>
            `)
            await elementUpdated(el)

            // Left should show March, right should show April (next month)
            expect(getMonthYear(el.leftMonth)).to.equal('2024-03')
            expect(getMonthYear(el.rightMonth)).to.equal('2024-04')
        })

        it('should update both calendars when range spans different months', async () => {
            const el: any = await fixture(html`
                <terra-date-picker
                    range
                    start-date="2024-03-20"
                    end-date="2024-06-15"
                ></terra-date-picker>
            `)
            await elementUpdated(el)

            expect(getMonthYear(el.leftMonth)).to.equal('2024-03')
            expect(getMonthYear(el.rightMonth)).to.equal('2024-06')
        })

        it('should update months when start-date changes externally', async () => {
            const el: any = await fixture(html`
                <terra-date-picker start-date="2024-03-20"></terra-date-picker>
            `)
            await elementUpdated(el)

            expect(getMonthYear(el.leftMonth)).to.equal('2024-03')

            // Change start-date externally
            el.startDate = '2024-07-15'
            await elementUpdated(el)

            expect(getMonthYear(el.leftMonth)).to.equal('2024-07')
        })

        it('should update months when end-date changes externally in range mode', async () => {
            const el: any = await fixture(html`
                <terra-date-picker
                    range
                    start-date="2024-03-20"
                    end-date="2024-03-25"
                ></terra-date-picker>
            `)
            await elementUpdated(el)

            // Change end-date externally
            el.endDate = '2024-08-10'
            await elementUpdated(el)

            expect(getMonthYear(el.leftMonth)).to.equal('2024-03')
            expect(getMonthYear(el.rightMonth)).to.equal('2024-08')
        })
    })

    describe('Calendar Navigation', () => {
        it('should navigate to previous month on left calendar', async () => {
            const el: any = await fixture(html`
                <terra-date-picker inline></terra-date-picker>
            `)
            await elementUpdated(el)

            const initialMonth = el.leftMonth.getMonth()
            const prevButton = el.shadowRoot?.querySelectorAll(
                '.calendar__nav'
            )?.[0] as HTMLElement
            prevButton?.click()
            await elementUpdated(el)

            expect(el.leftMonth.getMonth()).to.equal(
                initialMonth === 0 ? 11 : initialMonth - 1
            )
        })

        it('should navigate to next month on left calendar', async () => {
            const el: any = await fixture(html`
                <terra-date-picker inline></terra-date-picker>
            `)
            await elementUpdated(el)

            const initialMonth = el.leftMonth.getMonth()
            const nextButton = el.shadowRoot?.querySelectorAll(
                '.calendar__nav'
            )?.[1] as HTMLElement
            nextButton?.click()
            await elementUpdated(el)

            expect(el.leftMonth.getMonth()).to.equal(
                initialMonth === 11 ? 0 : initialMonth + 1
            )
        })

        it('should navigate to previous month on right calendar in range mode', async () => {
            const el: any = await fixture(html`
                <terra-date-picker range inline></terra-date-picker>
            `)
            await elementUpdated(el)

            const initialMonth = el.rightMonth.getMonth()
            const calendars = el.shadowRoot?.querySelectorAll('.calendar')
            const rightCalendar = calendars?.[1]
            const prevButton = rightCalendar?.querySelectorAll(
                '.calendar__nav'
            )?.[0] as HTMLElement
            prevButton?.click()
            await elementUpdated(el)

            expect(el.rightMonth.getMonth()).to.equal(
                initialMonth === 0 ? 11 : initialMonth - 1
            )
        })

        it('should change year when year input changes', async () => {
            const el: any = await fixture(html`
                <terra-date-picker inline></terra-date-picker>
            `)
            await elementUpdated(el)

            const yearInput = el.shadowRoot?.querySelector(
                '.calendar__year-input'
            ) as HTMLInputElement
            yearInput.value = '2025'
            yearInput.dispatchEvent(new Event('input'))
            await elementUpdated(el)

            expect(el.leftMonth.getFullYear()).to.equal(2025)
        })
    })

    describe('Min/Max Date Constraints', () => {
        it('should disable dates before min-date', async () => {
            const el: any = await fixture(html`
                <terra-date-picker
                    inline
                    min-date="2024-03-15"
                    start-date="2024-04-05"
                ></terra-date-picker>
            `)
            await elementUpdated(el)

            await selectDate(el, new Date(2024, 2, 10)) // try to select a date before min-date

            expect(el.startDate).to.equal('2024-04-05') // should not change
        })

        it('should disable dates before min-date when start date is not set', async () => {
            const el: any = await fixture(html`
                <terra-date-picker inline min-date="2024-03-15"></terra-date-picker>
            `)
            await elementUpdated(el)

            await selectDate(el, new Date(2024, 2, 10)) // try to select a date before min-date

            expect(el.startDate).to.equal(undefined) // should not change
        })

        it('should disable dates after max-date', async () => {
            const el: any = await fixture(html`
                <terra-date-picker inline max-date="2024-03-20"></terra-date-picker>
            `)
            await elementUpdated(el)

            // Navigate to a month with dates after max-date
            el.leftMonth = new Date(2024, 2, 1) // March
            await elementUpdated(el)

            // Find a date after max-date
            const afterMax = new Date(2024, 2, 25) // March 25
            const dateButton = findDateButton(el, afterMax, true)
            if (dateButton) {
                expect(dateButton.classList.contains('calendar__day--disabled')).to.be
                    .true
            }
        })

        it('should not allow selection of disabled dates', async () => {
            const el: any = await fixture(html`
                <terra-date-picker inline min-date="2024-03-15"></terra-date-picker>
            `)
            await elementUpdated(el)

            const beforeMinDate = new Date(2024, 2, 10)

            await selectDate(el, beforeMinDate)

            const dateButton = findDateButton(el, beforeMinDate, true)
            if (dateButton) {
                const button = dateButton as HTMLButtonElement
                if (!button.disabled) {
                    const initialSelected = el.selectedStart
                    dateButton.click()
                    await elementUpdated(el)

                    // Selection should not change
                    expect(el.selectedStart).to.deep.equal(initialSelected)
                }
            }
        })
    })

    describe('Presets', () => {
        it('should show presets sidebar when show-presets is true', async () => {
            const el: any = await fixture(html`
                <terra-date-picker show-presets inline></terra-date-picker>
            `)
            await elementUpdated(el)

            const sidebar = el.shadowRoot?.querySelector('.date-picker__sidebar')
            expect(sidebar).to.exist
        })

        it('should have default presets', async () => {
            const el: any = await fixture(html`
                <terra-date-picker show-presets inline></terra-date-picker>
            `)
            await elementUpdated(el)

            const presetButtons = el.shadowRoot?.querySelectorAll(
                '.date-picker__preset'
            )
            expect(presetButtons?.length).to.be.greaterThan(0)
        })

        it('should select dates when preset is clicked', async () => {
            const el: any = await fixture(html`
                <terra-date-picker show-presets inline range></terra-date-picker>
            `)
            await elementUpdated(el)

            const presetButtons = el.shadowRoot?.querySelectorAll(
                '.date-picker__preset'
            )
            const todayPreset = Array.from(presetButtons || []).find(
                (btn: any) => btn.textContent?.trim() === 'Today'
            ) as HTMLElement

            if (todayPreset) {
                const eventPromise = oneEvent(el, 'terra-date-range-change')
                todayPreset.click()
                const event = await eventPromise

                expect(event.detail.startDate).to.not.be.empty
                expect(event.detail.endDate).to.not.be.empty
            }
        })
    })

    describe('Time Selection', () => {
        it('should show time picker when enable-time is true', async () => {
            const el: any = await fixture(html`
                <terra-date-picker enable-time inline></terra-date-picker>
            `)
            await elementUpdated(el)

            const timePicker = el.shadowRoot?.querySelector('.date-picker__time')
            expect(timePicker).to.exist
        })

        it('should initialize time from start-date when enable-time is true', async () => {
            // Mock timezone to Pacific Daylight Time (PDT, UTC-7)
            // For March 20, 2024, DST applies, so PDT offset is 420 minutes (7 hours behind UTC)
            const restoreTimezone = mockTimezoneOffset(7 * 60)

            try {
                const el: any = await fixture(html`
                    <terra-date-picker
                        enable-time
                        inline
                        start-date="2024-03-20T14:30:00Z"
                    ></terra-date-picker>
                `)
                await elementUpdated(el)

                // 14:30 UTC in 24-hour format
                expect(el.startHour).to.equal(14)
                expect(el.startMinute).to.equal(30)
            } finally {
                restoreTimezone()
            }
        })

        it('should emit time in ISO format when enable-time is true', async () => {
            const el: any = await fixture(html`
                <terra-date-picker enable-time inline></terra-date-picker>
            `)
            await elementUpdated(el)

            // Select a date
            const date = new Date(2024, 2, 15)
            const dateButton = findDateButton(el, date, true)
            const eventPromise = oneEvent(el, 'terra-date-range-change')
            dateButton!.click()
            const event = await eventPromise

            // Should be ISO format with time
            expect(event.detail.startDate).to.include('T')
            expect(event.detail.startDate).to.include('Z')
        })

        it('should accept 24-hour time input (0-23)', async () => {
            const el: any = await fixture(html`
                <terra-date-picker
                    enable-time
                    inline
                    start-date="2024-03-20"
                ></terra-date-picker>
            `)
            await elementUpdated(el)

            const hourInput = el.shadowRoot?.querySelector(
                '.date-picker__time-input'
            ) as HTMLInputElement

            // Test setting hour to 0 (midnight)
            hourInput.value = '0'
            hourInput.dispatchEvent(new Event('input'))
            await elementUpdated(el)
            expect(el.startHour).to.equal(0)

            // Test setting hour to 23 (11 PM)
            hourInput.value = '23'
            hourInput.dispatchEvent(new Event('input'))
            await elementUpdated(el)
            expect(el.startHour).to.equal(23)

            // Test mid-range hour
            hourInput.value = '14'
            hourInput.dispatchEvent(new Event('input'))
            await elementUpdated(el)
            expect(el.startHour).to.equal(14)
        })

        it('should reject invalid hour values outside 0-23 range', async () => {
            const el: any = await fixture(html`
                <terra-date-picker
                    enable-time
                    inline
                    start-date="2024-03-20"
                ></terra-date-picker>
            `)
            await elementUpdated(el)

            const hourInput = el.shadowRoot?.querySelector(
                '.date-picker__time-input'
            ) as HTMLInputElement

            const initialHour = el.startHour

            // Try to set hour to 24 (invalid)
            hourInput.value = '24'
            hourInput.dispatchEvent(new Event('input'))
            await elementUpdated(el)

            // Should revert to previous value
            expect(el.startHour).to.equal(initialHour)

            // Try to set hour to -1 (invalid)
            hourInput.value = '-1'
            hourInput.dispatchEvent(new Event('input'))
            await elementUpdated(el)

            // Should still be at initial value
            expect(el.startHour).to.equal(initialHour)
        })

        it('should increment hour with up spinner and wrap at 23', async () => {
            const el: any = await fixture(html`
                <terra-date-picker
                    enable-time
                    inline
                    start-date="2024-03-20"
                ></terra-date-picker>
            `)
            await elementUpdated(el)

            // Set hour to 22
            el.startHour = 22
            await elementUpdated(el)

            const spinners = el.shadowRoot?.querySelectorAll(
                '.date-picker__time-spinner'
            )
            const upButton = spinners?.[0] as HTMLElement

            // Click up to go to 23
            upButton.click()
            await elementUpdated(el)
            expect(el.startHour).to.equal(23)

            // Click up again to wrap to 0
            upButton.click()
            await elementUpdated(el)
            expect(el.startHour).to.equal(0)
        })

        it('should decrement hour with down spinner and wrap at 0', async () => {
            const el: any = await fixture(html`
                <terra-date-picker
                    enable-time
                    inline
                    start-date="2024-03-20"
                ></terra-date-picker>
            `)
            await elementUpdated(el)

            // Set hour to 1
            el.startHour = 1
            await elementUpdated(el)

            const spinners = el.shadowRoot?.querySelectorAll(
                '.date-picker__time-spinner'
            )
            const downButton = spinners?.[1] as HTMLElement

            // Click down to go to 0
            downButton.click()
            await elementUpdated(el)
            expect(el.startHour).to.equal(0)

            // Click down again to wrap to 23
            downButton.click()
            await elementUpdated(el)
            expect(el.startHour).to.equal(23)
        })

        it('should update minutes independently from hours', async () => {
            const el: any = await fixture(html`
                <terra-date-picker
                    enable-time
                    inline
                    start-date="2024-03-20"
                ></terra-date-picker>
            `)
            await elementUpdated(el)

            el.startHour = 10
            el.startMinute = 30
            await elementUpdated(el)

            const inputs = el.shadowRoot?.querySelectorAll(
                '.date-picker__time-input'
            ) as NodeListOf<HTMLInputElement>
            const minuteInput = inputs[1]

            // Change minutes
            minuteInput.value = '45'
            minuteInput.dispatchEvent(new Event('input'))
            await elementUpdated(el)

            // Hour should remain unchanged, minute should update
            expect(el.startHour).to.equal(10)
            expect(el.startMinute).to.equal(45)
        })

        it('should display selected time in input field', async () => {
            const el: any = await fixture(html`
                <terra-date-picker
                    enable-time
                    inline
                    start-date="2024-03-20"
                ></terra-date-picker>
            `)
            await elementUpdated(el)

            // Set specific time
            el.startHour = 14
            el.startMinute = 30
            await elementUpdated(el)

            const input = el.shadowRoot?.querySelector('terra-input')
            expect(input?.value).to.include('14:30')
        })

        it('should preserve time when changing date', async () => {
            const el: any = await fixture(html`
                <terra-date-picker
                    enable-time
                    inline
                    start-date="2024-03-20T14:30:00Z"
                ></terra-date-picker>
            `)
            await elementUpdated(el)

            expect(el.startHour).to.equal(14)
            expect(el.startMinute).to.equal(30)

            // Select a different date
            const newDate = new Date(2024, 2, 25)
            await selectDate(el, newDate, true)

            // Time should remain unchanged
            expect(el.startHour).to.equal(14)
            expect(el.startMinute).to.equal(30)
        })

        it('should handle range mode with different times for start and end', async () => {
            const el: any = await fixture(html`
                <terra-date-picker
                    enable-time
                    inline
                    range
                    start-date="2024-03-20T10:00:00Z"
                    end-date="2024-03-22T15:30:00Z"
                ></terra-date-picker>
            `)
            await elementUpdated(el)

            expect(el.startHour).to.equal(10)
            expect(el.startMinute).to.equal(0)
            expect(el.endHour).to.equal(15)
            expect(el.endMinute).to.equal(30)

            const input = el.shadowRoot?.querySelector('terra-input')
            expect(input?.value).to.include('10:00:00')
            expect(input?.value).to.include('15:30:00')
        })

        it('should emit correct UTC time when time is changed', async () => {
            const el: any = await fixture(html`
                <terra-date-picker
                    enable-time
                    inline
                    start-date="2024-03-20"
                ></terra-date-picker>
            `)
            await elementUpdated(el)

            // Set time to 14:30
            el.startHour = 14
            el.startMinute = 30
            await elementUpdated(el)

            const eventPromise = oneEvent(el, 'terra-date-range-change')

            // Trigger change by selecting the same date again
            const date = new Date(2024, 2, 20)
            await selectDate(el, date, true)

            const event = await eventPromise

            // Should emit time in UTC
            expect(event.detail.startDate).to.include('T14:30:00')
            expect(event.detail.startDate).to.include('Z')
        })

        it('should handle midnight (00:00) correctly', async () => {
            const el: any = await fixture(html`
                <terra-date-picker
                    enable-time
                    inline
                    start-date="2024-03-20T00:00:00Z"
                ></terra-date-picker>
            `)
            await elementUpdated(el)

            expect(el.startHour).to.equal(0)
            expect(el.startMinute).to.equal(0)

            const input = el.shadowRoot?.querySelector('terra-input')
            expect(input?.value).to.include('00:00:00')
        })

        it('should handle end of day (23:59) correctly', async () => {
            const el: any = await fixture(html`
                <terra-date-picker
                    enable-time
                    inline
                    start-date="2024-03-20T23:59:00Z"
                ></terra-date-picker>
            `)
            await elementUpdated(el)

            expect(el.startHour).to.equal(23)
            expect(el.startMinute).to.equal(59)

            const input = el.shadowRoot?.querySelector('terra-input')
            expect(input?.value).to.include('23:59:00')
        })

        it('should validate end time >= start time when selecting same day in range mode', async () => {
            const el: any = await fixture(html`
                <terra-date-picker enable-time inline range></terra-date-picker>
            `)
            await elementUpdated(el)

            // Set times where end < start
            el.startHour = 16
            el.startMinute = 6
            el.endHour = 16
            el.endMinute = 0
            await elementUpdated(el)

            let invalidEventFired = false
            let invalidMessage = ''
            el.addEventListener('terra-date-selection-invalid', (e: any) => {
                invalidEventFired = true
                invalidMessage = e.detail.message
            })

            const eventPromise = oneEvent(el, 'terra-date-range-change')

            // Select same day for start
            const date1 = new Date(2024, 2, 15)
            await selectDate(el, date1, true)

            // Select same day for end (should allow selection but emit warning)
            const date2 = new Date(2024, 2, 15)
            await selectDate(el, date2, true)

            // Should still emit the change event
            const event = await eventPromise
            expect(event.detail.startDate).to.include('2024-03-15')
            expect(event.detail.endDate).to.include('2024-03-15')

            // But should also emit invalid event
            expect(invalidEventFired).to.be.true
            expect(invalidMessage).to.include('End time is before start time')

            // Range should still be set
            expect(el.selectedStart).to.not.be.null
            expect(el.selectedEnd).to.not.be.null
        })

        it('should allow same day selection when end time >= start time', async () => {
            const el: any = await fixture(html`
                <terra-date-picker enable-time inline range></terra-date-picker>
            `)
            await elementUpdated(el)

            // Set times where end >= start
            el.startHour = 10
            el.startMinute = 0
            el.startSecond = 0
            el.endHour = 16
            el.endMinute = 30
            el.endSecond = 59
            await elementUpdated(el)

            let invalidEventFired = false
            el.addEventListener('terra-date-selection-invalid', () => {
                invalidEventFired = true
            })

            const eventPromise = oneEvent(el, 'terra-date-range-change')

            // Select same day for start
            const date1 = new Date(2024, 2, 15)
            await selectDate(el, date1, true)

            // Select same day for end (should work fine)
            const date2 = new Date(2024, 2, 15)
            await selectDate(el, date2, true)

            expect(invalidEventFired).to.be.false

            const event = await eventPromise
            expect(event.detail.startDate).to.include('2024-03-15')
            expect(event.detail.startDate).to.include('T10:00:00')
            expect(event.detail.endDate).to.include('2024-03-15')
            expect(event.detail.endDate).to.include('T16:30:59')
        })

        it('should validate end time when manually entering same date in split inputs', async () => {
            const el: any = await fixture(html`
                <terra-date-picker
                    enable-time
                    inline
                    range
                    split-inputs
                ></terra-date-picker>
            `)
            await elementUpdated(el)

            // Set times where end < start
            el.startHour = 16
            el.startMinute = 6
            el.startSecond = 0
            el.endHour = 16
            el.endMinute = 0
            el.endSecond = 0
            await elementUpdated(el)

            const inputs = el.shadowRoot?.querySelectorAll('terra-input')
            const startInput = inputs?.[0]
            const endInput = inputs?.[1]

            // Type same date for start
            startInput!.value = '2024-03-15'
            startInput!.dispatchEvent(
                new Event('terra-blur', { bubbles: true, composed: true })
            )
            await elementUpdated(el)

            // Type same date for end (should trigger validation)
            endInput!.value = '2024-03-15'
            endInput!.dispatchEvent(
                new Event('terra-blur', { bubbles: true, composed: true })
            )
            await elementUpdated(el)

            expect(endInput!.validationMessage).to.include(
                'End time must be after start time'
            )
        })

        it('should support seconds in time picker', async () => {
            const el: any = await fixture(html`
                <terra-date-picker enable-time inline></terra-date-picker>
            `)
            await elementUpdated(el)

            // Select a date first to initialize
            const testDate = new Date(2024, 5, 10)
            await selectDate(el, testDate)
            await elementUpdated(el)

            // Set specific seconds value
            el.startSecond = 42
            await elementUpdated(el)

            // Verify seconds state is set correctly
            expect(el.startSecond).to.equal(42)

            // Get the display value through the input
            const input = el.shadowRoot?.querySelector('terra-input')
            expect(input?.value).to.include(':00:42')
        })

        it('should default end time seconds to 59', async () => {
            const el: any = await fixture(html`
                <terra-date-picker enable-time inline range></terra-date-picker>
            `)
            await elementUpdated(el)

            // Verify default end seconds is 59
            expect(el.endSecond).to.equal(59)
            expect(el.endMinute).to.equal(59)
            expect(el.endHour).to.equal(23)

            // Verify default start seconds is 0
            expect(el.startSecond).to.equal(0)
            expect(el.startMinute).to.equal(0)
            expect(el.startHour).to.equal(0)
        })
    })

    describe('Split Inputs', () => {
        it('should show two inputs when split-inputs and range are true', async () => {
            const el: any = await fixture(html`
                <terra-date-picker range split-inputs inline></terra-date-picker>
            `)
            await elementUpdated(el)

            const inputs = el.shadowRoot?.querySelectorAll('terra-input')
            expect(inputs?.length).to.equal(2)
        })

        it('should use custom start-label and end-label', async () => {
            const el: any = await fixture(html`
                <terra-date-picker
                    range
                    split-inputs
                    start-label="From"
                    end-label="To"
                ></terra-date-picker>
            `)
            await elementUpdated(el)

            const inputs = el.shadowRoot?.querySelectorAll('terra-input')
            expect(inputs?.[0]?.label).to.equal('From')
            expect(inputs?.[1]?.label).to.equal('To')
        })
    })

    describe('Inline Mode', () => {
        it('should show calendar when inline is true', async () => {
            const el: any = await fixture(html`
                <terra-date-picker inline></terra-date-picker>
            `)
            await elementUpdated(el)

            expect(el.isOpen).to.be.true
            const calendar = el.shadowRoot?.querySelector('.calendar')
            expect(calendar).to.exist
        })

        it('should not close calendar after selection when inline is true', async () => {
            const el: any = await fixture(html`
                <terra-date-picker inline></terra-date-picker>
            `)
            await elementUpdated(el)

            const date = new Date(2024, 2, 15)
            const dateButton = findDateButton(el, date, true)
            dateButton!.click()
            await elementUpdated(el)

            expect(el.isOpen).to.be.true
        })
    })

    describe('State Management', () => {
        it('should track isSelectingRange during range selection', async () => {
            const el: any = await fixture(html`
                <terra-date-picker range inline></terra-date-picker>
            `)
            await elementUpdated(el)

            // Select start date
            const startDate = new Date(2024, 2, 15)
            const startButton = findDateButton(el, startDate, true)
            startButton!.click()
            await elementUpdated(el)

            expect(el.isSelectingRange).to.be.true

            // Select end date
            const endDate = new Date(2024, 2, 20)
            const endButton = findDateButton(el, endDate, true)
            endButton!.click()
            await elementUpdated(el)

            expect(el.isSelectingRange).to.be.false
        })

        it('should track hoverDate during range selection', async () => {
            const el: any = await fixture(html`
                <terra-date-picker range inline></terra-date-picker>
            `)
            await elementUpdated(el)

            // Select start date
            const startDate = new Date(2024, 2, 15)
            const startButton = findDateButton(el, startDate, true)
            startButton!.click()
            await elementUpdated(el)

            // Hover over another date
            const hoverDate = new Date(2024, 2, 18)
            const hoverButton = findDateButton(el, hoverDate, true)
            hoverButton?.dispatchEvent(new MouseEvent('mouseenter'))
            await elementUpdated(el)

            expect(el.hoverDate).to.not.be.null
        })
    })

    describe('Date Validation', () => {
        describe('Without min/max dates', () => {
            it('should accept any date when no min/max is set', async () => {
                const el = await fixture<TerraDatePicker>(html`
                    <terra-date-picker inline split-inputs range></terra-date-picker>
                `)
                await elementUpdated(el)

                const startInput = el.shadowRoot?.querySelectorAll('terra-input')[0]
                expect(startInput).to.exist

                // Type a date
                startInput!.value = '2020-01-01'
                startInput!.dispatchEvent(new Event('terra-blur'))
                await elementUpdated(el)

                // Should not have validation error
                expect(startInput!.validationMessage).to.equal('')
            })

            it('should accept any date clicked from calendar when no min/max is set', async () => {
                const el = await fixture<TerraDatePicker>(html`
                    <terra-date-picker inline></terra-date-picker>
                `)
                await elementUpdated(el)

                const listener = oneEvent(el, 'terra-date-range-change')

                // Click any date
                const date = new Date(2020, 0, 15)
                await selectDate(el, date, true)

                const { detail } = await listener
                expect(detail.startDate).to.contain('2020-01-15')
            })
        })

        describe('With min/max dates (date only)', () => {
            it('should reject manually entered date before minDate', async () => {
                const el = await fixture<TerraDatePicker>(html`
                    <terra-date-picker
                        inline
                        split-inputs
                        range
                        min-date="2024-01-10"
                        max-date="2024-12-31"
                    ></terra-date-picker>
                `)
                await elementUpdated(el)

                const startInput = el.shadowRoot?.querySelectorAll('terra-input')[0]

                // Type a date before minDate
                startInput!.value = '2024-01-05'
                startInput!.dispatchEvent(new Event('terra-blur'))
                await elementUpdated(el)

                // Should have validation error
                expect(startInput!.validationMessage).to.contain('on or after')
            })

            it('should reject manually entered date after maxDate', async () => {
                const el = await fixture<TerraDatePicker>(html`
                    <terra-date-picker
                        inline
                        split-inputs
                        range
                        min-date="2024-01-01"
                        max-date="2024-12-31"
                    ></terra-date-picker>
                `)
                await elementUpdated(el)

                const endInput = el.shadowRoot?.querySelectorAll('terra-input')[1]

                // Type a date after maxDate
                endInput!.value = '2025-01-15'
                endInput!.dispatchEvent(new Event('terra-blur'))
                await elementUpdated(el)

                // Should have validation error
                expect(endInput!.validationMessage).to.contain('on or before')
            })

            it('should accept manually entered date within min/max range', async () => {
                const el = await fixture<TerraDatePicker>(html`
                    <terra-date-picker
                        inline
                        split-inputs
                        range
                        min-date="2024-01-01"
                        max-date="2024-12-31"
                    ></terra-date-picker>
                `)
                await elementUpdated(el)

                const startInput = el.shadowRoot?.querySelectorAll('terra-input')[0]

                // Type a date within range
                startInput!.value = '2024-06-15'
                startInput!.dispatchEvent(new Event('terra-blur'))
                await elementUpdated(el)

                // Should not have validation error
                expect(startInput!.validationMessage).to.equal('')
            })

            it('should emit invalid event when clicking disabled date before minDate', async () => {
                const el = await fixture<TerraDatePicker>(html`
                    <terra-date-picker
                        inline
                        min-date="2024-03-10"
                        max-date="2024-12-31"
                    ></terra-date-picker>
                `)
                await elementUpdated(el)

                let invalidEventFired = false
                el.addEventListener('terra-date-selection-invalid', () => {
                    invalidEventFired = true
                })

                // Directly call selectDate with a date before minDate
                const disabledDate = new Date(2024, 2, 5) // March 5
                el.selectDate(disabledDate)
                await elementUpdated(el)

                expect(invalidEventFired).to.be.true
            })

            it('should not select date when clicking disabled date after maxDate', async () => {
                const el = await fixture<TerraDatePicker>(html`
                    <terra-date-picker
                        inline
                        min-date="2024-01-01"
                        max-date="2024-03-15"
                    ></terra-date-picker>
                `)
                await elementUpdated(el)

                let invalidEventFired = false
                el.addEventListener('terra-date-selection-invalid', () => {
                    invalidEventFired = true
                })

                // Directly call selectDate with a date after maxDate
                const disabledDate = new Date(2024, 2, 20) // March 20
                el.selectDate(disabledDate)
                await elementUpdated(el)

                expect(invalidEventFired).to.be.true
                expect(el.selectedStart).to.be.null
            })

            it('should accept clicking valid date within min/max range', async () => {
                const el = await fixture<TerraDatePicker>(html`
                    <terra-date-picker
                        inline
                        min-date="2024-01-01"
                        max-date="2024-12-31"
                    ></terra-date-picker>
                `)
                await elementUpdated(el)

                const listener = oneEvent(el, 'terra-date-range-change')

                // Click a valid date
                const validDate = new Date(2024, 5, 15) // June 15
                await selectDate(el, validDate, true)

                const { detail } = await listener
                expect(detail.startDate).to.contain('2024-06-15')
            })
        })

        describe('With time enabled (no min/max)', () => {
            it('should accept manually entered datetime', async () => {
                const el = await fixture<TerraDatePicker>(html`
                    <terra-date-picker
                        inline
                        split-inputs
                        range
                        enable-time
                    ></terra-date-picker>
                `)
                await elementUpdated(el)

                const startInput = el.shadowRoot?.querySelectorAll('terra-input')[0]

                // Type a datetime
                startInput!.value = '2024-06-15 14:30:00'
                startInput!.dispatchEvent(new Event('terra-blur'))
                await elementUpdated(el)

                // Should not have validation error
                expect(startInput!.validationMessage).to.equal('')
            })
        })

        describe('With time enabled and min/max dates', () => {
            it('should reject manually entered time before minDate with time', async () => {
                const el = await fixture<TerraDatePicker>(html`
                    <terra-date-picker
                        inline
                        split-inputs
                        range
                        enable-time
                        min-date="2024-06-15T00:00:00.000Z"
                        max-date="2024-06-16T23:59:59.000Z"
                    ></terra-date-picker>
                `)
                await elementUpdated(el)

                const startInput = el.shadowRoot?.querySelectorAll('terra-input')[0]

                // Type a date before minDate
                startInput!.value = '2024-06-14 10:00:00'
                startInput!.dispatchEvent(new Event('terra-blur'))
                await elementUpdated(el)

                // Should have validation error
                expect(startInput!.validationMessage).to.contain('on or after')
            })

            it('should reject manually entered time after maxDate with time', async () => {
                const el = await fixture<TerraDatePicker>(html`
                    <terra-date-picker
                        inline
                        split-inputs
                        range
                        enable-time
                        min-date="2024-06-15T00:00:00.000Z"
                        max-date="2024-06-16T23:59:59.000Z"
                    ></terra-date-picker>
                `)
                await elementUpdated(el)

                const endInput = el.shadowRoot?.querySelectorAll('terra-input')[1]

                // Type a date after maxDate
                endInput!.value = '2024-06-17 10:00:00'
                endInput!.dispatchEvent(new Event('terra-blur'))
                await elementUpdated(el)

                // Should have validation error
                expect(endInput!.validationMessage).to.contain('on or before')
            })

            it('should accept manually entered time within min/max datetime range', async () => {
                const el = await fixture<TerraDatePicker>(html`
                    <terra-date-picker
                        inline
                        split-inputs
                        range
                        enable-time
                        min-date="2024-06-15T00:00:00.000Z"
                        max-date="2024-06-16T23:59:59.000Z"
                    ></terra-date-picker>
                `)
                await elementUpdated(el)

                const startInput = el.shadowRoot?.querySelectorAll('terra-input')[0]

                // Type a datetime within range
                startInput!.value = '2024-06-15 12:00:00'
                startInput!.dispatchEvent(new Event('terra-blur'))
                await elementUpdated(el)

                // Should not have validation error
                expect(startInput!.validationMessage).to.equal('')
            })

            it('should clear validation errors when clicking valid date from calendar', async () => {
                const el = await fixture<TerraDatePicker>(html`
                    <terra-date-picker
                        inline
                        split-inputs
                        range
                        enable-time
                        min-date="2024-06-15T00:00:00.000Z"
                        max-date="2024-06-20T23:59:59.000Z"
                    ></terra-date-picker>
                `)
                await elementUpdated(el)

                const startInput = el.shadowRoot?.querySelectorAll('terra-input')[0]

                // First, create an error by typing invalid date
                startInput!.value = '2024-06-10 10:00:00'
                startInput!.dispatchEvent(new Event('terra-blur'))
                await elementUpdated(el)

                expect(startInput!.validationMessage).to.not.equal('')

                // Now click a valid date
                const validDate = new Date(2024, 5, 16) // June 16
                await selectDate(el, validDate, true)
                await elementUpdated(el)

                // Validation error should be cleared
                expect(startInput!.validationMessage).to.equal('')
            })
        })

        describe('Edge cases', () => {
            it('should handle empty input gracefully', async () => {
                const el = await fixture<TerraDatePicker>(html`
                    <terra-date-picker
                        inline
                        split-inputs
                        range
                        min-date="2024-01-01"
                        max-date="2024-12-31"
                    ></terra-date-picker>
                `)
                await elementUpdated(el)

                const startInput = el.shadowRoot?.querySelectorAll('terra-input')[0]

                // Type empty and blur
                startInput!.value = ''
                startInput!.dispatchEvent(new Event('terra-blur'))
                await elementUpdated(el)

                // Should not have validation error
                expect(startInput!.validationMessage).to.equal('')
                expect(el.selectedStart).to.be.null
            })

            it('should handle invalid date format', async () => {
                const el = await fixture<TerraDatePicker>(html`
                    <terra-date-picker inline split-inputs range></terra-date-picker>
                `)
                await elementUpdated(el)

                const startInput = el.shadowRoot?.querySelectorAll('terra-input')[0]

                // Type invalid format
                startInput!.value = 'not-a-date'
                startInput!.dispatchEvent(new Event('terra-blur'))
                await elementUpdated(el)

                // Should have validation error
                expect(startInput!.validationMessage).to.contain('Invalid')
            })
        })
    })
})
