import type { CSSResultGroup } from 'lit'
import { html, nothing } from 'lit'
import { property, query, state } from 'lit/decorators.js'
import { createRef, ref } from 'lit/directives/ref.js'
import { Temporal } from 'temporal-polyfill'
import TerraElement from '../../internal/terra-element.js'
import componentStyles from '../../styles/component.styles.js'
import TerraAccordion from '../accordion/accordion.component.js'
import TerraButton from '../button/button.component.js'
import TerraDropdown from '../dropdown/dropdown.component.js'
import TerraInput from '../input/input.component.js'
import styles from './date-picker.styles.js'
import { to12Hour, to24Hour } from '../../utilities/date.js'

export interface DateRange {
    startDate: Temporal.PlainDate | Date | string | null
    endDate: Temporal.PlainDate | Date | string | null
}

export interface PresetRange {
    label: string
    getValue: () => DateRange
}

/**
 * @summary A date picker component that implements the Horizon Design System (HDS) Date Picker patterns. Supports single date selection or date range selection with calendar popup.
 * @documentation https://terra-ui.netlify.app/components/date-picker
 * @status stable
 * @since 1.0
 *
 * @dependency terra-input
 * @dependency terra-button
 * @dependency terra-dropdown
 * @dependency terra-accordion
 *
 * @slot - The default slot.
 *
 * @event terra-date-range-change - Emitted when a date selection is made or changed.
 * @eventDetail { startDate: string, endDate: string } - ISO date strings or YYYY-MM-DD format.
 *
 * @csspart base - The component's base wrapper.
 * @csspart input - The date input element (terra-input).
 * @csspart calendar - The calendar dropdown.
 * @csspart sidebar - The preset ranges sidebar.
 *
 * @cssproperty --terra-date-picker-* - All date picker design tokens from horizon.css are supported.
 */
export default class TerraDatePicker extends TerraElement {
    static styles: CSSResultGroup = [componentStyles, styles]
    static dependencies = {
        'terra-button': TerraButton,
        'terra-input': TerraInput,
        'terra-dropdown': TerraDropdown,
        'terra-accordion': TerraAccordion,
    }

    @property() id: string
    @property({ type: Boolean, reflect: true }) range = false
    @property({ attribute: 'min-date', reflect: true }) minDate?: string
    @property({ attribute: 'max-date', reflect: true }) maxDate?: string
    @property({ attribute: 'start-date', reflect: true }) startDate?: string
    @property({ attribute: 'end-date', reflect: true }) endDate?: string
    @property({ attribute: 'hide-label', type: Boolean }) hideLabel = false
    @property() label: string = 'Select Date'
    @property({ attribute: 'help-text' }) helpText = ''
    @property({ attribute: 'start-help-text' }) startHelpText = ''
    @property({ attribute: 'end-help-text' }) endHelpText = ''
    @property({ attribute: 'start-label' }) startLabel?: string
    @property({ attribute: 'end-label' }) endLabel?: string
    @property({ type: Boolean, attribute: 'show-presets' }) showPresets = false
    @property({ type: Array }) presets: PresetRange[] = []
    @property({ type: Boolean, attribute: 'enable-time' }) enableTime = false
    @property({ attribute: 'display-format' }) displayFormat?: string
    @property({ type: Boolean }) inline = false
    @property({ type: Boolean, attribute: 'split-inputs' }) splitInputs = false
    @property() placeholder: string = 'Select Date'
    @property() startPlaceholder: string = 'Start Date'
    @property() endPlaceholder: string = 'End Date'
    /** The ARIA role for the button. Defaults to 'group'. */
    @property({ reflect: true }) role: string | null = 'group'
    /** The ARIA label for the date picker. Defaults to 'Date picker'.*/
    @property({ reflect: true, attribute: 'aria-label' }) ariaLabel: string | null =
        'Date picker'
    @property({ type: Boolean }) hideClearAll = false
    @property() clearAllLabel: string = 'Clear Dates'
    @property({ type: Boolean, attribute: 'use-end-of-day' }) useEndOfDay = true
    @property({ attribute: 'closable', type: Boolean })
    showClose: boolean = false
    /** IANA timezone identifier for display (e.g. 'America/New_York'). Affects time display only; internal values remain UTC. */
    @property() timezone?: string
    /** Display time in 12-hour format with AM/PM. Requires enable-time. Internal values remain UTC. */
    @property({ type: Boolean, attribute: 'twelve-hour' }) twelveHour = false

    @state() isOpen = false
    @state() leftMonth: Temporal.PlainDate = Temporal.Now.plainDateISO().with({
        day: 1,
    })
    @state() rightMonth: Temporal.PlainDate = Temporal.Now.plainDateISO()
        .with({ day: 1 })
        .add({ months: 1 })
    @state() selectedStart: Temporal.PlainDate | null = null
    @state() selectedEnd: Temporal.PlainDate | null = null
    @state() hoverDate: Temporal.PlainDate | null = null
    @state() isSelectingRange = false
    @state() showLeftMonthDropdown = false
    @state() showRightMonthDropdown = false
    @state() startHour: number = 0
    @state() startMinute: number = 0
    @state() startSecond: number = 0
    @state() endHour: number = 23
    @state() endMinute: number = 59
    @state() endSecond: number = 59

    /** Screen size detection use to determine layout for mobile devices */

    @state()
    isMobile = false

    private mediaQuery = window.matchMedia('(max-width: 768px)')

    connectedCallback() {
        super.connectedCallback()

        this.isMobile = this.mediaQuery.matches
        this.mediaQuery.addEventListener('change', this.handleMediaChange)
    }

    private handleMediaChange = (event: MediaQueryListEvent) => {
        this.isMobile = event.matches
    }

    private getDefaultEndHour() {
        return this.useEndOfDay ? 23 : 0
    }

    private getDefaultEndMinute() {
        return this.useEndOfDay ? 59 : 0
    }

    private getDefaultEndSecond() {
        return this.useEndOfDay ? 59 : 0
    }

