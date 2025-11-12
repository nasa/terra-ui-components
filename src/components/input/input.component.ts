import { property, query, state } from 'lit/decorators.js'
import { classMap } from 'lit/directives/class-map.js'
import { html } from 'lit'
import { ifDefined } from 'lit/directives/if-defined.js'
import { live } from 'lit/directives/live.js'
import componentStyles from '../../styles/component.styles.js'
import TerraElement from '../../internal/terra-element.js'
import styles from './input.styles.js'
import type { CSSResultGroup } from 'lit'

/**
 * @summary A text input component with consistent styling across the design system.
 * @documentation https://disc.gsfc.nasa.gov/components/input
 * @status stable
 * @since 2.0
 *
 * @slot prefix - Used to prepend content (like an icon) to the input.
 * @slot suffix - Used to append content (like an icon) to the input.
 *
 * @event terra-input - Emitted when the input receives input.
 * @event terra-change - Emitted when an alteration to the control's value is committed by the user.
 * @event terra-focus - Emitted when the control gains focus.
 * @event terra-blur - Emitted when the control loses focus.
 *
 * @csspart base - The component's base wrapper.
 * @csspart input - The internal input control.
 * @csspart prefix - The container for prefix content.
 * @csspart suffix - The container for suffix content.
 */
export default class TerraInput extends TerraElement {
    static styles: CSSResultGroup = [componentStyles, styles]

    @query('.input__control') input: HTMLInputElement

    @state() hasFocus = false

    @property() type:
        | 'text'
        | 'email'
        | 'number'
        | 'password'
        | 'search'
        | 'tel'
        | 'url' = 'text'
    @property() name = ''
    @property() value = ''
    @property() placeholder = ''
    @property({ type: Boolean, reflect: true }) disabled = false
    @property({ type: Boolean, reflect: true }) readonly = false
    @property({ type: Boolean, reflect: true }) required = false
    @property() autocomplete?: string
    @property({ type: Number }) minlength?: number
    @property({ type: Number }) maxlength?: number
    @property() min?: number | string
    @property() max?: number | string
    @property() step?: number | 'any'
    @property() pattern?: string
    @property({ attribute: 'input-mode' }) inputMode:
        | 'none'
        | 'text'
        | 'decimal'
        | 'numeric'
        | 'tel'
        | 'search'
        | 'email'
        | 'url' = 'text'
    @property() label = ''
    @property({ attribute: 'hide-label', type: Boolean }) hideLabel = false
    @property({ attribute: 'help-text' }) helpText = ''

    handleInput() {
        this.value = this.input.value
        this.emit('terra-input')
    }

    handleChange() {
        this.value = this.input.value
        this.emit('terra-change')
    }

    handleFocus() {
        this.hasFocus = true
        this.emit('terra-focus')
    }

    handleBlur() {
        this.hasFocus = false
        this.emit('terra-blur')
    }

    focus(options?: FocusOptions) {
        this.input.focus(options)
    }

    blur() {
        this.input.blur()
    }

    select() {
        this.input.select()
    }

    setSelectionRange(
        selectionStart: number,
        selectionEnd: number,
        selectionDirection: 'forward' | 'backward' | 'none' = 'none'
    ) {
        this.input.setSelectionRange(selectionStart, selectionEnd, selectionDirection)
    }

    render() {
        const hasPrefix = this.querySelector('[slot="prefix"]') !== null
        const hasSuffix = this.querySelector('[slot="suffix"]') !== null

        return html`
            <div class="input-wrapper">
                ${this.label
                    ? html`
                          <label
                              for="input"
                              class=${this.hideLabel
                                  ? 'input__label input__label--hidden'
                                  : 'input__label'}
                          >
                              ${this.label}
                              ${this.required
                                  ? html`<span class="input__required-indicator"
                                        >*</span
                                    >`
                                  : ''}
                          </label>
                      `
                    : ''}

                <div
                    part="base"
                    class=${classMap({
                        input: true,
                        'input--disabled': this.disabled,
                        'input--focused': this.hasFocus,
                        'input--has-prefix': hasPrefix,
                        'input--has-suffix': hasSuffix,
                    })}
                >
                    ${hasPrefix
                        ? html`
                              <span part="prefix" class="input__prefix">
                                  <slot name="prefix"></slot>
                              </span>
                          `
                        : ''}

                    <input
                        part="input"
                        id="input"
                        class="input__control"
                        type=${this.type}
                        name=${ifDefined(this.name || undefined)}
                        ?disabled=${this.disabled}
                        ?readonly=${this.readonly}
                        ?required=${this.required}
                        placeholder=${ifDefined(this.placeholder || undefined)}
                        minlength=${ifDefined(this.minlength)}
                        maxlength=${ifDefined(this.maxlength)}
                        min=${ifDefined(this.min)}
                        max=${ifDefined(this.max)}
                        step=${ifDefined(this.step)}
                        .value=${live(this.value)}
                        autocomplete=${ifDefined(this.autocomplete)}
                        pattern=${ifDefined(this.pattern)}
                        inputmode=${ifDefined(this.inputMode)}
                        @input=${this.handleInput}
                        @change=${this.handleChange}
                        @focus=${this.handleFocus}
                        @blur=${this.handleBlur}
                    />

                    ${hasSuffix
                        ? html`
                              <span part="suffix" class="input__suffix">
                                  <slot name="suffix"></slot>
                              </span>
                          `
                        : ''}
                </div>

                ${this.helpText
                    ? html`<div class="input__help-text">${this.helpText}</div>`
                    : ''}
            </div>
        `
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'terra-input': TerraInput
    }
}
