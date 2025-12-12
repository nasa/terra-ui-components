import { property, state, query } from 'lit/decorators.js'
import { html } from 'lit'
import { createRef, ref } from 'lit/directives/ref.js'
import componentStyles from '../../styles/component.styles.js'
import TerraElement from '../../internal/terra-element.js'
import styles from './date-picker.styles.js'
import type { CSSResultGroup } from 'lit'
import TerraButton from '../button/button.component.js'
import TerraInput from '../input/input.component.js'
import TerraDropdown from '../dropdown/dropdown.component.js'
import { watch } from '../../internal/watch.js'

interface DateRange {
    startDate: Date | null
    endDate: Date | null
}

interface PresetRange {
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
    }

    @property() id: string
    @property({ type: Boolean }) range = false
    @property({ attribute: 'min-date' }) minDate?: string
    @property({ attribute: 'max-date' }) maxDate?: string
    @property({ attribute: 'start-date' }) startDate?: string
    @property({ attribute: 'end-date' }) endDate?: string
    @property({ attribute: 'hide-label', type: Boolean }) hideLabel = false
    @property() label: string = 'Select Date'
    @property({ attribute: 'help-text' }) helpText = ''
    @property({ attribute: 'start-label' }) startLabel?: string
    @property({ attribute: 'end-label' }) endLabel?: string
    @property({ type: Boolean, attribute: 'show-presets' }) showPresets = false
    @property({ type: Array }) presets: PresetRange[] = []
    @property({ type: Boolean, attribute: 'enable-time' }) enableTime = false
    @property({ attribute: 'display-format' }) displayFormat?: string
    @property({ type: Boolean }) inline = false
    @property({ type: Boolean, attribute: 'split-inputs' }) splitInputs = false

    @state() isOpen = false
    @state() leftMonth: Date = new Date()
    @state() rightMonth: Date = new Date()
    @state() selectedStart: Date | null = null
    @state() selectedEnd: Date | null = null
    @state() hoverDate: Date | null = null
    @state() isSelectingRange = false
    @state() showLeftMonthDropdown = false
    @state() showRightMonthDropdown = false
    @state() startHour: number = 12
    @state() startMinute: number = 0
    @state() endHour: number = 12
    @state() endMinute: number = 0
    @state() timePeriod: 'AM' | 'PM' = 'AM'
    @state() endTimePeriod: 'AM' | 'PM' = 'PM'

    @state() selectedDates = {
        startDate: new Date().toString(),
        endDate: new Date().toString(),
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

    constructor() {
        super()
        this.initializePresets()
    }

    private getBounds(): { min?: Date; max?: Date } {
        const min = this.minDate ? new Date(this.minDate) : undefined
        const max = this.maxDate ? new Date(this.maxDate) : undefined
        return { min, max }
    }

    private doesRangeOverlapBounds(range: DateRange): boolean {
        const { startDate, endDate } = range
        const { min, max } = this.getBounds()

        if (!this.range) {
            if (!startDate) return false
            if (min && startDate < min) return false
            if (max && startDate > max) return false
            return true
        }

        const start = startDate ?? new Date(-8640000000000000)
        const end = endDate ?? new Date(8640000000000000)

        if (!min && !max) return true
        const windowStart = min ?? new Date(-8640000000000000)
        const windowEnd = max ?? new Date(8640000000000000)
        return end >= windowStart && start <= windowEnd
    }

    private isPresetWithinBounds(range: DateRange): boolean {
        return this.doesRangeOverlapBounds(range)
    }

    private get filteredPresets(): PresetRange[] {
        return (this.presets || []).filter(preset =>
            this.isPresetWithinBounds(preset.getValue())
        )
    }

    open() {
        this.isOpen = true

        // If a max date is provided and no explicit selection exists,
        // open the calendar to the max date's month (right calendar in range mode)
        if (this.maxDate && !this.selectedStart && !this.selectedEnd) {
            const max = new Date(this.maxDate)
            if (!isNaN(max.getTime())) {
                if (this.range) {
                    this.rightMonth = new Date(max)
                    const left = new Date(max)
                    left.setMonth(left.getMonth() - 1)
                    this.leftMonth = left
                } else {
                    this.leftMonth = new Date(max)
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

    setOpen(open: boolean) {
        if (open) {
            this.open()
        } else {
            this.close()
        }
    }

    @watch('inline')
    handleInlineChange() {
        if (this.inline) {
            this.isOpen = true
            // Close dropdown when switching to inline mode
            if (this.dropdownRef.value) {
                this.dropdownRef.value.hide()
            }
        }
    }

    @watch(['startDate', 'endDate'])
    handleStartEndDateChange() {
        // Sync internal state with props when they change
        if (this.startDate) {
            const start = new Date(this.startDate)
            if (!isNaN(start.getTime())) {
                this.selectedStart = start
                this.leftMonth = new Date(start)
                if (this.enableTime) {
                    this.initializeTimeFromDate(start, true)
                }
            }
        } else {
            this.selectedStart = null
        }

        if (this.range) {
            if (this.endDate) {
                const end = new Date(this.endDate)
                if (!isNaN(end.getTime())) {
                    this.selectedEnd = end
                    this.rightMonth = new Date(end)
                    if (this.enableTime) {
                        this.initializeTimeFromDate(end, false)
                    }
                }
            } else {
                this.selectedEnd = null
                // If no end date, set right month to be one month ahead of left month
                if (this.selectedStart) {
                    this.rightMonth = new Date(this.leftMonth)
                    this.rightMonth.setMonth(this.rightMonth.getMonth() + 1)
                }
            }
        } else {
            this.selectedEnd = null
        }
    }

    private initializePresets() {
        if (this.presets.length === 0) {
            this.presets = [
                {
                    label: 'Today',
                    getValue: () => {
                        const today = new Date()
                        return {
                            startDate: today,
                            endDate: this.range ? today : null,
                        }
                    },
                },
                {
                    label: 'Yesterday',
                    getValue: () => {
                        const yesterday = new Date()
                        yesterday.setDate(yesterday.getDate() - 1)
                        return {
                            startDate: yesterday,
                            endDate: this.range ? yesterday : null,
                        }
                    },
                },
                {
                    label: 'Last 7 days',
                    getValue: () => {
                        const end = new Date()
                        const start = new Date()
                        start.setDate(start.getDate() - 6)
                        return { startDate: start, endDate: end }
                    },
                },
                {
                    label: 'Last 30 days',
                    getValue: () => {
                        const end = new Date()
                        const start = new Date()
                        start.setDate(start.getDate() - 29)
                        return { startDate: start, endDate: end }
                    },
                },
                {
                    label: 'Last 6 months',
                    getValue: () => {
                        const end = new Date()
                        const start = new Date()
                        start.setMonth(start.getMonth() - 6)
                        return { startDate: start, endDate: end }
                    },
                },
                {
                    label: 'Last year',
                    getValue: () => {
                        const end = new Date()
                        const start = new Date()
                        start.setFullYear(start.getFullYear() - 1)
                        return { startDate: start, endDate: end }
                    },
                },
                {
                    label: 'All time',
                    getValue: () => {
                        const { min, max } = this.getBounds()
                        return {
                            startDate: min || null,
                            endDate: max || null,
                        }
                    },
                },
            ]
        }
    }

    firstUpdated() {
        // Parse dates from URL or props
        const params = new URLSearchParams(window.location.search)
        const timeStartParam = params.get('time_start') || this.startDate
        const timeEndParam = params.get('time_end') || this.endDate

        if (timeStartParam) {
            this.selectedStart = new Date(timeStartParam)
            this.leftMonth = new Date(this.selectedStart)
            if (this.enableTime) {
                this.initializeTimeFromDate(this.selectedStart, true)
            }
        }

        if (this.range && timeEndParam) {
            this.selectedEnd = new Date(timeEndParam)
            this.rightMonth = new Date(this.selectedEnd)
            if (this.enableTime) {
                this.initializeTimeFromDate(this.selectedEnd, false)
            }
        }

        // Set right month to be one month ahead of left month only if end date wasn't provided
        if (this.range && !timeEndParam) {
            this.rightMonth = new Date(this.leftMonth)
            this.rightMonth.setMonth(this.rightMonth.getMonth() + 1)
        }

        // If inline mode, always show the calendar
        if (this.inline) {
            this.isOpen = true
        }
    }

    disconnectedCallback() {
        super.disconnectedCallback()
        // Dropdown handles its own cleanup
    }

    private handleDropdownShow() {
        this.isOpen = true
    }

    private handleDropdownHide() {
        this.isOpen = false
    }

    private formatDisplayDate(date: Date | null, isStart: boolean = true): string {
        if (!date) return ''

        // Get the format to use
        const format =
            this.displayFormat ||
            (this.enableTime ? 'YYYY-MM-DD HH:mm:ss' : 'YYYY-MM-DD')

        // Get date components
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')

        // Get time components - use state variables if time is enabled, otherwise use Date object
        let hours: string
        let minutes: string
        let seconds: string

        if (this.enableTime) {
            // Convert 12-hour time to 24-hour for display
            const hour12 = isStart ? this.startHour : this.endHour
            const period = isStart ? this.timePeriod : this.endTimePeriod
            let hour24 = hour12
            if (period === 'PM' && hour12 !== 12) {
                hour24 = hour12 + 12
            } else if (period === 'AM' && hour12 === 12) {
                hour24 = 0
            }
            hours = String(hour24).padStart(2, '0')
            minutes = String(isStart ? this.startMinute : this.endMinute).padStart(
                2,
                '0'
            )
            seconds = '00'
        } else {
            hours = String(date.getHours()).padStart(2, '0')
            minutes = String(date.getMinutes()).padStart(2, '0')
            seconds = String(date.getSeconds()).padStart(2, '0')
        }

        // Replace format tokens
        return format
            .replace('YYYY', year.toString())
            .replace('MM', month)
            .replace('DD', day)
            .replace('HH', hours)
            .replace('mm', minutes)
            .replace('ss', seconds)
    }

    private getDisplayValue(): string {
        if (this.range) {
            if (this.selectedStart && this.selectedEnd) {
                return `${this.formatDisplayDate(this.selectedStart, true)} – ${this.formatDisplayDate(this.selectedEnd, false)}`
            } else if (this.selectedStart) {
                return this.formatDisplayDate(this.selectedStart, true)
            }
            return 'Select date range'
        } else {
            return this.selectedStart
                ? this.formatDisplayDate(this.selectedStart, true)
                : 'Select date'
        }
    }

    private getStartDateDisplayValue(): string {
        return this.selectedStart
            ? this.formatDisplayDate(this.selectedStart, true)
            : 'Start date'
    }

    private getEndDateDisplayValue(): string {
        return this.selectedEnd
            ? this.formatDisplayDate(this.selectedEnd, false)
            : 'End date'
    }

    private previousMonth(isLeft: boolean) {
        if (isLeft) {
            const newMonth = new Date(this.leftMonth)
            newMonth.setMonth(newMonth.getMonth() - 1)
            this.leftMonth = newMonth
        } else {
            const newMonth = new Date(this.rightMonth)
            newMonth.setMonth(newMonth.getMonth() - 1)
            this.rightMonth = newMonth
        }
    }

    private nextMonth(isLeft: boolean) {
        if (isLeft) {
            const newMonth = new Date(this.leftMonth)
            newMonth.setMonth(newMonth.getMonth() + 1)
            this.leftMonth = newMonth
        } else {
            const newMonth = new Date(this.rightMonth)
            newMonth.setMonth(newMonth.getMonth() + 1)
            this.rightMonth = newMonth
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

    private selectMonth(month: number, isLeft: boolean) {
        if (isLeft) {
            const newMonth = new Date(this.leftMonth)
            newMonth.setMonth(month)
            this.leftMonth = newMonth
            this.showLeftMonthDropdown = false
        } else {
            const newMonth = new Date(this.rightMonth)
            newMonth.setMonth(month)
            this.rightMonth = newMonth
            this.showRightMonthDropdown = false
        }
    }

    private changeYear(delta: number, isLeft: boolean) {
        if (isLeft) {
            const newMonth = new Date(this.leftMonth)
            newMonth.setFullYear(newMonth.getFullYear() + delta)
            this.leftMonth = newMonth
        } else {
            const newMonth = new Date(this.rightMonth)
            newMonth.setFullYear(newMonth.getFullYear() + delta)
            this.rightMonth = newMonth
        }
    }

    private handleYearInput(event: Event, isLeft: boolean) {
        const input = event.target as HTMLInputElement
        const year = parseInt(input.value, 10)

        if (!isNaN(year) && year >= 1900 && year <= 2100) {
            if (isLeft) {
                const newMonth = new Date(this.leftMonth)
                newMonth.setFullYear(year)
                this.leftMonth = newMonth
            } else {
                const newMonth = new Date(this.rightMonth)
                newMonth.setFullYear(year)
                this.rightMonth = newMonth
            }
        }
    }

    private getDaysInMonth(date: Date): Date[] {
        const year = date.getFullYear()
        const month = date.getMonth()
        const firstDay = new Date(year, month, 1)
        const lastDay = new Date(year, month + 1, 0)

        const days: Date[] = []

        // Add previous month's trailing days
        const firstDayOfWeek = firstDay.getDay()
        for (let i = firstDayOfWeek - 1; i >= 0; i--) {
            const day = new Date(year, month, -i)
            days.push(day)
        }

        // Add current month's days
        for (let i = 1; i <= lastDay.getDate(); i++) {
            days.push(new Date(year, month, i))
        }

        // Add next month's leading days to complete the week
        const remainingDays = 7 - (days.length % 7)
        if (remainingDays < 7) {
            for (let i = 1; i <= remainingDays; i++) {
                days.push(new Date(year, month + 1, i))
            }
        }

        return days
    }

    private isSameDay(date1: Date | null, date2: Date | null): boolean {
        if (!date1 || !date2) return false
        return (
            date1.getFullYear() === date2.getFullYear() &&
            date1.getMonth() === date2.getMonth() &&
            date1.getDate() === date2.getDate()
        )
    }

    private isInRange(date: Date): boolean {
        if (!this.selectedStart || !this.selectedEnd) return false
        const time = date.getTime()
        return (
            time >= this.selectedStart.getTime() && time <= this.selectedEnd.getTime()
        )
    }

    private isInHoverRange(date: Date): boolean {
        if (!this.range || !this.selectedStart || !this.hoverDate || this.selectedEnd)
            return false
        const time = date.getTime()
        const start = Math.min(this.selectedStart.getTime(), this.hoverDate.getTime())
        const end = Math.max(this.selectedStart.getTime(), this.hoverDate.getTime())
        return time >= start && time <= end
    }

    private isDisabled(date: Date): boolean {
        if (this.minDate) {
            const min = new Date(this.minDate)
            if (date < min) return true
        }
        if (this.maxDate) {
            const max = new Date(this.maxDate)
            if (date > max) return true
        }
        return false
    }

    private selectDate(date: Date) {
        if (this.isDisabled(date)) return

        if (this.range) {
            if (!this.selectedStart || this.selectedEnd) {
                // Start new selection
                this.selectedStart = date
                this.selectedEnd = null
                this.isSelectingRange = true
            } else {
                // Complete the range
                if (date < this.selectedStart) {
                    this.selectedEnd = this.selectedStart
                    this.selectedStart = date
                } else {
                    this.selectedEnd = date
                }
                this.isSelectingRange = false
                this.emitChange()
                if (!this.inline) {
                    this.isOpen = false
                }
            }
        } else {
            this.selectedStart = date
            this.selectedEnd = null
            this.emitChange()
            if (!this.inline) {
                this.isOpen = false
            }
        }
    }

    private handleDateHover(date: Date) {
        if (this.range && this.selectedStart && !this.selectedEnd) {
            this.hoverDate = date
        }
    }

    private selectPreset(preset: PresetRange) {
        const { startDate, endDate } = preset.getValue()

        if (!this.isPresetWithinBounds({ startDate, endDate })) {
            return
        }

        const { min, max } = this.getBounds()

        if (this.range) {
            let s = startDate
            let e = endDate
            if (s && min && s < min) s = new Date(min)
            if (s && max && s > max) s = new Date(max)
            if (e && min && e < min) e = new Date(min)
            if (e && max && e > max) e = new Date(max)
            if (s && e && e < s) {
                const tmp = s
                s = e
                e = tmp
            }
            this.selectedStart = s
            this.selectedEnd = e
        } else {
            let s = startDate
            if (s && min && s < min) s = new Date(min)
            if (s && max && s > max) s = new Date(max)
            this.selectedStart = s
            this.selectedEnd = null
        }

        if (this.selectedStart) {
            this.leftMonth = new Date(this.selectedStart)
            if (this.range && this.selectedEnd) {
                this.rightMonth = new Date(this.selectedEnd)
            }
        }

        this.emitChange()
        if (!this.range && !this.inline) {
            this.isOpen = false
        }
    }

    private emitChange() {
        let startDateTime = ''
        let endDateTime = ''

        if (this.selectedStart) {
            if (this.enableTime) {
                const startDate = new Date(this.selectedStart)
                let hours = this.startHour
                if (this.timePeriod === 'PM' && hours !== 12) hours += 12
                if (this.timePeriod === 'AM' && hours === 12) hours = 0
                startDate.setHours(hours, this.startMinute, 0, 0)
                startDateTime = startDate.toISOString()
            } else {
                startDateTime = this.selectedStart.toISOString().split('T')[0]
            }
        }

        if (this.selectedEnd) {
            if (this.enableTime) {
                const endDate = new Date(this.selectedEnd)
                let hours = this.endHour
                if (this.endTimePeriod === 'PM' && hours !== 12) hours += 12
                if (this.endTimePeriod === 'AM' && hours === 12) hours = 0
                endDate.setHours(hours, this.endMinute, 0, 0)
                endDateTime = endDate.toISOString()
            } else {
                endDateTime = this.selectedEnd.toISOString().split('T')[0]
            }
        }

        this.emit('terra-date-range-change', {
            detail: {
                startDate: startDateTime,
                endDate: endDateTime,
            },
        })
    }

    private initializeTimeFromDate(date: Date, isStart: boolean) {
        let hours = date.getHours()
        const minutes = date.getMinutes()
        const period = hours >= 12 ? 'PM' : 'AM'

        // Convert to 12-hour format
        if (hours === 0) hours = 12
        else if (hours > 12) hours -= 12

        if (isStart) {
            this.startHour = hours
            this.startMinute = minutes
            this.timePeriod = period
        } else {
            this.endHour = hours
            this.endMinute = minutes
            this.endTimePeriod = period
        }
    }

    private changeTime(type: 'hour' | 'minute', delta: number, isStart: boolean) {
        if (type === 'hour') {
            if (isStart) {
                let newHour = this.startHour + delta
                if (newHour > 12) newHour = 1
                if (newHour < 1) newHour = 12
                this.startHour = newHour
            } else {
                let newHour = this.endHour + delta
                if (newHour > 12) newHour = 1
                if (newHour < 1) newHour = 12
                this.endHour = newHour
            }
        } else {
            if (isStart) {
                let newMinute = this.startMinute + delta
                if (newMinute >= 60) newMinute = 0
                if (newMinute < 0) newMinute = 59
                this.startMinute = newMinute
            } else {
                let newMinute = this.endMinute + delta
                if (newMinute >= 60) newMinute = 0
                if (newMinute < 0) newMinute = 59
                this.endMinute = newMinute
            }
        }
    }

    private handleTimeInput(event: Event, type: 'hour' | 'minute', isStart: boolean) {
        const input = event.target as HTMLInputElement
        let value = parseInt(input.value, 10)

        if (type === 'hour') {
            if (isNaN(value) || value < 1 || value > 12) {
                input.value = isStart
                    ? this.startHour.toString().padStart(2, '0')
                    : this.endHour.toString().padStart(2, '0')
                return
            }
            if (isStart) this.startHour = value
            else this.endHour = value
        } else {
            if (isNaN(value) || value < 0 || value >= 60) {
                input.value = isStart
                    ? this.startMinute.toString().padStart(2, '0')
                    : this.endMinute.toString().padStart(2, '0')
                return
            }
            if (isStart) this.startMinute = value
            else this.endMinute = value
        }
    }

    private togglePeriod(isStart: boolean) {
        if (isStart) {
            this.timePeriod = this.timePeriod === 'AM' ? 'PM' : 'AM'
        } else {
            this.endTimePeriod = this.endTimePeriod === 'AM' ? 'PM' : 'AM'
        }
    }

    private renderCalendar(month: Date, isLeft: boolean = true) {
        const days = this.getDaysInMonth(month)
        const currentMonth = month.getMonth()
        const showDropdown = isLeft
            ? this.showLeftMonthDropdown
            : this.showRightMonthDropdown

        return html`
            <div class="calendar">
                <div class="calendar__header">
                    <button
                        type="button"
                        class="calendar__nav"
                        @click=${() => this.previousMonth(isLeft)}
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
                                ${this.MONTHS[month.getMonth()]}
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

                            ${showDropdown
                                ? html`
                                      <div class="calendar__month-dropdown">
                                          ${this.MONTHS.map(
                                              (monthName, index) => html`
                                                  <button
                                                      type="button"
                                                      class="calendar__month-option ${index ===
                                                      month.getMonth()
                                                          ? 'calendar__month-option--selected'
                                                          : ''}"
                                                      @click=${() =>
                                                          this.selectMonth(
                                                              index,
                                                              isLeft
                                                          )}
                                                  >
                                                      ${index === month.getMonth()
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
                                                          : ''}
                                                      ${monthName}
                                                  </button>
                                              `
                                          )}
                                      </div>
                                  `
                                : ''}
                        </div>

                        <div class="calendar__year-input-wrapper">
                            <input
                                type="number"
                                class="calendar__year-input"
                                .value=${month.getFullYear().toString()}
                                @input=${(e: Event) =>
                                    this.handleYearInput(e, isLeft)}
                                @blur=${(e: Event) => {
                                    const input = e.target as HTMLInputElement
                                    input.value = month.getFullYear().toString()
                                }}
                                min="1900"
                                max="2100"
                            />
                            <div class="calendar__year-spinners">
                                <button
                                    type="button"
                                    class="calendar__year-spinner calendar__year-spinner--up"
                                    @click=${() => this.changeYear(1, isLeft)}
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
                                    @click=${() => this.changeYear(-1, isLeft)}
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
                        @click=${() => this.nextMonth(isLeft)}
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
                        const isCurrentMonth = date.getMonth() === currentMonth
                        const isSelected =
                            this.isSameDay(date, this.selectedStart) ||
                            this.isSameDay(date, this.selectedEnd)
                        const isStart = this.isSameDay(date, this.selectedStart)
                        const isEnd = this.isSameDay(date, this.selectedEnd)
                        const inRange = this.isInRange(date)
                        const inHoverRange = this.isInHoverRange(date)
                        const isDisabled = this.isDisabled(date)

                        return html`
                            <button
                                type="button"
                                class="calendar__day ${!isCurrentMonth
                                    ? 'calendar__day--outside'
                                    : ''} 
                                       ${isSelected ? 'calendar__day--selected' : ''}
                                       ${isStart ? 'calendar__day--start' : ''}
                                       ${isEnd ? 'calendar__day--end' : ''}
                                       ${inRange ? 'calendar__day--in-range' : ''}
                                       ${inHoverRange
                                    ? 'calendar__day--hover-range'
                                    : ''}
                                       ${isDisabled ? 'calendar__day--disabled' : ''}"
                                @click=${() => this.selectDate(date)}
                                @mouseenter=${() => this.handleDateHover(date)}
                                ?disabled=${isDisabled}
                            >
                                ${date.getDate()}
                            </button>
                        `
                    })}
                </div>
            </div>
        `
    }

    private renderTimePicker() {
        if (!this.enableTime) return ''

        return html`
            <div class="date-picker__time">
                <div class="date-picker__time-section">
                    <div class="date-picker__time-inputs">
                        <div class="date-picker__time-input-group">
                            <input
                                type="number"
                                class="date-picker__time-input"
                                .value=${this.startHour.toString().padStart(2, '0')}
                                @input=${(e: Event) =>
                                    this.handleTimeInput(e, 'hour', true)}
                                @blur=${(e: Event) => {
                                    const input = e.target as HTMLInputElement
                                    input.value = this.startHour
                                        .toString()
                                        .padStart(2, '0')
                                }}
                                min="1"
                                max="12"
                            />
                            <div class="date-picker__time-spinners">
                                <button
                                    type="button"
                                    class="date-picker__time-spinner"
                                    @click=${() => this.changeTime('hour', 1, true)}
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
                                    @click=${() => this.changeTime('hour', -1, true)}
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
                                    this.handleTimeInput(e, 'minute', true)}
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
                                    @click=${() => this.changeTime('minute', 1, true)}
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
                                        this.changeTime('minute', -1, true)}
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

                        <button
                            type="button"
                            class="date-picker__time-period"
                            @click=${() => this.togglePeriod(true)}
                        >
                            ${this.timePeriod}
                        </button>
                    </div>
                </div>

                ${this.range
                    ? html`
                          <span class="date-picker__separator">–</span>

                          <div class="date-picker__time-section">
                              <div class="date-picker__time-inputs">
                                  <div class="date-picker__time-input-group">
                                      <input
                                          type="number"
                                          class="date-picker__time-input"
                                          .value=${this.endHour
                                              .toString()
                                              .padStart(2, '0')}
                                          @input=${(e: Event) =>
                                              this.handleTimeInput(e, 'hour', false)}
                                          @blur=${(e: Event) => {
                                              const input =
                                                  e.target as HTMLInputElement
                                              input.value = this.endHour
                                                  .toString()
                                                  .padStart(2, '0')
                                          }}
                                          min="1"
                                          max="12"
                                      />
                                      <div class="date-picker__time-spinners">
                                          <button
                                              type="button"
                                              class="date-picker__time-spinner"
                                              @click=${() =>
                                                  this.changeTime('hour', 1, false)}
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
                                                  this.changeTime('hour', -1, false)}
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
                                              this.handleTimeInput(
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
                                                  this.changeTime('minute', 1, false)}
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
                                                  this.changeTime(
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

                                  <button
                                      type="button"
                                      class="date-picker__time-period"
                                      @click=${() => this.togglePeriod(false)}
                                  >
                                      ${this.endTimePeriod}
                                  </button>
                              </div>
                          </div>
                      `
                    : ''}
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

    private renderCalendarContent() {
        return html`
            <div class="date-picker__dropdown" part="calendar">
                <div class="date-picker__content">
                    ${this.showPresets && this.filteredPresets.length > 0
                        ? html`
                              <div class="date-picker__sidebar" part="sidebar">
                                  ${this.filteredPresets.map(
                                      preset => html`
                                          <button
                                              type="button"
                                              class="date-picker__preset"
                                              @click=${() =>
                                                  this.selectPreset(preset)}
                                          >
                                              ${preset.label}
                                          </button>
                                      `
                                  )}
                              </div>
                          `
                        : ''}

                    <div class="date-picker__calendars">
                        ${this.renderCalendar(this.leftMonth, true)}
                        ${this.range
                            ? this.renderCalendar(this.rightMonth, false)
                            : ''}
                    </div>
                </div>

                ${this.enableTime ? this.renderTimePicker() : ''}
            </div>
        `
    }

    render() {
        const showSplitInputs = this.range && this.splitInputs

        // Inline mode: render directly without dropdown
        if (this.inline) {
            return html`
                <div
                    class="date-picker date-picker--inline ${showSplitInputs
                        ? 'date-picker--split-inputs'
                        : ''}"
                    @click=${(e: Event) => e.stopPropagation()}
                >
                    ${showSplitInputs
                        ? html`
                              <div class="date-picker__inputs">
                                  <terra-input
                                      .label=${this.startLabel ||
                                      (this.label
                                          ? `${this.label} (Start)`
                                          : 'Start Date')}
                                      .hideLabel=${this.hideLabel}
                                      .helpText=${this.helpText}
                                      .value=${this.getStartDateDisplayValue()}
                                      readonly
                                  >
                                      ${this.renderCalendarIcon()}
                                  </terra-input>
                                  <terra-input
                                      .label=${this.endLabel ||
                                      (this.label
                                          ? `${this.label} (End)`
                                          : 'End Date')}
                                      .hideLabel=${this.hideLabel}
                                      .helpText=${this.helpText}
                                      .value=${this.getEndDateDisplayValue()}
                                      readonly
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
                                  .value=${this.getDisplayValue()}
                                  readonly
                              >
                                  ${this.renderCalendarIcon()}
                              </terra-input>
                          `}

                    <div class="date-picker__dropdown-wrapper">
                        <div
                            class="date-picker__dropdown date-picker__dropdown--inline"
                            part="calendar"
                        >
                            <div class="date-picker__content">
                                ${this.showPresets && this.filteredPresets.length > 0
                                    ? html`
                                          <div
                                              class="date-picker__sidebar"
                                              part="sidebar"
                                          >
                                              ${this.filteredPresets.map(
                                                  preset => html`
                                                      <button
                                                          type="button"
                                                          class="date-picker__preset"
                                                          @click=${() =>
                                                              this.selectPreset(
                                                                  preset
                                                              )}
                                                      >
                                                          ${preset.label}
                                                      </button>
                                                  `
                                              )}
                                          </div>
                                      `
                                    : ''}

                                <div class="date-picker__calendars">
                                    ${this.renderCalendar(this.leftMonth, true)}
                                    ${this.range
                                        ? this.renderCalendar(this.rightMonth, false)
                                        : ''}
                                </div>
                            </div>

                            ${this.enableTime ? this.renderTimePicker() : ''}
                        </div>
                    </div>
                </div>
            `
        }

        // Non-inline mode: use dropdown
        return html`
            <div
                class="date-picker ${showSplitInputs
                    ? 'date-picker--split-inputs'
                    : ''}"
                @click=${(e: Event) => e.stopPropagation()}
            >
                ${showSplitInputs
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
                                      .label=${this.startLabel ||
                                      (this.label
                                          ? `${this.label} (Start)`
                                          : 'Start Date')}
                                      .hideLabel=${this.hideLabel}
                                      .helpText=${this.helpText}
                                      .value=${this.getStartDateDisplayValue()}
                                      readonly
                                  >
                                      ${this.renderCalendarIcon()}
                                  </terra-input>
                                  ${this.renderCalendarContent()}
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
                                      .label=${this.endLabel ||
                                      (this.label
                                          ? `${this.label} (End)`
                                          : 'End Date')}
                                      .hideLabel=${this.hideLabel}
                                      .helpText=${this.helpText}
                                      .value=${this.getEndDateDisplayValue()}
                                      readonly
                                  >
                                      ${this.renderCalendarIcon()}
                                  </terra-input>
                                  ${this.renderCalendarContent()}
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
                                  .value=${this.getDisplayValue()}
                                  readonly
                              >
                                  ${this.renderCalendarIcon()}
                              </terra-input>
                              ${this.renderCalendarContent()}
                          </terra-dropdown>
                      `}
            </div>
        `
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'terra-date-picker': TerraDatePicker
    }
}