    /** Toggle the AM/PM period for the start or end time picker. */
    #togglePeriod(isStart: boolean) {
        const h = isStart ? this.startHour : this.endHour
        const d12 = to12Hour(h)
        const newPeriod: 'AM' | 'PM' = d12.period === 'AM' ? 'PM' : 'AM'
        const newH = to24Hour(d12.hour, newPeriod)
        if (isStart) {
            this.startHour = newH
        } else {
            this.endHour = newH
        }
        this.#emitChange()
        this.requestUpdate()
    }

    @query('.date-picker__dropdown') dropdown: HTMLElement
    dropdownRef = createRef<TerraDropdown>()

    private readonly DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
    private readonly MONTHS = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
    ]

    /**
     * Parse a date string (YYYY-MM-DD or ISO datetime) as a local date, avoiding timezone issues.
     * When you do `new Date("2024-03-20")`, JavaScript interprets it as UTC midnight,
     * which can cause off-by-one day errors when using getDate() in local timezone.
     * This function parses the date as a local date instead.
     *
     * When enableTime is true, datetime strings are parsed as UTC to match API min/max dates.
     */
    /**
     * Parse a date string (YYYY-MM-DD, ISO instant, or datetime) as a Temporal.PlainDate in the configured timezone.
     */
    #parseLocalDate(dateString: string): Temporal.PlainDate | null {
        if (!dateString) {
            return null
        }

        try {
            const dateOnlyPattern = /^\d{4}-\d{2}-\d{2}$/

            if (dateOnlyPattern.test(dateString)) {
                return Temporal.PlainDate.from(dateString)
            }

            if (dateString.endsWith('Z') || /[+-]\d{2}:\d{2}$/.test(dateString)) {
                const instant = Temporal.Instant.from(dateString)
                const zdt = instant.toZonedDateTimeISO(this.timezone || 'UTC')

                return zdt.toPlainDate()
            }

            const isoNaive = dateString.includes(' ')
                ? dateString.replace(' ', 'T')
                : dateString
            const pdt = Temporal.PlainDateTime.from(isoNaive)

            return pdt.toPlainDate()
        } catch {
            return null
        }
    }

    private initializeTimeFromDateString(dateString: string, isStart: boolean) {
        try {
            if (dateString.endsWith('Z') || /[+-]\d{2}:\d{2}$/.test(dateString)) {
                const instant = Temporal.Instant.from(dateString)
                const zdt = instant.toZonedDateTimeISO(this.timezone || 'UTC')

                if (isStart) {
                    this.startHour = zdt.hour
                    this.startMinute = zdt.minute
                    this.startSecond = zdt.second
                } else {
                    this.endHour = zdt.hour
                    this.endMinute = zdt.minute
                    this.endSecond = zdt.second
                }
            } else if (dateString.includes('T') || dateString.includes(' ')) {
                const isoNaive = dateString.includes(' ')
                    ? dateString.replace(' ', 'T')
                    : dateString
                const pdt = Temporal.PlainDateTime.from(isoNaive)

                if (isStart) {
                    this.startHour = pdt.hour
                    this.startMinute = pdt.minute
                    this.startSecond = pdt.second
                } else {
                    this.endHour = pdt.hour
                    this.endMinute = pdt.minute
                    this.endSecond = pdt.second
                }
            }
        } catch {
            // Keep default time
        }
    }

    /**
     * Normalizes a date representation (Temporal.PlainDate, Date object, or date/datetime string)
     * into a Temporal.PlainDate. Returns null if the date is falsy or cannot be parsed.
     */
    #toPlainDate(
        date: Temporal.PlainDate | Date | string | null | undefined
    ): Temporal.PlainDate | null {
        if (!date) {
            return null
        }

        if (typeof date === 'string') {
            return this.#parseLocalDate(date)
        }

        if (date instanceof Date) {
            return Temporal.Instant.fromEpochMilliseconds(date.getTime())
                .toZonedDateTimeISO(this.timezone || 'UTC')
                .toPlainDate()
        }

        return date
    }

    /**
     * Check if two dates are in the same calendar month and year
     */
    #isSameMonth(
        date1: Temporal.PlainDate | Date | null,
        date2: Temporal.PlainDate | Date | null
    ): boolean {
        const d1 = this.#toPlainDate(date1)
        const d2 = this.#toPlainDate(date2)

        if (!d1 || !d2) {
            return false
        }

        return d1.year === d2.year && d1.month === d2.month
    }

    /**
     * Check if a date's month/year matches a given month Date
     */
    #isDateInMonth(
        date: Temporal.PlainDate | Date | null,
        monthDate: Temporal.PlainDate | Date | null
    ): boolean {
        const d = this.#toPlainDate(date)
        const m = this.#toPlainDate(monthDate)

        if (!d || !m) {
            return false
        }

        return d.year === m.year && d.month === m.month
    }

    #getBounds(): { min?: Temporal.PlainDate; max?: Temporal.PlainDate } {
        const min = this.minDate
            ? (this.#parseLocalDate(this.minDate) ?? undefined)
            : undefined
        const max = this.maxDate
            ? (this.#parseLocalDate(this.maxDate) ?? undefined)
            : undefined

        return { min, max }
    }

    #doesRangeOverlapBounds(range: DateRange): boolean {
        const startDate = this.#toPlainDate(range.startDate)
        const endDate = this.#toPlainDate(range.endDate)
        const { min, max } = this.#getBounds()

        if (!this.range) {
            if (!startDate) {
                return false
            }

            if (min && Temporal.PlainDate.compare(startDate, min) < 0) {
                return false
            }

            if (max && Temporal.PlainDate.compare(startDate, max) > 0) {
                return false
            }

            return true
        }

        if (!min && !max) {
            return true
        }

        if (min && endDate && Temporal.PlainDate.compare(endDate, min) < 0) {
            return false
        }

        if (max && startDate && Temporal.PlainDate.compare(startDate, max) > 0) {
            return false
        }

        return true
    }

    #isPresetWithinBounds(range: DateRange): boolean {
        return this.#doesRangeOverlapBounds(range)
    }

    get #filteredPresets(): PresetRange[] {
        const source =
            this.presets?.length > 0 ? this.presets : this.#getDefaultPresets()

        return source.filter(preset => this.#isPresetWithinBounds(preset.getValue()))
    }

    open() {
        this.isOpen = true

        // If a max date is provided and no explicit selection exists,
        // open the calendar to the max date's month (right calendar in range mode)
        if (this.maxDate && !this.selectedStart && !this.selectedEnd) {
            const max = this.#parseLocalDate(this.maxDate)

            if (max) {
                if (this.range) {
                    this.rightMonth = max.with({ day: 1 })
                    this.leftMonth = max.with({ day: 1 }).subtract({ months: 1 })
                } else {
                    this.leftMonth = max.with({ day: 1 })
                }
            }
        }

        // Open the dropdown if not inline
        if (!this.inline && this.dropdownRef.value) {
            this.dropdownRef.value.show()
        }

        this.requestUpdate()
    }

    close() {
        this.isOpen = false
        // Close the dropdown if not inline
        if (!this.inline && this.dropdownRef.value) {
            this.dropdownRef.value.hide()
        }
        this.requestUpdate()
    }

    /**
     * Clears the selected date(s) and resets the date picker to its initial state.
     */
    clear() {
        this.selectedStart = null
        this.selectedEnd = null
        this.hoverDate = null
        this.isSelectingRange = false

        // Reset time to defaults
        this.startHour = 0
        this.startMinute = 0
        this.startSecond = 0
        this.endHour = this.getDefaultEndHour()
        this.endMinute = this.getDefaultEndMinute()
        this.endSecond = this.getDefaultEndSecond()

        this.clearInputValidation()

        this.requestUpdate()

        this.#emitChange()
    }

    setOpen(open: boolean) {
        if (open) {
            this.open()
        } else {
            this.close()
        }
    }

    /**
     * Programmatically select a date.
     */
    selectDate(date: Temporal.PlainDate | Date) {
        this.#selectDate(date)
    }

    willUpdate(changedProperties: Map<PropertyKey, unknown>) {
        super.willUpdate(changedProperties)

        // Handle useEndOfDay property changes
        if (changedProperties.has('useEndOfDay')) {
            // Reset end times to match the new useEndOfDay setting
            this.endHour = this.getDefaultEndHour()
            this.endMinute = this.getDefaultEndMinute()
            this.endSecond = this.getDefaultEndSecond()
        }

        // Handle inline property changes
        if (changedProperties.has('inline')) {
            if (this.inline) {
                this.isOpen = true
                // Close dropdown when switching to inline mode
                if (this.dropdownRef.value) {
                    this.dropdownRef.value.hide()
                }
            }
        }

        // Handle minDate/maxDate changes
        if (changedProperties.has('minDate') || changedProperties.has('maxDate')) {
            // When minDate or maxDate changes (e.g., from async API call),
            // update calendar view to show the maxDate if no selection exists yet
            if (this.maxDate && !this.selectedStart && !this.selectedEnd) {
                const max = this.#parseLocalDate(this.maxDate)

                if (max) {
                    if (this.range) {
                        this.rightMonth = max.with({ day: 1 })
                        this.leftMonth = max.with({ day: 1 }).subtract({ months: 1 })
                    } else {
                        this.leftMonth = max.with({ day: 1 })
                    }
                }
            }
        }

        // Handle startDate/endDate/timezone/enableTime changes
        const datePropsChanged =
            changedProperties.has('startDate') ||
            changedProperties.has('endDate') ||
            changedProperties.has('timezone') ||
            changedProperties.has('enableTime')

        if (datePropsChanged) {
            // Sync internal state with props when they change
            if (this.startDate) {
                const start = this.#parseLocalDate(this.startDate)

                if (start) {
                    this.selectedStart = start

                    if (this.enableTime) {
                        this.initializeTimeFromDateString(this.startDate, true)
                    }
                }
            } else if (changedProperties.has('startDate')) {
                this.selectedStart = null
            }

            if (this.range) {
                if (this.endDate) {
                    const end = this.#parseLocalDate(this.endDate)

                    if (end) {
                        this.selectedEnd = end
                        if (this.enableTime) {
                            this.initializeTimeFromDateString(this.endDate, false)
                        }
                    }
                } else if (changedProperties.has('endDate')) {
                    this.selectedEnd = null
                }

                if (this.selectedStart) {
                    this.#updateMonthViews()
                }
            } else {
                // Single date mode - always update left month
                if (this.selectedStart) {
                    this.leftMonth = this.selectedStart.with({ day: 1 })
                }

                this.selectedEnd = null
            }
        }
    }

    #getDefaultPresets(): PresetRange[] {
        const getToday = (): Temporal.PlainDate => {
            const tz = this.timezone || (this.enableTime ? 'UTC' : undefined)

            return Temporal.Now.plainDateISO(tz)
        }

        const presets: PresetRange[] = [
            {
                label: 'Today',
                getValue: () => {
                    const today = getToday()

                    return {
                        startDate: today,
                        endDate: this.range ? today : null,
                    }
                },
            },
            {
                label: 'Yesterday',
                getValue: () => {
                    const yesterday = getToday().subtract({ days: 1 })

                    return {
                        startDate: yesterday,
                        endDate: this.range ? yesterday : null,
                    }
                },
            },
            {
                label: 'Last 7 days',
                getValue: () => {
                    const end = getToday()

                    return {
                        startDate: end.subtract({ days: 6 }),
                        endDate: end,
                    }
                },
            },
            {
                label: 'Last 30 days',
                getValue: () => {
                    const end = getToday()

                    return {
                        startDate: end.subtract({ days: 29 }),
                        endDate: end,
                    }
                },
            },
            {
                label: 'Last 6 months',
                getValue: () => {
                    const end = getToday()

                    return {
                        startDate: end.subtract({ months: 6 }),
                        endDate: end,
                    }
                },
            },
            {
                label: 'Last year',
                getValue: () => {
                    const end = getToday()

                    return {
                        startDate: end.subtract({ years: 1 }),
                        endDate: end,
                    }
                },
            },
        ]

        const { min, max } = this.#getBounds()

        if (min && max) {
            presets.push({
                label: 'All time',
                getValue: () => ({ startDate: min, endDate: max }),
            })
        }

        return presets
    }

    firstUpdated() {
        // Parse dates from URL or props
        const params = new URLSearchParams(window.location.search)
        const timeStartParam = params.get('time_start') || this.startDate
        const timeEndParam = params.get('time_end') || this.endDate

        if (timeStartParam) {
            this.selectedStart = this.#parseLocalDate(timeStartParam)

            if (this.selectedStart) {
                this.leftMonth = this.selectedStart.with({ day: 1 })
            }

            if (this.enableTime) {
                this.initializeTimeFromDateString(timeStartParam, true)
            }
        }

        if (this.range && timeEndParam) {
            this.selectedEnd = this.#parseLocalDate(timeEndParam)

            if (this.enableTime) {
                this.initializeTimeFromDateString(timeEndParam, false)
            }
        }

        if (this.range) {
            if (this.selectedStart && this.selectedEnd) {
                if (this.#isSameMonth(this.selectedStart, this.selectedEnd)) {
                    this.rightMonth = this.selectedStart
                        .with({ day: 1 })
                        .add({ months: 1 })
                } else {
                    this.rightMonth = this.selectedEnd.with({ day: 1 })
                }
            } else if (this.selectedEnd) {
                this.rightMonth = this.selectedEnd.with({ day: 1 })
            } else if (!timeEndParam) {
                const left =
                    this.#toPlainDate(this.leftMonth) ?? Temporal.Now.plainDateISO()
                this.rightMonth = left.add({ months: 1 })
            }
        }

        // If inline mode, always show the calendar
        if (this.inline) {
            this.isOpen = true
        }
    }

    disconnectedCallback() {
        this.mediaQuery.removeEventListener('change', this.handleMediaChange)
        super.disconnectedCallback()
        // Dropdown handles its own cleanup
    }

    private handleDropdownShow() {
        this.isOpen = true
    }

    private handleDropdownHide() {
        this.isOpen = false
    }

    #formatDisplayDate(
        date: Temporal.PlainDate | Date | null,
        isStart: boolean = true
    ): string {
        if (!date) return ''

        let plainDate: Temporal.PlainDate

        if (date instanceof Date) {
            plainDate = Temporal.Instant.fromEpochMilliseconds(date.getTime())
                .toZonedDateTimeISO(this.timezone || 'UTC')
                .toPlainDate()
        } else {
            plainDate = date
        }

        const year = plainDate.year.toString()
        const month = String(plainDate.month).padStart(2, '0')
        const day = String(plainDate.day).padStart(2, '0')

        // When time is enabled, format using the configured display format
        if (this.enableTime) {
            const hour = isStart ? this.startHour : this.endHour
            const minute = isStart ? this.startMinute : this.endMinute
            const second = isStart ? this.startSecond : this.endSecond

            // When twelveHour is enabled and no custom displayFormat, use 12h format with AM/PM
            if (this.twelveHour && !this.displayFormat) {
                const d12 = to12Hour(hour)
                const hours = String(d12.hour).padStart(2, '0')
                const minutes = String(minute).padStart(2, '0')
                const seconds = String(second).padStart(2, '0')

                return `${year}-${month}-${day} ${hours}:${minutes}:${seconds} ${d12.period}`
            }

            const hours = String(hour).padStart(2, '0')
            const minutes = String(minute).padStart(2, '0')
            const seconds = String(second).padStart(2, '0')
            const effectiveFormat = this.displayFormat || 'YYYY-MM-DD HH:mm:ss'

            return effectiveFormat
                .replace('YYYY', year)
                .replace('MM', month)
                .replace('DD', day)
                .replace('HH', hours)
                .replace('mm', minutes)
                .replace('ss', seconds)
        }

        const format = this.displayFormat || 'YYYY-MM-DD'

        return format.replace('YYYY', year).replace('MM', month).replace('DD', day)
    }

    #getDisplayValue() {
        if (this.range) {
            if (this.selectedStart && this.selectedEnd) {
                return `${this.#formatDisplayDate(this.selectedStart, true)} – ${this.#formatDisplayDate(this.selectedEnd, false)}`
            } else if (this.selectedStart) {
                return this.#formatDisplayDate(this.selectedStart, true)
            }
            return ''
        } else {
            return this.selectedStart
                ? this.#formatDisplayDate(this.selectedStart, true)
                : ''
        }
    }

    #getStartDateDisplayValue() {
        return this.selectedStart
            ? this.#formatDisplayDate(this.selectedStart, true)
            : ''
    }

    #getEndDateDisplayValue() {
        return this.selectedEnd
            ? this.#formatDisplayDate(this.selectedEnd, false)
            : ''
    }

    #parseAndFormatDate(dateStr: string) {
        const trimmed = dateStr.trim()

        if (!trimmed) {
            return null
        }

        const dateOnlyPattern = /^\d{4}-\d{2}-\d{2}$/
        const dateTimePattern =
            /^\d{4}-\d{2}-\d{2}[T\s]\d{1,2}:\d{2}(:\d{2})?(\s*(AM|PM))?$/i

        if (dateOnlyPattern.test(trimmed)) {
            const parsed = this.#parseLocalDate(trimmed)

            if (!parsed) {
                return null
            }

            return trimmed
        }

        if (this.enableTime && dateTimePattern.test(trimmed)) {
            const amPmMatch = trimmed.match(/\s*(AM|PM)$/i)
            const amPm = amPmMatch
                ? (amPmMatch[1].toUpperCase() as 'AM' | 'PM')
                : null
            const withoutAmPm = amPm
                ? trimmed.slice(0, -amPmMatch![0].length).trim()
                : trimmed
            const [datePart, timePart] = withoutAmPm.split(/[T\s]+/)
            const parsed = this.#parseLocalDate(datePart)

            if (!parsed) {
                return null
            }

            const timeComponents = timePart.split(':').map(Number)
            const minutes = timeComponents[1] || 0
            const seconds = timeComponents[2] || 0
            let hours = timeComponents[0] || 0

            if (amPm) {
                hours = to24Hour(hours, amPm)
            }

            return `${parsed.toString()} ${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
        }

        const parsed = this.#parseLocalDate(trimmed)

        if (!parsed) {
            return null
        }

        return parsed.toString()
    }

    private clearInputValidation() {
        const inputs = this.renderRoot.querySelectorAll<TerraInput>('terra-input')
        inputs.forEach(input => {
            input.setCustomValidity('')
        })
    }

    /**
     * Format a date string for display in error messages
     * When time is disabled, only show the date portion (YYYY-MM-DD)
     */
    private formatDateForError(dateString: string): string {
        if (!this.enableTime) {
            // Extract just the date portion (YYYY-MM-DD) from ISO string
            return dateString.split('T')[0]
        }
        return dateString
    }

    /**
     * Set validation error on input and emit invalid event
     */
    private setInputValidationError(input: TerraInput, message: string) {
        input.setCustomValidity(message)
        // Force validation message to display immediately by directly updating the internal state
        // The terra-input's blur handler already ran, so we need to manually trigger the message update
        requestAnimationFrame(() => {
            // Access the internal validation message property to force display
            ;(input as any).validationErrorMessage = message
            input.requestUpdate()
        })
        this.emit('terra-date-selection-invalid', {
            detail: { message },
        })
    }

    #handleInputBlur(event: Event) {
        const input = event.target as TerraInput
        const value = input.value || ''

        if (!value.trim()) {
            this.selectedStart = null
            this.selectedEnd = null
            input.setCustomValidity('')
            this.#emitChange()
            return
        }

        if (this.range) {
            // Normalize bare hyphen between DD and YYYY (e.g. 2024-03-15-2024-03-16)
            // by inserting spaces so the split below can find it
            const normalized = value.replace(/(\d{2})-(\d{4})/, '$1 - $2')
            // Split by en-dash (with or without spaces) or space-hyphen-space
            const parts = normalized.split(/\s*–\s*|\s+-\s+/)
            if (parts.length !== 2) {
                const message =
                    'Date range must be in format: YYYY-MM-DD – YYYY-MM-DD'
                this.setInputValidationError(input, message)
                return
            }

            const startFormatted = this.#parseAndFormatDate(parts[0])
            const endFormatted = this.#parseAndFormatDate(parts[1])

            if (!startFormatted) {
                const message = 'Invalid start date format'
                this.setInputValidationError(input, message)
                return
            }
            if (!endFormatted) {
                const message = 'Invalid end date format'
                this.setInputValidationError(input, message)
                return
            }

            let start: Temporal.PlainDate | null
            let end: Temporal.PlainDate | null

            if (this.enableTime && startFormatted.length > 10) {
                const [sdp, stp] = startFormatted.split(/[T\s]+/)

                start = this.#parseLocalDate(sdp)

                const stc = stp.split(':').map(Number)
                this.startHour = stc[0] || 0
                this.startMinute = stc[1] || 0
                this.startSecond = stc[2] || 0
            } else {
                start = this.#parseLocalDate(startFormatted)
            }

            if (this.enableTime && endFormatted.length > 10) {
                const [edp, etp] = endFormatted.split(/[T\s]+/)

                end = this.#parseLocalDate(edp)

                const etc = etp.split(':').map(Number)
                this.endHour = etc[0] || 0
                this.endMinute = etc[1] || 0
                this.endSecond = etc[2] || 0
            } else {
                end = this.#parseLocalDate(endFormatted)
            }

            if (!start || !end) {
                this.setInputValidationError(input, 'Invalid date format')

                return
            }

            // Auto-swap if dates are in wrong order
            let finalStart = start
            let finalEnd = end
            if (Temporal.PlainDate.compare(start, end) > 0) {
                finalStart = end
                finalEnd = start
            }

            // Validate against min/max dates
            const { min, max } = this.#getBounds()
            if (min && Temporal.PlainDate.compare(finalStart, min) < 0) {
                const message = `Start date must be on or after ${this.formatDateForError(this.minDate!)}`
                this.setInputValidationError(input, message)
                return
            }
            if (max && Temporal.PlainDate.compare(finalEnd, max) > 0) {
                const message = `End date must be on or before ${this.formatDateForError(this.maxDate!)}`
                this.setInputValidationError(input, message)
                return
            }

            this.selectedStart = finalStart
            this.selectedEnd = finalEnd
            this.#updateMonthViews()
            input.value = `${this.#formatDisplayDate(finalStart, true)} – ${this.#formatDisplayDate(finalEnd, false)}`
            input.setCustomValidity('')
            this.#emitChange()
        } else {
            const formatted = this.#parseAndFormatDate(value)
            const message = 'Invalid date format'

            if (!formatted) {
                this.setInputValidationError(input, message)
                return
            }

            let date: Temporal.PlainDate | null
            if (this.enableTime && formatted.length > 10) {
                const [dp, tp] = formatted.split(/[T\s]+/)
                date = this.#parseLocalDate(dp)
                const tc = tp.split(':').map(Number)
                this.startHour = tc[0] || 0
                this.startMinute = tc[1] || 0
                this.startSecond = tc[2] || 0
            } else {
                date = this.#parseLocalDate(formatted)
            }

            if (!date) {
                this.setInputValidationError(input, message)

                return
            }

            // Validate against min/max dates
            const { min, max } = this.#getBounds()

            if (min && Temporal.PlainDate.compare(date, min) < 0) {
                const message = `Date must be on or after ${this.formatDateForError(this.minDate!)}`

                this.setInputValidationError(input, message)

                return
            }
            if (max && Temporal.PlainDate.compare(date, max) > 0) {
                const message = `Date must be on or before ${this.formatDateForError(this.maxDate!)}`

                this.setInputValidationError(input, message)

                return
            }

            this.selectedStart = date
            this.selectedEnd = null
            this.#updateMonthViews()
            input.value = this.#formatDisplayDate(date, true)
            input.setCustomValidity('')

            this.#emitChange()
        }
    }

    #handleStartInputBlur(event: Event) {
        const input = event.target as TerraInput
        const value = input.value || ''

        if (!value.trim()) {
            this.selectedStart = null

            input.setCustomValidity('')
            this.#emitChange()

            return
        }

        const formatted = this.#parseAndFormatDate(value)

        if (!formatted) {
            const message = 'Invalid date format'

            this.setInputValidationError(input, message)

            return
        }

        let date: Temporal.PlainDate | null

        if (this.enableTime && formatted.length > 10) {
            const [dp, tp] = formatted.split(/[T\s]+/)

            date = this.#parseLocalDate(dp)

            const tc = tp.split(':').map(Number)
            this.startHour = tc[0] || 0
            this.startMinute = tc[1] || 0
            this.startSecond = tc[2] || 0
        } else {
            date = this.#parseLocalDate(formatted)
        }

        if (!date) {
            this.setInputValidationError(input, 'Invalid date format')

            return
        }

        // Validate against min/max
        const { min, max } = this.#getBounds()
        if (min && Temporal.PlainDate.compare(date, min) < 0) {
            const message = `Date must be on or after ${this.formatDateForError(this.minDate!)}`
            this.setInputValidationError(input, message)

            return
        }
        if (max && Temporal.PlainDate.compare(date, max) > 0) {
            const message = `Date must be on or before ${this.formatDateForError(this.maxDate!)}`
            this.setInputValidationError(input, message)

            return
        }

        // Validate start is before end if end exists
        if (
            this.selectedEnd &&
            Temporal.PlainDate.compare(date, this.selectedEnd) > 0
        ) {
            const message = 'Start date must be before end date'
            this.setInputValidationError(input, message)

            return
        }

        this.selectedStart = date
        this.leftMonth = date.with({ day: 1 })
        input.value = this.#formatDisplayDate(date, true)
        input.setCustomValidity('')

        this.#emitChange()
    }

    #handleEndInputBlur(event: Event) {
        const input = event.target as TerraInput
        const value = input.value || ''

        if (!value.trim()) {
            this.selectedEnd = null
            input.setCustomValidity('')

            this.#emitChange()

            return
        }

        const formatted = this.#parseAndFormatDate(value)
        if (!formatted) {
            const message = 'Invalid date format'
            this.setInputValidationError(input, message)

            return
        }

        let date: Temporal.PlainDate | null

        if (this.enableTime && formatted.length > 10) {
            const [dp, tp] = formatted.split(/[T\s]+/)

            date = this.#parseLocalDate(dp)

            const tc = tp.split(':').map(Number)
            this.endHour = tc[0] || 0
            this.endMinute = tc[1] || 0
            this.endSecond = tc[2] || 0
        } else {
            date = this.#parseLocalDate(formatted)
        }

        if (!date) {
            this.setInputValidationError(input, 'Invalid date format')

            return
        }

        // Validate against min/max
        const { min, max } = this.#getBounds()
        if (min && Temporal.PlainDate.compare(date, min) < 0) {
            const message = `Date must be on or after ${this.formatDateForError(this.minDate!)}`
            this.setInputValidationError(input, message)

            return
        }
        if (max && Temporal.PlainDate.compare(date, max) > 0) {
            const message = `Date must be on or before ${this.formatDateForError(this.maxDate!)}`
            this.setInputValidationError(input, message)

            return
        }

        // Validate end is after start if start exists
        if (this.selectedStart) {
            if (this.enableTime && this.#isSameDay(date, this.selectedStart)) {
                // When time is enabled and dates are the same, validate time instead of full datetime
                const startTimeSeconds =
                    this.startHour * 3600 + this.startMinute * 60 + this.startSecond
                const endTimeSeconds =
                    this.endHour * 3600 + this.endMinute * 60 + this.endSecond
                if (endTimeSeconds < startTimeSeconds) {
                    const message =
                        'End time must be after start time when dates are the same'
                    this.setInputValidationError(input, message)
                    return
                }
            } else if (Temporal.PlainDate.compare(date, this.selectedStart) < 0) {
                // Different dates or time not enabled - compare full datetime
                const message = 'End date must be after start date'
                this.setInputValidationError(input, message)

                return
            }
        }

        this.selectedEnd = date
        if (
            this.selectedStart &&
            this.#isSameMonth(this.selectedStart, this.selectedEnd)
        ) {
            this.rightMonth = this.selectedStart.with({ day: 1 }).add({ months: 1 })
        } else {
            this.rightMonth = date.with({ day: 1 })
        }

        input.value = this.#formatDisplayDate(date, false)
        input.setCustomValidity('')

        this.#emitChange()
    }

    #updateMonthViews() {
        if (this.selectedStart && this.range && this.selectedEnd) {
            const isSingleMonthRange = this.#isSameMonth(
                this.selectedStart,
                this.selectedEnd
            )

            if (isSingleMonthRange) {
                // Case 1: Left calendar already shows the selection month
                if (this.#isDateInMonth(this.selectedStart, this.leftMonth)) {
                    this.leftMonth = this.selectedStart.with({ day: 1 })
                    // If right calendar also shows the same month (initial load scenario),
                    // set it to the next month. Otherwise, preserve user's navigation.
                    if (this.#isDateInMonth(this.selectedStart, this.rightMonth)) {
                        this.rightMonth = this.selectedStart
                            .with({ day: 1 })
                            .add({ months: 1 })
                    }
                }
                // Case 2: Right calendar already shows the selection month
                else if (this.#isDateInMonth(this.selectedStart, this.rightMonth)) {
                    this.rightMonth = this.selectedStart.with({ day: 1 })
                }
                // Case 3: Neither calendar shows the selection month
                else {
                    this.leftMonth = this.selectedStart.with({ day: 1 })
                }
            } else {
                // Range spans multiple months - update both calendars normally
                this.leftMonth = this.selectedStart.with({ day: 1 })
                this.rightMonth = this.selectedEnd.with({ day: 1 })
            }
        } else if (this.selectedStart) {
            this.leftMonth = this.selectedStart.with({ day: 1 })

            if (this.range) {
                const left =
                    this.#toPlainDate(this.leftMonth) ?? Temporal.Now.plainDateISO()
                this.rightMonth = left.add({ months: 1 })
            }
        }
    }

    #handleKeydown(event: KeyboardEvent) {
        // Prevent space from opening dropdown when typing
        if (event.key === ' ') {
            event.stopPropagation()
            return
        }
        if (event.key === 'Enter') {
            event.preventDefault()
            this.#handleInputBlur(event)
        }
    }

    #previousMonth(isLeft: boolean) {
        if (isLeft) {
            const current =
                this.#toPlainDate(this.leftMonth) ?? Temporal.Now.plainDateISO()
            this.leftMonth = current.subtract({ months: 1 })
        } else {
            const current =
                this.#toPlainDate(this.rightMonth) ?? Temporal.Now.plainDateISO()
            this.rightMonth = current.subtract({ months: 1 })
        }
    }

    #nextMonth(isLeft: boolean) {
        if (isLeft) {
            const current =
                this.#toPlainDate(this.leftMonth) ?? Temporal.Now.plainDateISO()
            this.leftMonth = current.add({ months: 1 })
        } else {
            const current =
                this.#toPlainDate(this.rightMonth) ?? Temporal.Now.plainDateISO()
            this.rightMonth = current.add({ months: 1 })
        }
    }

    private toggleMonthDropdown(isLeft: boolean, event: Event) {
        event.stopPropagation()
        if (isLeft) {
            this.showLeftMonthDropdown = !this.showLeftMonthDropdown
            this.showRightMonthDropdown = false
        } else {
            this.showRightMonthDropdown = !this.showRightMonthDropdown
            this.showLeftMonthDropdown = false
        }
    }

    #selectMonth(month: number, isLeft: boolean) {
        if (isLeft) {
            const current =
                this.#toPlainDate(this.leftMonth) ?? Temporal.Now.plainDateISO()
            this.leftMonth = current.with({ month: month + 1, day: 1 })
            this.showLeftMonthDropdown = false
        } else {
            const current =
                this.#toPlainDate(this.rightMonth) ?? Temporal.Now.plainDateISO()
            this.rightMonth = current.with({ month: month + 1, day: 1 })
            this.showRightMonthDropdown = false
        }
    }

    #changeYear(delta: number, isLeft: boolean) {
        if (isLeft) {
            const current =
                this.#toPlainDate(this.leftMonth) ?? Temporal.Now.plainDateISO()
            this.leftMonth = current.add({ years: delta })
        } else {
            const current =
                this.#toPlainDate(this.rightMonth) ?? Temporal.Now.plainDateISO()
            this.rightMonth = current.add({ years: delta })
        }
    }

    #handleYearInput(event: Event, isLeft: boolean) {
        const input = event.target as HTMLInputElement
        const year = parseInt(input.value, 10)

        if (!Number.isNaN(year) && year >= 1900 && year <= 2100) {
            if (isLeft) {
                const current =
                    this.#toPlainDate(this.leftMonth) ?? Temporal.Now.plainDateISO()
                this.leftMonth = current.with({ year })
            } else {
                const current =
                    this.#toPlainDate(this.rightMonth) ?? Temporal.Now.plainDateISO()
                this.rightMonth = current.with({ year })
            }
        }
    }

    #getDaysInMonth(month: Temporal.PlainDate | Date): Temporal.PlainDate[] {
        const plainMonth = this.#toPlainDate(month) ?? Temporal.Now.plainDateISO()
        const firstDay = plainMonth.with({ day: 1 })
        const daysInMonth = firstDay.daysInMonth
        const days: Temporal.PlainDate[] = []

        // Add previous month's trailing days (Sunday is first day of week)
        const firstDayOfWeek = firstDay.dayOfWeek % 7
        for (let i = firstDayOfWeek; i > 0; i--) {
            days.push(firstDay.subtract({ days: i }))
        }

        // Add current month's days
        for (let i = 0; i < daysInMonth; i++) {
            days.push(firstDay.add({ days: i }))
        }

        // Add next month's leading days to complete the week
        const remainingDays = 7 - (days.length % 7)
        if (remainingDays < 7) {
            const nextMonthFirst = firstDay.add({ months: 1 })
            for (let i = 0; i < remainingDays; i++) {
                days.push(nextMonthFirst.add({ days: i }))
            }
        }

        return days
    }

    #isSameDay(
        date1: Temporal.PlainDate | Date | null,
        date2: Temporal.PlainDate | Date | null
    ): boolean {
        if (!date1 || !date2) {
            return false
        }

        const p1 = this.#toPlainDate(date1)
        const p2 = this.#toPlainDate(date2)

        return p1 && p2 ? p1.equals(p2) : false
    }

    #isInRange(date: Temporal.PlainDate | Date): boolean {
        if (!this.selectedStart || !this.selectedEnd) {
            return false
        }

        const plainDate = this.#toPlainDate(date)

        if (!plainDate) {
            return false
        }

        return (
            Temporal.PlainDate.compare(plainDate, this.selectedStart) >= 0 &&
            Temporal.PlainDate.compare(plainDate, this.selectedEnd) <= 0
        )
    }

    #isInHoverRange(date: Temporal.PlainDate | Date): boolean {
        if (
            !this.range ||
            !this.selectedStart ||
            !this.hoverDate ||
            this.selectedEnd
        ) {
            return false
        }

        const plainDate = this.#toPlainDate(date)

        if (!plainDate) {
            return false
        }

        const isStartBeforeHover =
            Temporal.PlainDate.compare(this.selectedStart, this.hoverDate) <= 0
        const min = isStartBeforeHover ? this.selectedStart : this.hoverDate
        const max = isStartBeforeHover ? this.hoverDate : this.selectedStart

        return (
            Temporal.PlainDate.compare(plainDate, min) >= 0 &&
            Temporal.PlainDate.compare(plainDate, max) <= 0
        )
    }

    #isDisabled(date: Temporal.PlainDate | Date): boolean {
        const plainDate = this.#toPlainDate(date)

        if (!plainDate) {
            return false
        }

        const { min, max } = this.#getBounds()

        if (min && Temporal.PlainDate.compare(plainDate, min) < 0) {
            return true
        }

        if (max && Temporal.PlainDate.compare(plainDate, max) > 0) {
            return true
        }

        return false
    }

    #selectDate(date: Temporal.PlainDate | Date) {
        const plainDate = this.#toPlainDate(date)

        if (!plainDate) {
            return
        }

        if (this.#isDisabled(plainDate)) {
            this.emit('terra-date-selection-invalid', {
                detail: {
                    message: `You are not allowed to select dates outside ${this.minDate} to ${this.maxDate}.`,
                },
            })

            return
        }

        this.clearInputValidation()

        if (this.range) {
            if (!this.selectedStart || this.selectedEnd) {
                // Start new selection
                this.selectedStart = plainDate
                this.selectedEnd = null
                this.isSelectingRange = true
            } else {
                // Complete the range
                if (Temporal.PlainDate.compare(plainDate, this.selectedStart) < 0) {
                    this.selectedEnd = this.selectedStart
                    this.selectedStart = plainDate
                } else {
                    this.selectedEnd = plainDate
                }

                this.isSelectingRange = false

                // When time is enabled and both dates are the same day,
                // emit validation event if end time < start time
                if (
                    this.enableTime &&
                    this.selectedStart &&
                    this.selectedEnd &&
                    this.#isSameDay(this.selectedStart, this.selectedEnd)
                ) {
                    const startTimeSeconds =
                        this.startHour * 3600 +
                        this.startMinute * 60 +
                        this.startSecond
                    const endTimeSeconds =
                        this.endHour * 3600 + this.endMinute * 60 + this.endSecond
                    if (endTimeSeconds < startTimeSeconds) {
                        this.emit('terra-date-selection-invalid', {
                            detail: {
                                message:
                                    'End time is before start time. Please adjust the time values.',
                            },
                        })
                    }
                }

                this.#emitChange()

                if (!this.inline) {
                    this.isOpen = false
                }
            }
        } else {
            this.selectedStart = plainDate
            this.selectedEnd = null

            this.#emitChange()

            if (!this.inline) {
                this.isOpen = false
            }
        }
    }

    #handleDateHover(date: Temporal.PlainDate | Date) {
        const plainDate = this.#toPlainDate(date)

        if (this.range && this.selectedStart && !this.selectedEnd && plainDate) {
            this.hoverDate = plainDate
        }
    }

    #selectPreset(preset: PresetRange) {
        const raw = preset.getValue()
        const startDate = this.#toPlainDate(raw.startDate)
        const endDate = this.#toPlainDate(raw.endDate)

        if (!this.#isPresetWithinBounds({ startDate, endDate })) {
            this.emit('terra-date-selection-invalid', {
                detail: {
                    message: `The preset "${preset.label}" is not available within the allowed date range ${this.minDate} to ${this.maxDate}.`,
                },
            })
            return
        }

        // Clear any validation errors when selecting a preset
        this.clearInputValidation()

        const { min, max } = this.#getBounds()

        if (this.range) {
            let start = startDate
            let end = endDate

            if (start && min && Temporal.PlainDate.compare(start, min) < 0) {
                start = min
            }
            if (start && max && Temporal.PlainDate.compare(start, max) > 0) {
                start = max
            }
            if (end && min && Temporal.PlainDate.compare(end, min) < 0) {
                end = min
            }
            if (end && max && Temporal.PlainDate.compare(end, max) > 0) {
                end = max
            }
            if (start && end && Temporal.PlainDate.compare(end, start) < 0) {
                const tmp = start

                start = end
                end = tmp
            }

            this.selectedStart = start
            this.selectedEnd = end
        } else {
            let start = startDate

            if (start && min && Temporal.PlainDate.compare(start, min) < 0) {
                start = min
            }
            if (start && max && Temporal.PlainDate.compare(start, max) > 0) {
                start = max
            }

            this.selectedStart = start
            this.selectedEnd = null
        }

        if (this.selectedStart) {
            this.#updateMonthViews()
        }

        if (this.enableTime) {
            this.startHour = 0
            this.startMinute = 0
            this.startSecond = 0
            this.endHour = this.getDefaultEndHour()
            this.endMinute = this.getDefaultEndMinute()
            this.endSecond = this.getDefaultEndSecond()
        }

        this.#emitChange()

        if (!this.range && !this.inline) {
            this.isOpen = false
        }
    }

    #emitChange() {
        let startDateTime = ''
        let endDateTime = ''

        if (this.selectedStart) {
            if (this.enableTime) {
                const timeZone = this.timezone || 'UTC'
                const zdt = this.selectedStart.toZonedDateTime({
                    timeZone,
                    plainTime: {
                        hour: this.startHour,
                        minute: this.startMinute,
                        second: this.startSecond,
                    },
                })
                startDateTime = new Date(
                    zdt.toInstant().epochMilliseconds
                ).toISOString()
            } else {
                startDateTime = this.selectedStart.toString()
            }
        }

        if (this.selectedEnd) {
            if (this.enableTime) {
                const timeZone = this.timezone || 'UTC'
                const zdt = this.selectedEnd.toZonedDateTime({
                    timeZone,
                    plainTime: {
                        hour: this.endHour,
                        minute: this.endMinute,
                        second: this.endSecond,
                    },
                })
                endDateTime = new Date(
                    zdt.toInstant().epochMilliseconds
                ).toISOString()
            } else {
                endDateTime = this.selectedEnd.toString()
            }
        }

        this.emit('terra-date-range-change', {
            detail: {
                startDate: startDateTime,
                endDate: endDateTime,
            },
        })
    }

    #changeTime(type: 'hour' | 'minute' | 'second', delta: number, isStart: boolean) {
        let hour = isStart ? this.startHour : this.endHour
        let minute = isStart ? this.startMinute : this.endMinute
        let second = isStart ? this.startSecond : this.endSecond

        if (type === 'hour') {
            if (this.twelveHour) {
                // Spin within 1–12, preserving the current AM/PM period
                const d12 = to12Hour(hour)
                const newHour12 = ((((d12.hour - 1 + delta) % 12) + 12) % 12) + 1
                hour = to24Hour(newHour12, d12.period)
            } else {
                hour = (((hour + delta) % 24) + 24) % 24
            }
        } else if (type === 'minute') {
            minute = (((minute + delta) % 60) + 60) % 60
        } else {
            second = (((second + delta) % 60) + 60) % 60
        }

        if (isStart) {
            this.startHour = hour
            this.startMinute = minute
            this.startSecond = second
        } else {
            this.endHour = hour
            this.endMinute = minute
            this.endSecond = second
        }

        this.#emitChange()
        this.requestUpdate()
    }

    #handleTimeInput(
        event: Event,
        type: 'hour' | 'minute' | 'second',
        isStart: boolean
    ) {
        const input = event.target as HTMLInputElement
        const value = parseInt(input.value, 10)

        const currentHour = isStart ? this.startHour : this.endHour
        const currentMinute = isStart ? this.startMinute : this.endMinute
        const currentSecond = isStart ? this.startSecond : this.endSecond
        const d12 = this.twelveHour ? to12Hour(currentHour) : null

        let newH = currentHour
        let newM = currentMinute
        let newS = currentSecond

        if (type === 'hour') {
            const min = this.twelveHour ? 1 : 0
            const max = this.twelveHour ? 12 : 23

            if (Number.isNaN(value) || value < min || value > max) {
                input.value = (d12 ? d12.hour : currentHour)
                    .toString()
                    .padStart(2, '0')
                return
            }
            newH = this.twelveHour ? to24Hour(value, d12!.period) : value
        } else if (type === 'minute') {
            if (Number.isNaN(value) || value < 0 || value >= 60) {
                input.value = currentMinute.toString().padStart(2, '0')
                return
            }
            newM = value
        } else {
            if (Number.isNaN(value) || value < 0 || value >= 60) {
                input.value = currentSecond.toString().padStart(2, '0')
                return
            }
            newS = value
        }

        if (isStart) {
            this.startHour = newH
            this.startMinute = newM
            this.startSecond = newS
        } else {
            this.endHour = newH
            this.endMinute = newM
            this.endSecond = newS
        }

        this.#emitChange()
        this.requestUpdate()
    }

    #renderCalendar(month: Temporal.PlainDate | Date, isLeft: boolean = true) {
        const plainMonth =
            this.#toPlainDate(month) ?? Temporal.Now.plainDateISO().with({ day: 1 })
        const days = this.#getDaysInMonth(plainMonth)
        const currentMonth = plainMonth.month
        const showDropdown = isLeft
            ? this.showLeftMonthDropdown
            : this.showRightMonthDropdown

        return html`
            <div class="calendar">
                <div class="calendar__header">
                    <button
                        type="button"
                        class="calendar__nav"
                        @click=${() => this.#previousMonth(isLeft)}
                    >
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path
                                d="M10 12L6 8L10 4"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            />
                        </svg>
                    </button>

                    <div class="calendar__month-year">
                        <div class="calendar__month-dropdown-wrapper">
                            <button
                                type="button"
                                class="calendar__month-button"
                                @click=${(e: Event) =>
                                    this.toggleMonthDropdown(isLeft, e)}
                            >
                                ${this.MONTHS[plainMonth.month - 1]}
                                <svg
                                    width="12"
                                    height="12"
                                    viewBox="0 0 12 12"
                                    fill="none"
                                    class="calendar__month-icon"
                                >
                                    <path
                                        d="M3 5L6 8L9 5"
                                        stroke="currentColor"
                                        stroke-width="1.5"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                    />
                                </svg>
                            </button>

                            ${
                                showDropdown
                                    ? html`
                                      <div class="calendar__month-dropdown">
                                          ${this.MONTHS.map(
                                              (monthName, index) => html`
                                                  <button
                                                      type="button"
                                                      class="calendar__month-option ${
                                                          index ===
                                                          plainMonth.month - 1
                                                              ? 'calendar__month-option--selected'
                                                              : ''
                                                      }"
                                                      @click=${() =>
                                                          this.#selectMonth(
                                                              index,
                                                              isLeft
                                                          )}
                                                  >
                                                      ${
                                                          index ===
                                                          plainMonth.month - 1
                                                              ? html`
                                                                <svg
                                                                    width="16"
                                                                    height="16"
                                                                    viewBox="0 0 16 16"
                                                                    fill="none"
                                                                    class="calendar__month-check"
                                                                >
                                                                    <path
                                                                        d="M13 4L6 11L3 8"
                                                                        stroke="currentColor"
                                                                        stroke-width="2"
                                                                        stroke-linecap="round"
                                                                        stroke-linejoin="round"
                                                                    />
                                                                </svg>
                                                            `
                                                              : ''
                                                      }
                                                      ${monthName}
                                                  </button>
                                              `
                                          )}
                                      </div>
                                  `
                                    : ''
                            }
                        </div>

                        <div class="calendar__year-input-wrapper">
                            <input
                                type="number"
                                class="calendar__year-input"
                                .value=${plainMonth.year.toString()}
                                @input=${(e: Event) =>
                                    this.#handleYearInput(e, isLeft)}
                                @blur=${(e: Event) => {
                                    const input = e.target as HTMLInputElement
                                    input.value = plainMonth.year.toString()
                                }}
                                min="1900"
                                max="2100"
                            />
                            <div class="calendar__year-spinners">
                                <button
                                    type="button"
                                    class="calendar__year-spinner calendar__year-spinner--up"
                                    @click=${() => this.#changeYear(1, isLeft)}
                                >
                                    <svg
                                        width="10"
                                        height="10"
                                        viewBox="0 0 10 10"
                                        fill="none"
                                    >
                                        <path
                                            d="M2 6L5 3L8 6"
                                            stroke="currentColor"
                                            stroke-width="1.5"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                        />
                                    </svg>
                                </button>
                                <button
                                    type="button"
                                    class="calendar__year-spinner calendar__year-spinner--down"
                                    @click=${() => this.#changeYear(-1, isLeft)}
                                >
                                    <svg
                                        width="10"
                                        height="10"
                                        viewBox="0 0 10 10"
                                        fill="none"
                                    >
                                        <path
                                            d="M2 4L5 7L8 4"
                                            stroke="currentColor"
                                            stroke-width="1.5"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                        />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>

                    <button
                        type="button"
                        class="calendar__nav"
                        @click=${() => this.#nextMonth(isLeft)}
                    >
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path
                                d="M6 12L10 8L6 4"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            />
                        </svg>
                    </button>
                </div>
                <div class="calendar__weekdays">
                    ${this.DAYS.map(
                        day => html`<div class="calendar__weekday">${day}</div>`
                    )}
                </div>
                <div class="calendar__days">
                    ${days.map(date => {
                        const isCurrentMonth = date.month === currentMonth
                        const isSelected =
                            this.#isSameDay(date, this.selectedStart) ||
                            this.#isSameDay(date, this.selectedEnd)
                        const isStart = this.#isSameDay(date, this.selectedStart)
                        const isEnd = this.#isSameDay(date, this.selectedEnd)
                        const inRange = this.#isInRange(date)
                        const inHoverRange = this.#isInHoverRange(date)
                        const isDisabled = this.#isDisabled(date)

                        return html`
                            <button
                                type="button"
                                class="calendar__day ${
                                    !isCurrentMonth ? 'calendar__day--outside' : ''
                                }
                                       ${isSelected ? 'calendar__day--selected' : ''}
                                       ${isStart ? 'calendar__day--start' : ''}
                                       ${isEnd ? 'calendar__day--end' : ''}
                                       ${inRange ? 'calendar__day--in-range' : ''}
                                       ${
                                           inHoverRange
                                               ? 'calendar__day--hover-range'
                                               : ''
                                       }
                                       ${isDisabled ? 'calendar__day--disabled' : ''}"
                                @click=${() => this.#selectDate(date)}
                                @mouseenter=${() => this.#handleDateHover(date)}
                                ?disabled=${isDisabled}
                            >
                                ${date.day}
                            </button>
                        `
                    })}
                </div>
            </div>
        `
    }

    #renderTimePicker() {
        if (!this.enableTime) return ''

        const startD12 = this.twelveHour ? to12Hour(this.startHour) : null
        const endD12 = this.twelveHour ? to12Hour(this.endHour) : null
        const hourMin = this.twelveHour ? '1' : '0'
        const hourMax = this.twelveHour ? '12' : '23'

        return html`
            <div class="date-picker__time">
                <div class="date-picker__time-section">
                    <div class="date-picker__time-inputs">
                        <div class="date-picker__time-input-group">
                            <input
                                type="number"
                                class="date-picker__time-input"
                                .value=${(startD12 ? startD12.hour : this.startHour)
                                    .toString()
                                    .padStart(2, '0')}
                                @input=${(e: Event) =>
                                    this.#handleTimeInput(e, 'hour', true)}
                                @blur=${(e: Event) => {
                                    const input = e.target as HTMLInputElement
                                    const d12 = this.twelveHour
                                        ? to12Hour(this.startHour)
                                        : null
                                    input.value = (d12 ? d12.hour : this.startHour)
                                        .toString()
                                        .padStart(2, '0')
                                }}
                                min=${hourMin}
                                max=${hourMax}
                            />
                            <div class="date-picker__time-spinners">
                                <button
                                    type="button"
                                    class="date-picker__time-spinner"
                                    @click=${() => this.#changeTime('hour', 1, true)}
                                >
                                    <svg
                                        width="10"
                                        height="10"
                                        viewBox="0 0 10 10"
                                        fill="none"
                                    >
                                        <path
                                            d="M2 6L5 3L8 6"
                                            stroke="currentColor"
                                            stroke-width="1.5"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                        />
                                    </svg>
                                </button>
                                <button
                                    type="button"
                                    class="date-picker__time-spinner"
                                    @click=${() => this.#changeTime('hour', -1, true)}
                                >
                                    <svg
                                        width="10"
                                        height="10"
                                        viewBox="0 0 10 10"
                                        fill="none"
                                    >
                                        <path
                                            d="M2 4L5 7L8 4"
                                            stroke="currentColor"
                                            stroke-width="1.5"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                        />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <span class="date-picker__time-separator">:</span>

                        <div class="date-picker__time-input-group">
                            <input
                                type="number"
                                class="date-picker__time-input"
                                .value=${this.startMinute.toString().padStart(2, '0')}
                                @input=${(e: Event) =>
                                    this.#handleTimeInput(e, 'minute', true)}
                                @blur=${(e: Event) => {
                                    const input = e.target as HTMLInputElement
                                    input.value = this.startMinute
                                        .toString()
                                        .padStart(2, '0')
                                }}
                                min="0"
                                max="59"
                            />
                            <div class="date-picker__time-spinners">
                                <button
                                    type="button"
                                    class="date-picker__time-spinner"
                                    @click=${() => this.#changeTime('minute', 1, true)}
                                >
                                    <svg
                                        width="10"
                                        height="10"
                                        viewBox="0 0 10 10"
                                        fill="none"
                                    >
                                        <path
                                            d="M2 6L5 3L8 6"
                                            stroke="currentColor"
                                            stroke-width="1.5"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                        />
                                    </svg>
                                </button>
                                <button
                                    type="button"
                                    class="date-picker__time-spinner"
                                    @click=${() =>
                                        this.#changeTime('minute', -1, true)}
                                >
                                    <svg
                                        width="10"
                                        height="10"
                                        viewBox="0 0 10 10"
                                        fill="none"
                                    >
                                        <path
                                            d="M2 4L5 7L8 4"
                                            stroke="currentColor"
                                            stroke-width="1.5"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                        />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <span class="date-picker__time-separator">:</span>

                        <div class="date-picker__time-input-group">
                            <input
                                type="number"
                                class="date-picker__time-input"
                                .value=${this.startSecond.toString().padStart(2, '0')}
                                @input=${(e: Event) =>
                                    this.#handleTimeInput(e, 'second', true)}
                                @blur=${(e: Event) => {
                                    const input = e.target as HTMLInputElement
                                    input.value = this.startSecond
                                        .toString()
                                        .padStart(2, '0')
                                }}
                                min="0"
                                max="59"
                            />
                            <div class="date-picker__time-spinners">
                                <button
                                    type="button"
                                    class="date-picker__time-spinner"
                                    @click=${() => this.#changeTime('second', 1, true)}
                                >
                                    <svg
                                        width="10"
                                        height="10"
                                        viewBox="0 0 10 10"
                                        fill="none"
                                    >
                                        <path
                                            d="M2 6L5 3L8 6"
                                            stroke="currentColor"
                                            stroke-width="1.5"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                        />
                                    </svg>
                                </button>
                                <button
                                    type="button"
                                    class="date-picker__time-spinner"
                                    @click=${() =>
                                        this.#changeTime('second', -1, true)}
                                >
                                    <svg
                                        width="10"
                                        height="10"
                                        viewBox="0 0 10 10"
                                        fill="none"
                                    >
                                        <path
                                            d="M2 4L5 7L8 4"
                                            stroke="currentColor"
                                            stroke-width="1.5"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                        />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        ${
                            this.twelveHour
                                ? html`
                                  <button
                                      type="button"
                                      class="date-picker__time-period"
                                      @click=${() => this.#togglePeriod(true)}
                                  >
                                      ${startD12!.period}
                                  </button>
                              `
                                : ''
                        }
                    </div>
                </div>

                ${
                    this.range
                        ? html`
                          <span class="date-picker__separator">–</span>

                          <div class="date-picker__time-section">
                              <div class="date-picker__time-inputs">
                                  <div class="date-picker__time-input-group">
                                      <input
                                          type="number"
                                          class="date-picker__time-input"
                                          .value=${(endD12
                                              ? endD12.hour
                                              : this.endHour
                                          )
                                              .toString()
                                              .padStart(2, '0')}
                                          @input=${(e: Event) =>
                                              this.#handleTimeInput(e, 'hour', false)}
                                          @blur=${(e: Event) => {
                                              const input =
                                                  e.target as HTMLInputElement
                                              const d12 = this.twelveHour
                                                  ? to12Hour(this.endHour)
                                                  : null
                                              input.value = (
                                                  d12 ? d12.hour : this.endHour
                                              )
                                                  .toString()
                                                  .padStart(2, '0')
                                          }}
                                          min=${hourMin}
                                          max=${hourMax}
                                      />
                                      <div class="date-picker__time-spinners">
                                          <button
                                              type="button"
                                              class="date-picker__time-spinner"
                                              @click=${() =>
                                                  this.#changeTime('hour', 1, false)}
                                          >
                                              <svg
                                                  width="10"
                                                  height="10"
                                                  viewBox="0 0 10 10"
                                                  fill="none"
                                              >
                                                  <path
                                                      d="M2 6L5 3L8 6"
                                                      stroke="currentColor"
                                                      stroke-width="1.5"
                                                      stroke-linecap="round"
                                                      stroke-linejoin="round"
                                                  />
                                              </svg>
                                          </button>
                                          <button
                                              type="button"
                                              class="date-picker__time-spinner"
                                              @click=${() =>
                                                  this.#changeTime('hour', -1, false)}
                                          >
                                              <svg
                                                  width="10"
                                                  height="10"
                                                  viewBox="0 0 10 10"
                                                  fill="none"
                                              >
                                                  <path
                                                      d="M2 4L5 7L8 4"
                                                      stroke="currentColor"
                                                      stroke-width="1.5"
                                                      stroke-linecap="round"
                                                      stroke-linejoin="round"
                                                  />
                                              </svg>
                                          </button>
                                      </div>
                                  </div>

                                  <span class="date-picker__time-separator">:</span>

                                  <div class="date-picker__time-input-group">
                                      <input
                                          type="number"
                                          class="date-picker__time-input"
                                          .value=${this.endMinute
                                              .toString()
                                              .padStart(2, '0')}
                                          @input=${(e: Event) =>
                                              this.#handleTimeInput(
                                                  e,
                                                  'minute',
                                                  false
                                              )}
                                          @blur=${(e: Event) => {
                                              const input =
                                                  e.target as HTMLInputElement
                                              input.value = this.endMinute
                                                  .toString()
                                                  .padStart(2, '0')
                                          }}
                                          min="0"
                                          max="59"
                                      />
                                      <div class="date-picker__time-spinners">
                                          <button
                                              type="button"
                                              class="date-picker__time-spinner"
                                              @click=${() =>
                                                  this.#changeTime(
                                                      'minute',
                                                      1,
                                                      false
                                                  )}
                                          >
                                              <svg
                                                  width="10"
                                                  height="10"
                                                  viewBox="0 0 10 10"
                                                  fill="none"
                                              >
                                                  <path
                                                      d="M2 6L5 3L8 6"
                                                      stroke="currentColor"
                                                      stroke-width="1.5"
                                                      stroke-linecap="round"
                                                      stroke-linejoin="round"
                                                  />
                                              </svg>
                                          </button>
                                          <button
                                              type="button"
                                              class="date-picker__time-spinner"
                                              @click=${() =>
                                                  this.#changeTime(
                                                      'minute',
                                                      -1,
                                                      false
                                                  )}
                                          >
                                              <svg
                                                  width="10"
                                                  height="10"
                                                  viewBox="0 0 10 10"
                                                  fill="none"
                                              >
                                                  <path
                                                      d="M2 4L5 7L8 4"
                                                      stroke="currentColor"
                                                      stroke-width="1.5"
                                                      stroke-linecap="round"
                                                      stroke-linejoin="round"
                                                  />
                                              </svg>
                                          </button>
                                      </div>
                                  </div>

                                  <span class="date-picker__time-separator">:</span>

                                  <div class="date-picker__time-input-group">
                                      <input
                                          type="number"
                                          class="date-picker__time-input"
                                          .value=${this.endSecond
                                              .toString()
                                              .padStart(2, '0')}
                                          @input=${(e: Event) =>
                                              this.#handleTimeInput(
                                                  e,
                                                  'second',
                                                  false
                                              )}
                                          @blur=${(e: Event) => {
                                              const input =
                                                  e.target as HTMLInputElement
                                              input.value = this.endSecond
                                                  .toString()
                                                  .padStart(2, '0')
                                          }}
                                          min="0"
                                          max="59"
                                      />
                                      <div class="date-picker__time-spinners">
                                          <button
                                              type="button"
                                              class="date-picker__time-spinner"
                                              @click=${() =>
                                                  this.#changeTime(
                                                      'second',
                                                      1,
                                                      false
                                                  )}
                                          >
                                              <svg
                                                  width="10"
                                                  height="10"
                                                  viewBox="0 0 10 10"
                                                  fill="none"
                                              >
                                                  <path
                                                      d="M2 6L5 3L8 6"
                                                      stroke="currentColor"
                                                      stroke-width="1.5"
                                                      stroke-linecap="round"
                                                      stroke-linejoin="round"
                                                  />
                                              </svg>
                                          </button>
                                          <button
                                              type="button"
                                              class="date-picker__time-spinner"
                                              @click=${() =>
                                                  this.#changeTime(
                                                      'second',
                                                      -1,
                                                      false
                                                  )}
                                          >
                                              <svg
                                                  width="10"
                                                  height="10"
                                                  viewBox="0 0 10 10"
                                                  fill="none"
                                              >
                                                  <path
                                                      d="M2 4L5 7L8 4"
                                                      stroke="currentColor"
                                                      stroke-width="1.5"
                                                      stroke-linecap="round"
                                                      stroke-linejoin="round"
                                                  />
                                              </svg>
                                          </button>
                                      </div>
                                  </div>
                              </div>

                                  ${
                                      this.twelveHour
                                          ? html`
                                            <button
                                                type="button"
                                                class="date-picker__time-period"
                                                @click=${() =>
                                                    this.#togglePeriod(false)}
                                            >
                                                ${endD12!.period}
                                            </button>
                                        `
                                          : ''
                                  }
                          </div>
                      `
                        : ''
                }
            </div>
        `
    }

    #renderPresets() {
        if (!this.showPresets || this.#filteredPresets.length === 0) {
            return nothing
        }

        if (this.isMobile) {
            return html`
                <div class="date-picker__mobile-presets">
                    <terra-accordion summary="Preset Date Ranges">
                        <div class="date-picker__mobile-presets-content">
                            <slot name="sidebar-header"></slot>

                            <div class="presets">
                                ${this.#filteredPresets.map(
                                    preset => html`
                                        <button
                                            type="button"
                                            class="date-picker__preset"
                                            @click=${() => this.#selectPreset(preset)}
                                        >
                                            ${preset.label}
                                        </button>
                                    `
                                )}
                            </div>

                            <slot name="sidebar-footer">
                                <terra-button
                                    outline
                                    variant="default"
                                    size="small"
                                    @click=${() => this.clear()}
                                >
                                    ${this.clearAllLabel}
                                </terra-button>
                            </slot>
                        </div>
                    </terra-accordion>
                </div>
            `
        }

        return html`
            <div class="date-picker__sidebar" part="sidebar">
                <slot name="sidebar-header"></slot>

                <div class="presets">
                    ${this.#filteredPresets.map(
                        preset => html`
                            <button
                                type="button"
                                class="date-picker__preset"
                                @click=${() => this.#selectPreset(preset)}
                            >
                                ${preset.label}
                            </button>
                        `
                    )}
                </div>

                <slot name="sidebar-footer">
                    <terra-button
                        outline
                        variant="default"
                        size="small"
                        @click=${() => this.clear()}
                    >
                        ${this.clearAllLabel}
                    </terra-button>
                </slot>
            </div>
        `
    }

    private renderCalendarIcon() {
        return html`
            <svg
                slot="suffix"
                class="date-picker__icon"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
            >
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
        `
    }

    #renderCalendarContent() {
        return html`
            <div class="date-picker__dropdown" part="calendar">
             ${
                 this.showClose
                     ? html`
                                     <div class="dropdown-header">
                                        <button
                                            class="date-picker__close-btn"
                                            @click=${(e: Event) => {
                                                e.stopPropagation()
                                                this.close()
                                            }}
                                            aria-label="Close"
                                         >
                                         ✕
                                         </button>
                                    </div>
                                    `
                     : nothing
             }
                <div class="date-picker__content">
                    ${this.#renderPresets()}

                    <div class="date-picker__calendars">
                        ${this.#renderCalendar(this.leftMonth, true)}
                        ${
                            this.range
                                ? this.#renderCalendar(this.rightMonth, false)
                                : ''
                        }
                    </div>
                </div>

                ${this.enableTime ? this.#renderTimePicker() : ''}
            </div>
        `
    }

    render() {
        const showSplitInputs = this.range && this.splitInputs

        // Inline mode: render directly without dropdown
        if (this.inline) {
            return html`
                <div
                    class="date-picker date-picker--inline ${
                        showSplitInputs ? 'date-picker--split-inputs' : ''
                    }"
                    @click=${(e: Event) => e.stopPropagation()}
                >
                    ${
                        showSplitInputs
                            ? html`
                              <div class="date-picker__inputs">
                                  <terra-input
                                      .label=${
                                          this.startLabel ||
                                          (this.label
                                              ? `${this.label} (Start)`
                                              : 'Start Date')
                                      }
                                      .hideLabel=${this.hideLabel}
                                      .helpText=${this.startHelpText || this.helpText}
                                      .value=${this.#getStartDateDisplayValue()}
                                      @terra-blur=${this.#handleStartInputBlur}
                                      @keydown=${this.#handleKeydown}
                                      placeholder=${this.startPlaceholder}
                                      name="start-date"
                                  >
                                      ${this.renderCalendarIcon()}
                                  </terra-input>
                                  <terra-input
                                      .label=${
                                          this.endLabel ||
                                          (this.label
                                              ? `${this.label} (End)`
                                              : 'End Date')
                                      }
                                      .hideLabel=${this.hideLabel}
                                      .helpText=${this.endHelpText || this.helpText}
                                      .value=${this.#getEndDateDisplayValue()}
                                      @terra-blur=${this.#handleEndInputBlur}
                                      @keydown=${this.#handleKeydown}
                                      placeholder=${this.endPlaceholder}
                                      name="end-date"
                                  >
                                      ${this.renderCalendarIcon()}
                                  </terra-input>
                              </div>
                          `
                            : html`
                              <terra-input
                                  .label=${this.label}
                                  .hideLabel=${this.hideLabel}
                                  .helpText=${this.helpText}
                                  .value=${this.#getDisplayValue()}
                                  placeholder=${this.placeholder}
                                  @terra-blur=${this.#handleInputBlur}
                                  @keydown=${this.#handleKeydown}
                                  name="date"
                              >
                                  ${this.renderCalendarIcon()}
                              </terra-input>
                          `
                    }

                    <slot name="additional-text"></slot>

                    <div class="date-picker__dropdown-wrapper">
                        <div
                            class="date-picker__dropdown date-picker__dropdown--inline"
                            part="calendar"
                        >
                            <div class="date-picker__content">
                                ${this.#renderPresets()}

                                <div class="date-picker__calendars">
                                    ${this.#renderCalendar(this.leftMonth, true)}
                                    ${
                                        this.range
                                            ? this.#renderCalendar(
                                                  this.rightMonth,
                                                  false
                                              )
                                            : ''
                                    }
                                </div>
                            </div>

                            ${this.enableTime ? this.#renderTimePicker() : ''}
                        </div>
                    </div>
                </div>
            `
        }

        // Non-inline mode: use dropdown
        return html`
            <div
                class="date-picker ${
                    showSplitInputs ? 'date-picker--split-inputs' : ''
                }"
                @click=${(e: Event) => e.stopPropagation()}
            >
                ${
                    showSplitInputs
                        ? html`
                          <div class="date-picker__inputs">
                              <terra-dropdown
                                  ${ref(this.dropdownRef)}
                                  placement="bottom-start"
                                  distance="4"
                                  @terra-show=${this.handleDropdownShow}
                                  @terra-hide=${this.handleDropdownHide}
                                  hoist
                              >
                                  <terra-input
                                      slot="trigger"
                                      .label=${
                                          this.startLabel ||
                                          (this.label
                                              ? `${this.label} (Start)`
                                              : 'Start Date')
                                      }
                                      .hideLabel=${this.hideLabel}
                                      .helpText=${this.startHelpText || this.helpText}
                                      .value=${this.#getStartDateDisplayValue()}
                                      placeholder=${this.startPlaceholder}
                                      @terra-blur=${this.#handleStartInputBlur}
                                      @keydown=${this.#handleKeydown}
                                      name="start-date"
                                  >
                                      ${this.renderCalendarIcon()}
                                  </terra-input>
                                  ${this.#renderCalendarContent()}
                              </terra-dropdown>
                              <terra-dropdown
                                  placement="bottom-start"
                                  distance="4"
                                  @terra-show=${this.handleDropdownShow}
                                  @terra-hide=${this.handleDropdownHide}
                                  hoist
                              >
                                  <terra-input
                                      slot="trigger"
                                      .label=${
                                          this.endLabel ||
                                          (this.label
                                              ? `${this.label} (End)`
                                              : 'End Date')
                                      }
                                      .hideLabel=${this.hideLabel}
                                      .helpText=${this.endHelpText || this.helpText}
                                      .value=${this.#getEndDateDisplayValue()}
                                      placeholder=${this.endPlaceholder}
                                      @terra-blur=${this.#handleEndInputBlur}
                                      @keydown=${this.#handleKeydown}
                                      name="end-date"
                                  >
                                      ${this.renderCalendarIcon()}
                                  </terra-input>
                                  ${this.#renderCalendarContent()}
                              </terra-dropdown>
                          </div>
                      `
                        : html`
                          <terra-dropdown
                              ${ref(this.dropdownRef)}
                              placement="bottom-start"
                              distance="4"
                              @terra-show=${this.handleDropdownShow}
                              @terra-hide=${this.handleDropdownHide}
                              hoist
                          >
                              <terra-input
                                  slot="trigger"
                                  .label=${this.label}
                                  .hideLabel=${this.hideLabel}
                                  .helpText=${this.helpText}
                                  .value=${this.#getDisplayValue()}
                                  placeholder=${this.placeholder}
                                  @terra-blur=${this.#handleInputBlur}
                                  @keydown=${this.#handleKeydown}
                                  name="date"
                              >
                                  ${this.renderCalendarIcon()}
                              </terra-input>
                              ${this.#renderCalendarContent()}
                          </terra-dropdown>
                      `
                }
            </div>
        `
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'terra-date-picker': TerraDatePicker
    }
}
