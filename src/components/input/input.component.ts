import { property, query, state } from 'lit/decorators.js'
import { classMap } from 'lit/directives/class-map.js'
import { html } from 'lit'
import { ifDefined } from 'lit/directives/if-defined.js'
import { live } from 'lit/directives/live.js'
import { defaultValue } from '../../internal/default-value.js'
import { FormControlController } from '../../internal/form.js'
import { HasSlotController } from '../../internal/slot.js'
import { watch } from '../../internal/watch.js'
import componentStyles from '../../styles/component.styles.js'
import formControlStyles from '../../styles/form-control.styles.js'
import TerraElement, { type TerraFormControl } from '../../internal/terra-element.js'
import styles from './input.styles.js'
import type { CSSResultGroup } from 'lit'

/**
 * @summary A text input component with consistent styling across the design system.
 * @documentation https://terra-ui.netlify.app/components/input
 * @status stable
 * @since 1.0
 *
 * @slot prefix - Used to prepend content (like an icon) to the input.
 * @slot suffix - Used to append content (like an icon) to the input.
 *
 * @event terra-input - Emitted when the input receives input.
 * @event terra-change - Emitted when an alteration to the control's value is committed by the user.
 * @event terra-focus - Emitted when the control gains focus.
 * @event terra-blur - Emitted when the control loses focus.
 * @event terra-invalid - Emitted when the form control has been checked for validity and its constraints aren't satisfied.
 *
 * @csspart base - The component's base wrapper.
 * @csspart input - The internal input control.
 * @csspart prefix - The container for prefix content.
 * @csspart suffix - The container for suffix content.
 * @csspart form-control-help-text - The help text's wrapper.
 */
export default class TerraInput extends TerraElement implements TerraFormControl {
    static styles: CSSResultGroup = [componentStyles, formControlStyles, styles]

    private readonly formControlController = new FormControlController(this, {
        value: (control: TerraInput) => control.value,
        defaultValue: (control: TerraInput) => control.defaultValue,
        setValue: (control: TerraInput, value: string) => (control.value = value),
    })
    private readonly hasSlotController = new HasSlotController(this, 'help-text')

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

    /** The default value of the form control. Primarily used for resetting the form control. */
    @defaultValue('value') defaultValue = ''

    /**
     * By default, form controls are associated with the nearest containing `<form>` element. This attribute allows you
     * to place the form control outside of a form and associate it with the form that has this `id`. The form must be in
     * the same document or shadow root for this to work.
     */
    @property({ reflect: true }) form = ''

    /** Gets the validity state object */
    get validity() {
        return this.input.validity
    }

    /** Gets the validation message */
    get validationMessage() {
        return this.input.validationMessage
    }

    firstUpdated() {
        this.formControlController.updateValidity()
    }

    handleInput() {
        this.value = this.input.value
        this.formControlController.updateValidity()
        this.emit('terra-input')
    }

    handleChange() {
        this.value = this.input.value
        this.formControlController.updateValidity()
        this.emit('terra-change')
    }

    private handleInvalid(event: Event) {
        this.formControlController.setValidity(false)
        this.formControlController.emitInvalidEvent(event)
    }

    handleFocus() {
        this.hasFocus = true
        this.emit('terra-focus')
    }

    handleBlur() {
        this.hasFocus = false
        this.formControlController.updateValidity()
        this.emit('terra-blur')
    }

    @watch('disabled', { waitUntilFirstUpdate: true })
    handleDisabledChange() {
        // Disabled form controls are always valid
        this.formControlController.setValidity(this.disabled)
    }

    /** Checks for validity but does not show a validation message. Returns `true` when valid and `false` when invalid. */
    checkValidity() {
        return this.input.checkValidity()
    }

    /** Gets the associated form, if one exists. */
    getForm(): HTMLFormElement | null {
        return this.formControlController.getForm()
    }

    /** Checks for validity and shows the browser's validation message if the control is invalid. */
    reportValidity() {
        return this.input.reportValidity()
    }

    /**
     * Sets a custom validation message. The value provided will be shown to the user when the form is submitted. To clear
     * the custom validation message, call this method with an empty string.
     */
    setCustomValidity(message: string) {
        this.input.setCustomValidity(message)
        this.formControlController.updateValidity()
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
        const hasHelpTextSlot = this.hasSlotController.test('help-text')
        const hasHelpText = this.helpText ? true : !!hasHelpTextSlot

        return html`
            <div
                class=${classMap({
                    'form-control': true,
                    'form-control--has-help-text': hasHelpText,
                })}
            >
                ${this.label
                    ? html`
                          <label
                              for="input"
                              part="form-control-label"
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
                        aria-describedby="help-text"
                        @input=${this.handleInput}
                        @change=${this.handleChange}
                        @invalid=${this.handleInvalid}
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

                <div
                    aria-hidden=${hasHelpText ? 'false' : 'true'}
                    class="form-control__help-text"
                    id="help-text"
                    part="form-control-help-text"
                >
                    <slot name="help-text">${this.helpText}</slot>
                </div>
            </div>
        `
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'terra-input': TerraInput
    }
}
