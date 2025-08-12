import { property, query } from 'lit/decorators.js'
import { html } from 'lit'
import componentStyles from '../../styles/component.styles.js'
import TerraElement from '../../internal/terra-element.js'
import styles from './date-picker.styles.js'
import type { CSSResultGroup } from 'lit'
import 'lit-flatpickr'
import TerraButton from '../button/button.component.js'

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
    static dependencies = {
        'terra-button': TerraButton,
    }

    selectedDates: {
        startDate: string | null
        endDate: string | null
    } // intentionally not using state decorator to avoid re-rendering

    @property() id: string
    @property({ type: Boolean }) range = false
    @property({ attribute: 'min-date' }) minDate?: string
    @property({ attribute: 'max-date' }) maxDate?: string
    @property({ attribute: 'start-date' }) startDate?: string
    @property({ attribute: 'end-date' }) endDate?: string
    @property({ attribute: 'default-date' }) defaultDate?: string
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
    @property({ type: Number, attribute: 'show-months' }) showMonths = 1
    @property({ attribute: 'hide-label', type: Boolean }) hideLabel = false
    @property() label: string = 'Select Date'

    @query('lit-flatpickr') private flatpickrElement: any

    firstUpdated() {
        this.flatpickrElement.addEventListener('change', this.handleChange.bind(this))

        setTimeout(() => {
            // need to give flatpickr a bit to render
            this.flatpickrElement.shadowRoot
                .querySelector('input')
                .addEventListener('blur', this.handleBlur.bind(this))
        }, 250)
    }

    private handleChange(selectedDates: Date[]) {
        this.selectedDates = {
            startDate: selectedDates[0]?.toISOString().split('T')[0],
            endDate: this.range
                ? selectedDates[1]?.toISOString().split('T')[0]
                : null,
        }

        this.emit('terra-change')
    }

    private handleBlur() {
        this.handleChange(this.flatpickrElement._instance.selectedDates)
    }

    render() {
        return html`
            <div class="date-picker">
                <label
                    for="date-picker__input"
                    class=${this.hideLabel ? 'sr-only' : 'date-picker__input_label'}
                    >${this.label}</label
                >
                <div class="date-picker__input_fields">
                    <lit-flatpickr
                        id="date-picker__input"
                        class="form-control"
                        .mode=${this.range ? 'range' : 'single'}
                        .minDate=${this.minDate}
                        .maxDate=${this.maxDate}
                        .defaultDate=${this.range
                            ? ([this.startDate, this.endDate].filter(
                                  Boolean
                              ) as string[])
                            : this.defaultDate}
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
                        .showMonths=${this.showMonths}
                        theme="material_blue"
                        .onChange="${this.handleChange.bind(this)}"
                    ></lit-flatpickr>
                    <terra-button
                        shape="square-left"
                        size="medium"
                        class="date-picker__input_icon_button"
                        @click=${() => this.flatpickrElement.open()}
                        type="button"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke-width="1.5"
                            stroke="currentColor"
                            class="w-6 h-6"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
                            />
                        </svg>
                    </terra-button>
                </div>
            </div>
        `
    }
}
