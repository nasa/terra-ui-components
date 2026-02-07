import { property, query, state } from 'lit/decorators.js'
import { html } from 'lit'
import { watch } from '../../internal/watch.js'
import componentStyles from '../../styles/component.styles.js'
import TerraElement from '../../internal/terra-element.js'
import styles from './slider.styles.js'
import type { CSSResultGroup } from 'lit'
import noUiSlider, { type API, type Options, PipsMode } from 'nouislider'
import { mergeTooltips } from '../date-range-slider/noui-slider-utilities.js'

/**
 * @summary A flexible slider component for selecting single values or ranges with optional input fields.
 * @documentation https://terra-ui.netlify.app/components/slider
 * @status stable
 * @since 1.0
 *
 * @slot - Additional content below the slider.
 *
 * @csspart slider - The slider container element.
 * @csspart inputs - The input fields container (when show-inputs is enabled).
 *
 * @cssproperty --terra-slider-track-color - Color of the slider track.
 * @cssproperty --terra-slider-handle-color - Color of the slider handles.
 * @cssproperty --terra-slider-connect-color - Color of the connected range.
 * @cssproperty --terra-input-border-color - Border color for input fields.
 * @cssproperty --terra-input-background-color - Background color for input fields.
 * @cssproperty --terra-input-color - Text color for input fields.
 *
 * @event terra-slider-change - Emitted when the slider value changes.
 * @eventDetail { value: number } - For single mode sliders.
 * @eventDetail { startValue: number, endValue: number } - For range mode sliders.
 */
export type SliderMode = 'single' | 'range'

export default class TerraSlider extends TerraElement {
    static styles: CSSResultGroup = [componentStyles, styles]

    @query('[part~="slider"]')
    slider!: HTMLElement & { noUiSlider: API }

    /**
     * The slider mode - either 'single' for one value or 'range' for selecting a range.
     * @default 'single'
     */
    @property({ reflect: true })
    mode: SliderMode = 'single'

    /**
     * The minimum value of the slider.
     * @default 0
     */
    @property({ type: Number })
    min: number = 0

    /**
     * The maximum value of the slider.
     * @default 100
     */
    @property({ type: Number })
    max: number = 100

    /**
     * The step size for the slider. Use integers (1, 2, 5) for whole numbers or decimals (0.1, 0.2, 0.5) for fractional steps.
     * @default 1
     */
    @property({ type: Number })
    step: number = 1

    /**
     * Disables the slider.
     * @default false
     */
    @property({ type: Boolean, reflect: true })
    disabled: boolean = false

    /**
     * Shows tick marks and labels on the slider.
     * @default false
     */
    @property({ type: Boolean, reflect: true, attribute: 'has-pips' })
    hasPips: boolean = false

    /**
     * Shows tooltips on the slider handles.
     * When false (default), selected values are shown in the top right instead.
     * @default false
     */
    @property({ type: Boolean, reflect: true, attribute: 'has-tooltips' })
    hasTooltips: boolean = false

    /**
     * Shows input fields below the slider for precise value entry.
     * @default false
     */
    @property({ type: Boolean, reflect: true, attribute: 'show-inputs' })
    showInputs: boolean = false

    /**
     * The current value for single mode sliders.
     */
    @property({ type: Number })
    value?: number

    /**
     * The start value for range mode sliders.
     */
    @property({ type: Number, attribute: 'start-value' })
    startValue?: number

    /**
     * The end value for range mode sliders.
     */
    @property({ type: Number, attribute: 'end-value' })
    endValue?: number

    /**
     * The label text for the slider.
     * @default 'Slider'
     */
    @property()
    label: string = 'Slider'

    /**
     * Hide the slider's label text.
     * When hidden, still presents to screen readers.
     * @default false
     */
    @property({ attribute: 'hide-label', type: Boolean })
    hideLabel: boolean = false

    @state() private currentStartValue?: number
    @state() private currentEndValue?: number
    @state() private currentValue?: number
    @state() private hasBeenManipulated = false

    @watch([
        'mode',
        'min',
        'max',
        'step',
        'value',
        'startValue',
        'endValue',
        'hasPips',
        'hasTooltips',
        'showInputs',
    ])
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

    private _getStartValues(): [number, number] | [number] {
        const min = Number(this.min)
        const max = Number(this.max)

        if (this.mode === 'range') {
            const start = this.startValue ?? min
            const end = this.endValue ?? max
            return [start, end]
        }

        const single = this.value ?? min
        return [single]
    }

