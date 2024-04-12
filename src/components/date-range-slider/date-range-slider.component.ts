import { property, query } from 'lit/decorators.js'
import { html } from 'lit'
import componentStyles from '../../styles/component.styles.js'
import GDElement from '../../internal/gd-element.js'
import styles from './date-range-slider.styles.js'
import type { CSSResultGroup } from 'lit'
import noUiSlider, { type API } from 'nouislider'
import { format } from 'date-fns'
import { mergeTooltips } from './noui-slider-utilities.js'
import { isValidDate } from '../../utilities/date.js'

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
export default class GdDateRangeSlider extends GDElement {
    static styles: CSSResultGroup = [componentStyles, styles]

    @query('[part~="slider"]')
    slider: HTMLElement & { noUiSlider: API }

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

    @property({ attribute: 'date-format' })
    dateFormat: string = 'MM/dd/yyyy'

    firstUpdated() {
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

        const startDate = isValidDate(this.startDate) ? this.startDate : this.minDate
        const endDate = isValidDate(this.endDate) ? this.endDate : this.maxDate

        // default selections will be the complete range if not provided
        const sliderOptions = {
            range: {
                // convert to milliseconds to define a range
                min: new Date(this.minDate).getTime(),
                max: new Date(this.maxDate).getTime(),
            },
            step: 24 * 60 * 60 * 1000, // by default, step is 1 day TODO: make this configurable
            start: [new Date(startDate).getTime(), new Date(endDate).getTime()], // defaults to either the given start/end dates or the full date range (min/max date)
            tooltips: [true, true], // for each handle, choose whether to show a tooltip
            connect: true, // whether to connect the handles with a colorized bar

            format: {
                to: (value: number) => {
                    // because the value is in milliseconds, we need to convert it to a date to display it
                    return format(value, this.dateFormat)
                },
                from: (value: string) => {
                    return Number(value)
                },
            },
        }

        noUiSlider.create(this.slider, sliderOptions)

        mergeTooltips(this.slider)

        /*
        this.slider.noUiSlider.on('update', function (values: any, handle: any) {
            console.log(new Intl.DateTimeFormat().format(new Date(+values[handle])))
        })*/
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

    render() {
        return html`
            <div class="container">
                <div part="slider"></div>
            </div>
        `
    }
}
