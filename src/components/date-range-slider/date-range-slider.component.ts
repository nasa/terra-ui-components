import { property, query } from 'lit/decorators.js'
import { html } from 'lit'
import componentStyles from '../../styles/component.styles.js'
import GDElement from '../../internal/gd-element.js'
import styles from './date-range-slider.styles.js'
import type { CSSResultGroup } from 'lit'
import noUiSlider, { type API } from 'nouislider'
import { isDate, format } from 'date-fns'
import invariant from 'tiny-invariant'
import { mergeTooltips } from './noui-slider-utilities.js'

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

    private _minDate: Date
    private _maxDate: Date
    private _startDate: Date
    private _endDate: Date

    @property({ attribute: 'min-date' })
    set minDate(val: string) {
        this._minDate = new Date(val)
    }

    @property({ attribute: 'max-date' })
    set maxDate(val: string) {
        this._maxDate = new Date(val)
    }

    @property({ attribute: 'start-date' })
    set startDate(val: string) {
        this._startDate = new Date(val)
    }

    @property({ attribute: 'end-date' })
    set endDate(val: string) {
        this._endDate = new Date(val)
    }

    @property({ attribute: 'date-format' })
    dateFormat: string = 'MM/dd/yyyy'

    firstUpdated() {
        invariant(isDate(this._minDate), 'must pass a valid `min-date`')
        invariant(isDate(this._maxDate), 'must pass a valid `max-date`')

        const startDate = isDate(this._startDate) ? this._startDate : this._minDate
        const endDate = isDate(this._endDate) ? this._endDate : this._maxDate

        // default selections will be the complete range if not provided
        const sliderOptions = {
            range: {
                // convert to milliseconds to define a range
                min: this._minDate.getTime(),
                max: this._maxDate.getTime(),
            },
            step: 24 * 60 * 60 * 1000, // by default, step is 1 day
            start: [startDate.getTime(), endDate.getTime()], // defaults to either the given dates or the min/max date
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

    render() {
        return html`
            <div class="container">
                <div part="slider"></div>
            </div>
        `
    }
}