    renderSlider() {
        if (!this.slider) return

        // destroy any existing slider
        this.slider.noUiSlider?.destroy()

        // basic validation
        const min = Number(this.min)
        const max = Number(this.max)
        if (!Number.isFinite(min) || !Number.isFinite(max) || max < min) {
            // fallback empty slider to avoid runtime errors
            noUiSlider.create(this.slider, {
                start: [0],
                range: { min: 0, max: 0 },
            })
            return
        }

        const startValues = this._getStartValues()

        const options: Options = {
            range: { min, max },
            start: startValues as any,
            step: this.step,
            connect: this.mode === 'range',
            tooltips: this.hasTooltips
                ? this.mode === 'range'
                    ? [this.hasTooltips, this.hasTooltips]
                    : this.hasTooltips
                : false,
            behaviour: 'drag',
            format: this._getFormatter(),
            pips: this.hasPips
                ? {
                      mode: PipsMode.Range,
                      density: -1,
                      format: this._getFormatter(),
                  }
                : undefined,
        }

        noUiSlider.create(this.slider, options)

        // Initialize current values
        const initialValues = this.slider.noUiSlider.get()
        if (this.mode === 'range') {
            const [start, end] = Array.isArray(initialValues)
                ? initialValues.map(Number)
                : [min, max]
            this.currentStartValue = start
            this.currentEndValue = end
            this.hasBeenManipulated = start !== min || end !== max
        } else {
            const [val] = Array.isArray(initialValues)
                ? initialValues.map(Number)
                : [min]
            this.currentValue = val
            this.hasBeenManipulated = val !== min
        }

        // Merge tooltips when they get close together (only for range mode with tooltips)
        if (this.hasTooltips && this.mode === 'range') {
            mergeTooltips(this.slider, 15, '-')
        }

        // Track value updates for display in header
        this.slider.noUiSlider.on('update', (values: string[]) => {
            if (this.mode === 'range') {
                const [start, end] = values.map(Number)
                this.currentStartValue = start
                this.currentEndValue = end
                this.hasBeenManipulated = start !== min || end !== max
            } else {
                const [val] = values.map(Number)
                this.currentValue = val
                this.hasBeenManipulated = val !== min
            }
            this.requestUpdate()
        })

        this.slider.noUiSlider.on('change', (values: string[]) => {
            if (this.mode === 'range') {
                const [start, end] = values.map(Number)
                this.currentStartValue = start
                this.currentEndValue = end
                this.hasBeenManipulated = start !== min || end !== max
                this.emit('terra-slider-change', {
                    detail: { startValue: start, endValue: end },
                })
            } else {
                const [val] = values.map(Number)
                this.currentValue = val
                this.hasBeenManipulated = val !== min
                this.emit('terra-slider-change', { detail: { value: val } })
            }
            this.requestUpdate()
        })

        // Update input fields when slider changes
        this.slider.noUiSlider.on('update', () => {
            this._updateInputFields()
        })

        this.slider.noUiSlider.on('change', () => {
            this._updateInputFields()
        })

        // respect disabled initial state
        this.disabledChanged()
    }

    private _updateInputFields() {
        if (!this.showInputs) {
            return
        }

        const rawValues = this.slider.noUiSlider.get()

        // Handle case where get() returns a string instead of an array
        const currentValues = Array.isArray(rawValues) ? rawValues : [rawValues]

        // Force a re-render to ensure inputs exist
        this.requestUpdate()

        // Use a small delay to ensure inputs are rendered
        setTimeout(() => {
            if (this.mode === 'range') {
                const startInput = this.shadowRoot?.querySelector(
                    '#slider-start-input'
                ) as HTMLInputElement
                const endInput = this.shadowRoot?.querySelector(
                    '#slider-end-input'
                ) as HTMLInputElement

                if (startInput) {
                    startInput.value = this._formatValue(Number(currentValues[0]))
                }
                if (endInput) {
                    endInput.value = this._formatValue(Number(currentValues[1]))
                }
            } else {
                const valueInput = this.shadowRoot?.querySelector(
                    '#slider-value-input'
                ) as HTMLInputElement
                if (valueInput) {
                    valueInput.value = this._formatValue(Number(currentValues[0]))
                }
            }
        }, 10)
    }

    private _getFormatter() {
        // If step is a whole number (like 1, 2, 5), show integers
        // If step is fractional (like 0.1, 0.2, 0.5), show appropriate decimals
        const isIntegerStep = Number.isInteger(this.step)

        return {
            to: (value: number) => {
                if (isIntegerStep) {
                    return Math.round(value).toString()
                } else {
                    // Count decimal places in step
                    const stepStr = this.step.toString()
                    const decimalPlaces = stepStr.includes('.')
                        ? stepStr.split('.')[1].length
                        : 0
                    return value.toFixed(decimalPlaces)
                }
            },
            from: (value: string) => {
                return Number(value)
            },
        }
    }

    private _formatValue(value: number | string | undefined): string {
        // Convert to number and handle undefined/null cases
        const numValue = Number(value)

        // If conversion failed or value is NaN, return 0
        if (isNaN(numValue)) {
            return '0'
        }

        const isIntegerStep = Number.isInteger(this.step)

        if (isIntegerStep) {
            return Math.round(numValue).toString()
        } else {
            // Count decimal places in step
            const stepStr = this.step.toString()
            const decimalPlaces = stepStr.includes('.')
                ? stepStr.split('.')[1].length
                : 0
            return numValue.toFixed(decimalPlaces)
        }
    }

