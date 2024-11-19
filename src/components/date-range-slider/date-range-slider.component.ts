import { property, query } from 'lit/decorators.js'
import { html } from 'lit'
import componentStyles from '../../styles/component.styles.js'
import TerraElement from '../../internal/terra-element.js'
import styles from './date-range-slider.styles.js'
import type { CSSResultGroup } from 'lit'
import noUiSlider, {
    PipsMode,
    type API,
    type Options,
    type Formatter,
} from 'nouislider'
import { format } from 'date-fns'
import { mergeTooltips } from './noui-slider-utilities.js'
import { isValidDate } from '../../utilities/date.js'
import { watch } from '../../internal/watch.js'

export type TimeScale = 'half-hourly' | 'hourly' | 'daily'

/**
 * @summary Short summary of the component's intended use.
 * @documentation https://disc.gsfc.nasa.gov/components/date-range-slider
 * @status experimental
 * @since 1.0
 *
 * @slot - The default slot.
 * @slot example - An example slot.
 *
 * @csspart base - The component's base wrapper.
 *
 * @cssproperty --example - An example CSS custom property.
 */
export default class TerraDateRangeSlider extends TerraElement {
    static styles: CSSResultGroup = [componentStyles, styles]

    @query('[part~="slider"]')
    slider: HTMLElement & { noUiSlider: API }

    @property({ attribute: 'time-scale' })
    timeScale: TimeScale = 'daily'

    @property({ attribute: 'min-date' })
    minDate: string

    @property({ attribute: 'max-date' })
    maxDate: string

    /**
     * The start date for the time series plot.
     * @example 2021-01-01
     */
    @property({ attribute: 'start-date' })
    startDate: string

    @property({ attribute: 'end-date' })
    endDate: string

    @property({ type: Boolean, reflect: true })
    disabled: boolean = false

    @property({ type: Boolean, reflect: true, attribute: 'has-pips' })
    hasPips: boolean = true

    @watch(['startDate', 'endDate', 'minDate', 'maxDate'])
    updateSlider() {
        this.renderSlider()
    }

    @watch('disabled')
    disabledChanged() {
        this.disabled
            ? this.slider?.noUiSlider?.disable()
            : this.slider?.noUiSlider?.enable()
    }

    firstUpdated() {
        this.renderSlider()
    }

    renderSlider() {
        if (!this.slider) {
            // DOM for this component hasn't loaded yet
            return
        }

        // destroy any existing slider
        this.slider.noUiSlider?.destroy()

        if (!isValidDate(this.minDate) || !isValidDate(this.maxDate)) {
            // at minimum, we need a minDate and maxDate to render the slider
            this.renderEmptySlider()

            // only log if the user passed something in that was invalid
            this.minDate &&
                !isValidDate(this.minDate) &&
                console.error('Invalid min date provided')
            this.maxDate &&
                !isValidDate(this.maxDate) &&
                console.error('Invalid max date provided')

            return
        }

        const minDate = new Date(this.minDate)
        const maxDate = new Date(this.maxDate)
        const startDate = new Date(
            isValidDate(this.startDate) ? this.startDate : this.minDate
        )
        const endDate = new Date(
            isValidDate(this.endDate) ? this.endDate : this.maxDate
        )

        // adjust dates to be beginning and end of the day
        minDate.setUTCHours(0, 0, 0, 0)
        startDate.setUTCHours(0, 0, 0, 0)
        maxDate.setUTCHours(23, 59, 59, 999)
        endDate.setUTCHours(23, 59, 59, 999)

        // default selections will be the complete range if not provided
        const sliderOptions: Options = {
            range: {
                // convert to milliseconds to define a range
                min: minDate.getTime(),
                max: maxDate.getTime(),
            },
            behaviour: 'drag',
            step: this._getStep(),
            start: [startDate.getTime(), endDate.getTime()], // defaults to either the given start/end dates or the full date range (min/max date)
            tooltips: [true, true], // for each handle, choose whether to show a tooltip
            connect: true, // whether to connect the handles with a colorized bar
            pips: {
                mode: PipsMode.Range,
                density: -1,
                format: this._getSliderFormatter(),
            },

            format: this._getSliderFormatter(),
        }

        noUiSlider.create(this.slider, sliderOptions)

        mergeTooltips(this.slider)

        this.slider.noUiSlider.on('change', (values: any) => {
            this.emit('terra-date-range-change', {
                detail: {
                    startDate: this._formatDate(values[0]),
                    endDate: this._formatDate(values[1]),
                },
            })
        })
    }

    renderEmptySlider() {
        noUiSlider.create(this.slider, {
            start: [0, 0],
            range: {
                min: 0,
                max: 0,
            },
        })
    }

    private _getStep() {
        const oneMinuteMillis = 60 * 1000
        const oneHourMillis = 60 * oneMinuteMillis
        const oneDayMillis = 24 * oneHourMillis

        switch (this.timeScale) {
            case 'half-hourly':
                return 30 * oneMinuteMillis

            case 'hourly':
                return oneHourMillis

            default:
                return oneDayMillis
        }
    }

    private _getSliderFormatter(): Formatter {
        return {
            to: (value: number) => {
                // because the value is in milliseconds, we need to convert it to a date to display it
                return this._formatDate(value)
            },
            from: (value: string) => {
                return Number(value)
            },
        }
    }

    private _formatDate(date: string | number | Date) {
        const dateFormat =
            this.timeScale === 'daily' ? 'yyyy-MM-dd' : 'yyyy-MM-dd HH:mm'
        return format(new Date(date).toUTCString(), dateFormat)
    }

    render() {
        const containerClass = 'container' + this.hasPips ? ' hasPips' : ''

        return html`
            <div class="${containerClass}">
                <div part="slider"></div>
            </div>
        `
    }
}
