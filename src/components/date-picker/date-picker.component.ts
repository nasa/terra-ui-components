import { property, query } from 'lit/decorators.js'
import { html } from 'lit'
import componentStyles from '../../styles/component.styles.js'
import TerraElement from '../../internal/terra-element.js'
import styles from './date-picker.styles.js'
import type { CSSResultGroup } from 'lit'
import 'lit-flatpickr'

/**
 * @summary A date picker component that supports single date selection or date range selection.
 * @documentation https://disc.gsfc.nasa.gov/components/date-picker
 * @status experimental
 * @since 1.0
 *
 * @slot - The default slot.
 *
 * @csspart base - The component's base wrapper.
 * @csspart input - The date input element.
 */
export default class TerraDatePicker extends TerraElement {
    static styles: CSSResultGroup = [componentStyles, styles]

    @property() id: string
    @property({ type: Boolean }) range = false
    @property({ attribute: 'min-date' }) minDate?: string
    @property({ attribute: 'max-date' }) maxDate?: string
    @property({ attribute: 'start-date' }) startDate?: string
    @property({ attribute: 'end-date' }) endDate?: string
    @property({ type: Boolean, attribute: 'allow-input' }) allowInput = false
    @property({ attribute: 'alt-format' }) altFormat = 'F j, Y'
    @property({ type: Boolean, attribute: 'alt-input' }) altInput = false
    @property({ attribute: 'alt-input-class' }) altInputClass = ''
    @property({ attribute: 'date-format' }) dateFormat = 'Y-m-d'
    @property({ type: Boolean, attribute: 'enable-time' }) enableTime = false
    @property({ type: Boolean, attribute: 'time-24hr' }) time24hr = false
    @property({ type: Boolean, attribute: 'week-numbers' }) weekNumbers = false
    @property({ type: Boolean }) static = false
    @property() position: 'auto' | 'above' | 'below' = 'auto'
    @property() theme: 'light' | 'dark' | 'material_blue' | 'material_red' | 'material_green' | 'material_orange' | 'airbnb' | 'confetti' | 'none' = 'light'
    @property({ type: Number, attribute: 'show-months' }) showMonths = 1

    @query('lit-flatpickr') private flatpickrElement: any

    firstUpdated() {
        // Set up event listeners
        this.flatpickrElement.addEventListener('change', this.handleChange.bind(this))
    }

    private handleChange(e: CustomEvent) {
        const selectedDates = e.detail.selectedDates
        if (this.range) {
            this.startDate = selectedDates[0]?.toISOString().split('T')[0]
            this.endDate = selectedDates[1]?.toISOString().split('T')[0]
        } else {
            this.startDate = selectedDates[0]?.toISOString().split('T')[0]
        }
    }

    render() {
        return html`
            <lit-flatpickr
                .mode=${this.range ? 'range' : 'single'}
                .minDate=${this.minDate}
                .maxDate=${this.maxDate}
                .defaultDate=${this.range 
                    ? [this.startDate, this.endDate].filter(Boolean) as string[]
                    : this.startDate}
                .allowInput=${this.allowInput}
                .altFormat=${this.altFormat}
                .altInput=${this.altInput}
                .altInputClass=${this.altInputClass}
                .dateFormat=${this.dateFormat}
                .enableTime=${this.enableTime}
                .time24hr=${this.time24hr}
                .weekNumbers=${this.weekNumbers}
                .static=${this.static}
                .position=${this.position}
                .theme=${this.theme}
                .showMonths=${this.showMonths}
            ></lit-flatpickr>
        `
    }
}