    private handleClear() {
        const min = Number(this.min)
        const max = Number(this.max)

        if (this.mode === 'range') {
            this.slider.noUiSlider.set([min, max])
            this.currentStartValue = min
            this.currentEndValue = max
            this.hasBeenManipulated = false
        } else {
            this.slider.noUiSlider.set([min])
            this.currentValue = min
            this.hasBeenManipulated = false
        }

        this.requestUpdate()
    }

    render() {
        const containerClass = 'container' + (this.hasPips ? ' hasPips' : '')
        const min = Number(this.min)
        const max = Number(this.max)

        // Get current values for display
        const startValue =
            this.currentStartValue ?? (this.mode === 'range' ? min : undefined)
        const endValue =
            this.currentEndValue ?? (this.mode === 'range' ? max : undefined)
        const singleValue =
            this.currentValue ?? (this.mode === 'single' ? min : undefined)

        // Current range display (for header)
        const currentRangeDisplay =
            this.mode === 'range'
                ? `${this._formatValue(startValue!)}–${this._formatValue(endValue!)}`
                : this._formatValue(singleValue!)

        return html`
            <div class="slider">
                ${!this.hasTooltips
                    ? html`
                          <div class="slider__header">
                              <label
                                  for="slider-control"
                                  class=${this.hideLabel
                                      ? 'sr-only'
                                      : 'slider__label'}
                                  >${this.label}</label
                              >
                              <div class="slider__header-right">
                                  ${this.hasBeenManipulated
                                      ? html`
                                            <button
                                                class="slider__clear"
                                                @click="${this.handleClear}"
                                                type="button"
                                            >
                                                Clear
                                            </button>
                                        `
                                      : ''}
                                  <span class="slider__current-range"
                                      >${currentRangeDisplay}</span
                                  >
                              </div>
                          </div>
                      `
                    : html`
                          <label
                              for="slider-control"
                              class=${this.hideLabel ? 'sr-only' : 'slider__label'}
                              >${this.label}</label
                          >
                      `}
                <div class="${containerClass}">
                    <div part="slider" id="slider-control"></div>
                    ${this.showInputs ? this._renderInputFields() : ''}
                    <slot></slot>
                </div>
            </div>
        `
    }

    private _renderInputFields() {
        if (this.mode === 'range') {
            return html`
                <div class="slider-inputs">
                    <input
                        id="slider-start-input"
                        type="number"
                        .min="${this.min}"
                        .max="${this.max}"
                        .step="${this.step}"
                        .value="${this._formatValue(
                            this.startValue ?? this.min ?? 0
                        )}"
                        @change="${this._handleInputChange}"
                        @keydown="${this._handleInputKeydown}"
                    />
                    <span class="input-separator">to</span>
                    <input
                        id="slider-end-input"
                        type="number"
                        .min="${this.min}"
                        .max="${this.max}"
                        .step="${this.step}"
                        .value="${this._formatValue(
                            this.endValue ?? this.max ?? 100
                        )}"
                        @change="${this._handleInputChange}"
                        @keydown="${this._handleInputKeydown}"
                    />
                </div>
            `
        } else {
            return html`
                <div class="slider-inputs">
                    <input
                        id="slider-value-input"
                        type="number"
                        .min="${this.min}"
                        .max="${this.max}"
                        .step="${this.step}"
                        .value="${this._formatValue(this.value ?? this.min ?? 0)}"
                        @change="${this._handleInputChange}"
                        @keydown="${this._handleInputKeydown}"
                    />
                </div>
            `
        }
    }

    private _handleInputChange(event: Event) {
        const input = event.target as HTMLInputElement
        const value = Number(input.value)
        const min = Number(this.min)
        const max = Number(this.max)

        // Clamp value to range
        const clampedValue = Math.max(min, Math.min(max, value))
        input.value = this._formatValue(clampedValue)

        if (this.mode === 'range') {
            const currentValues = this.slider.noUiSlider.get() as number[]
            const newValues = [...currentValues]

            if (input.id === 'slider-start-input') {
                newValues[0] = clampedValue
            } else {
                newValues[1] = clampedValue
            }

            this.slider.noUiSlider.set(newValues)

            // Emit the change event for range mode
            this.emit('terra-slider-change', {
                detail: { startValue: newValues[0], endValue: newValues[1] },
            })
        } else {
            this.slider.noUiSlider.set([clampedValue])

            // Emit the change event for single mode
            this.emit('terra-slider-change', { detail: { value: clampedValue } })
        }
    }

    private _handleInputKeydown(event: KeyboardEvent) {
        if (event.key === 'Enter') {
            ;(event.target as HTMLInputElement).blur()
        }
    }
}
