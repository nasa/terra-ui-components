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
import TerraIcon from '../icon/icon.component.js'
import styles from './input.styles.js'
import type { CSSResultGroup } from 'lit'

/**
 * @summary A text input component with consistent styling across the design system.
 * @documentation https://terra-ui.netlify.app/components/input
 * @status stable
 * @since 1.0
 *
 * @dependency terra-icon
 *
 * @slot prefix - Used to prepend content (like an icon) to the input.
 * @slot suffix - Used to append content (like an icon) to the input. When `clearable` or `resettable` is true, this slot is overridden.
 * @slot clear-icon - An icon to use in lieu of the default clear icon.
 * @slot show-password-icon - An icon to use in lieu of the default show password icon.
 * @slot hide-password-icon - An icon to use in lieu of the default hide password icon.
 * @slot help-text - Text that describes how to use the input. Alternatively, you can use the `help-text` attribute.
 *
 * @event terra-input - Emitted when the input receives input.
 * @event terra-change - Emitted when an alteration to the control's value is committed by the user.
 * @event terra-focus - Emitted when the control gains focus.
 * @event terra-blur - Emitted when the control loses focus.
 * @event terra-invalid - Emitted when the form control has been checked for validity and its constraints aren't satisfied.
 * @event terra-clear - Emitted when the clear button is activated.
 *
 * @csspart base - The component's base wrapper.
 * @csspart input - The internal input control.
 * @csspart prefix - The container for prefix content.
 * @csspart suffix - The container for suffix content.
 * @csspart clear-button - The clear button.
 * @csspart password-toggle-button - The password toggle button.
 * @csspart form-control-help-text - The help text's wrapper.
 * @csspart form-control-error-text - The error text's wrapper.
 */
export default class TerraInput extends TerraElement implements TerraFormControl {
    static styles: CSSResultGroup = [componentStyles, formControlStyles, styles]
    static dependencies = {
        'terra-icon': TerraIcon,
    }

    private readonly formControlController = new FormControlController(this, {
        value: (control: TerraInput) => control.value,
        defaultValue: (control: TerraInput) => control.defaultValue,
        setValue: (control: TerraInput, value: string) => (control.value = value),
    })
    private readonly hasSlotController = new HasSlotController(
        this,
        'help-text',
        'error',
        'clear-icon',
        'show-password-icon',
        'hide-password-icon'
    )

    @query('.input__control') input: HTMLInputElement

    @state() hasFocus = false
    @state() private validationErrorMessage = ''

    // In-memory inputs for valueAsDate and valueAsNumber getters/setters
    private __numberInput = Object.assign(document.createElement('input'), {
        type: 'number',
    })
    private __dateInput = Object.assign(document.createElement('input'), {
        type: 'date',
    })

    @property() title = '' // make reactive to pass through

    @property({ reflect: true }) type:
        | 'date'
        | 'datetime-local'
        | 'email'
        | 'number'
        | 'password'
        | 'search'
        | 'tel'
        | 'text'
        | 'time'
        | 'url' = 'text'
    @property() name = ''
    @property() value = ''
    @property() placeholder = ''
    @property({ reflect: true }) size: 'small' | 'medium' | 'large' = 'medium'
    @property({ type: Boolean, reflect: true }) filled = false
    @property({ type: Boolean, reflect: true }) pill = false
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
    @property({ attribute: 'error-text' }) errorText = ''
    @property({ type: Boolean }) clearable = false
    @property({ attribute: 'password-toggle', type: Boolean })
    passwordToggle = false
    @property({ attribute: 'password-visible', type: Boolean })
    passwordVisible = false
    @property({ attribute: 'no-spin-buttons', type: Boolean })
    noSpinButtons = false
    // Note: autocapitalize and autocorrect can be set via HTML attributes and will pass through to the input element
    // They are not exposed as properties to avoid type conflicts with base classes
    @property({ type: Boolean }) autofocus = false
    @property() enterkeyhint?:
        | 'enter'
        | 'done'
        | 'go'
        | 'next'
        | 'previous'
        | 'search'
        | 'send'
    @property({
        type: Boolean,
        converter: {
            // Allow "true|false" attribute values but keep the property boolean
            fromAttribute: value => (!value || value === 'false' ? false : true),
            toAttribute: value => (value ? 'true' : 'false'),
        },
    })
    spellcheck = true

    /** The default value of the form control. Primarily used for resetting the form control. */
    @defaultValue('value') defaultValue = ''

    /**
     * When true, shows a reset icon in the suffix that clears the input value when clicked.
     * The input will be reset to its `defaultValue` (or empty string if no defaultValue is set).
     */
    @property({ type: Boolean, reflect: true }) resettable = false

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

    /**
     * Gets or sets the current value as a `Date` object. Returns `null` if the value can't be converted.
     * This will use the native `<input type="{{type}}">` implementation and may result in an error.
     */
    get valueAsDate() {
        this.__dateInput.type = this.type
        this.__dateInput.value = this.value
        return this.input?.valueAsDate || this.__dateInput.valueAsDate
    }

    set valueAsDate(newValue: Date | null) {
        this.__dateInput.type = this.type
        this.__dateInput.valueAsDate = newValue
        this.value = this.__dateInput.value
    }

    /** Gets or sets the current value as a number. Returns `NaN` if the value can't be converted. */
    get valueAsNumber() {
        this.__numberInput.value = this.value
        return this.input?.valueAsNumber || this.__numberInput.valueAsNumber
    }

    set valueAsNumber(newValue: number) {
        this.__numberInput.valueAsNumber = newValue
        this.value = this.__numberInput.value
    }

    firstUpdated() {
        this.formControlController.updateValidity()
    }

    handleInput() {
        this.value = this.input.value
        this.formControlController.updateValidity()
        this.updateValidationErrorMessage()
        this.emit('terra-input')
    }

    handleChange() {
        this.value = this.input.value
        this.formControlController.updateValidity()
        this.emit('terra-change')
    }

    private handleInvalid(event: Event) {
        this.formControlController.setValidity(false)
        this.updateValidationErrorMessage()
        this.formControlController.emitInvalidEvent(event)
    }

    handleFocus() {
        this.hasFocus = true
        this.emit('terra-focus')
    }

    handleBlur() {
        this.hasFocus = false
        this.formControlController.updateValidity()
        this.updateValidationErrorMessage()
        this.emit('terra-blur')
    }

    private handleKeyDown(event: KeyboardEvent) {
        const hasModifier =
            event.metaKey || event.ctrlKey || event.shiftKey || event.altKey

        // Pressing enter when focused on an input should submit the form like a native input, but we wait a tick before
        // submitting to allow users to cancel the keydown event if they need to
        if (event.key === 'Enter' && !hasModifier) {
            setTimeout(() => {
                //
                // When using an Input Method Editor (IME), pressing enter will cause the form to submit unexpectedly. One way
                // to check for this is to look at event.isComposing, which will be true when the IME is open.
                //
                // See https://github.com/shoelace-style/shoelace/pull/988
                //
                if (!event.defaultPrevented && !event.isComposing) {
                    this.formControlController.submit()
                }
            })
        }
    }

    private updateValidationErrorMessage() {
        if (this.input) {
            if (!this.input.validity.valid) {
                this.validationErrorMessage = this.input.validationMessage
            } else {
                this.validationErrorMessage = ''
            }
        } else {
            this.validationErrorMessage = ''
        }
    }

    private handleReset(event: Event) {
        event.preventDefault()
        event.stopPropagation()

        if (this.disabled || this.readonly) {
            return
        }

        this.value = this.defaultValue || ''
        this.input.value = this.value
        this.formControlController.updateValidity()
        this.emit('terra-change')
        this.input.focus()
    }

    private handleClearClick(event: MouseEvent) {
        event.preventDefault()

        if (this.value !== '') {
            this.value = ''
            this.emit('terra-clear')
            this.emit('terra-input')
            this.emit('terra-change')
        }

        this.input.focus()
    }

    private handlePasswordToggle() {
        this.passwordVisible = !this.passwordVisible
    }

    @watch('disabled', { waitUntilFirstUpdate: true })
    handleDisabledChange() {
        // Disabled form controls are always valid
        this.formControlController.setValidity(this.disabled)
    }

    @watch('step', { waitUntilFirstUpdate: true })
    handleStepChange() {
        // If step changes, the value may become invalid so we need to recheck after the update. We set the new step
        // imperatively so we don't have to wait for the next render to report the updated validity.
        if (this.input) {
            this.input.step = String(this.step)
            this.formControlController.updateValidity()
        }
    }

    @watch('value', { waitUntilFirstUpdate: true })
    async handleValueChange() {
        await this.updateComplete
        this.formControlController.updateValidity()
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

    /** Replaces a range of text with a new string. */
    setRangeText(
        replacement: string,
        start?: number,
        end?: number,
        selectMode: 'select' | 'start' | 'end' | 'preserve' = 'preserve'
    ) {
        const selectionStart = start ?? this.input.selectionStart!
        const selectionEnd = end ?? this.input.selectionEnd!

        this.input.setRangeText(replacement, selectionStart, selectionEnd, selectMode)

        if (this.value !== this.input.value) {
            this.value = this.input.value
        }
    }

    /** Displays the browser picker for an input element (only works if the browser supports it for the input type). */
    showPicker() {
        if ('showPicker' in HTMLInputElement.prototype) {
            this.input.showPicker()
        }
    }

    /** Increments the value of a numeric input type by the value of the step attribute. */
    stepUp() {
        this.input.stepUp()
        if (this.value !== this.input.value) {
            this.value = this.input.value
        }
    }

    /** Decrements the value of a numeric input type by the value of the step attribute. */
    stepDown() {
        this.input.stepDown()
        if (this.value !== this.input.value) {
            this.value = this.input.value
        }
    }

    render() {
        const hasPrefix = this.querySelector('[slot="prefix"]') !== null
        const hasSuffixSlot = this.querySelector('[slot="suffix"]') !== null
        const hasHelpTextSlot = this.hasSlotController.test('help-text')
        const hasHelpText = this.helpText ? true : !!hasHelpTextSlot
        const hasErrorSlot = this.hasSlotController.test('error')
        const isInvalid = this.hasAttribute('data-user-invalid')
        // Only show error if field is invalid AND we have an error message
        const hasError =
            isInvalid &&
            (this.errorText || hasErrorSlot || this.validationErrorMessage)
        // Use errorText if provided, otherwise use validation message, but only if invalid
        const errorMessage = isInvalid
            ? this.errorText || this.validationErrorMessage || ''
            : ''

        // Clear button logic
        const hasClearIcon = this.clearable && !this.disabled && !this.readonly
        const isClearIconVisible =
            hasClearIcon && (typeof this.value === 'number' || this.value.length > 0)

        // Reset button logic (for resettable prop - legacy support)
        const showResetIcon =
            this.resettable &&
            !this.clearable &&
            this.value !== '' &&
            this.value !== this.defaultValue &&
            this.type !== 'search' // search inputs have browser x

        // Suffix logic: clearable/resettable/password toggle take precedence
        const hasSuffix =
            hasClearIcon ||
            showResetIcon ||
            (this.passwordToggle && this.type === 'password') ||
            hasSuffixSlot

        return html`
            <div
                part="form-control"
                class=${classMap({
            'form-control': true,
            'form-control--small': this.size === 'small',
            'form-control--medium': this.size === 'medium',
            'form-control--large': this.size === 'large',
            'form-control--has-help-text': hasHelpText && !hasError,
            'form-control--has-error-text': hasError,
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

                <div part="form-control-input" class="form-control-input">
                    <div
                        part="base"
                        class=${classMap({
                    input: true,
                    // Sizes
                    'input--small': this.size === 'small',
                    'input--medium': this.size === 'medium',
                    'input--large': this.size === 'large',
                    // States
                    'input--pill': this.pill,
                    'input--standard': !this.filled,
                    'input--filled': this.filled,
                    'input--disabled': this.disabled,
                    'input--focused': this.hasFocus,
                    'input--empty': !this.value,
                    'input--no-spin-buttons': this.noSpinButtons,
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
                            type=${this.type === 'password' && this.passwordVisible
                ? 'text'
                : this.type}
                            title=${this
                .title /* An empty title prevents browser validation tooltips from appearing on hover */
            }
                            name=${ifDefined(this.name || undefined)}
                            ?disabled=${this.disabled}
                            ?readonly=${this.readonly}
                            ?required=${this.required}
                            placeholder=${ifDefined(this.placeholder || undefined)}
                            minlength=${ifDefined(this.minlength)}
                            maxlength=${ifDefined(this.maxlength)}
                            min=${ifDefined(this.min)}
                            max=${ifDefined(this.max)}
                            step=${ifDefined(this.step as number)}
                            .value=${live(this.value)}
                            autocapitalize=${ifDefined(
                this.getAttribute('autocapitalize') as
                | 'off'
                | 'none'
                | 'on'
                | 'sentences'
                | 'words'
                | 'characters'
                | undefined
            )}
                            autocomplete=${ifDefined(this.autocomplete)}
                            autocorrect=${ifDefined(
                this.getAttribute('autocorrect') as
                | 'off'
                | 'on'
                | undefined
            )}
                            ?autofocus=${this.autofocus}
                            spellcheck=${this.spellcheck}
                            pattern=${ifDefined(this.pattern)}
                            enterkeyhint=${ifDefined(this.enterkeyhint)}
                            inputmode=${ifDefined(this.inputMode)}
                            aria-describedby=${hasError
                ? 'error-text'
                : hasHelpText
                    ? 'help-text'
                    : undefined}
                            aria-invalid=${hasError ? 'true' : undefined}
                            @input=${this.handleInput}
                            @change=${this.handleChange}
                            @invalid=${this.handleInvalid}
                            @focus=${this.handleFocus}
                            @blur=${this.handleBlur}
                            @keydown=${this.handleKeyDown}
                        />

                        ${isClearIconVisible
                ? html`
                                  <button
                                      part="clear-button"
                                      class="input__clear"
                                      type="button"
                                      aria-label="Clear input"
                                      @click=${this.handleClearClick}
                                      tabindex="-1"
                                  >
                                      <slot name="clear-icon">
                                          <terra-icon
                                              name="solid-x-circle"
                                              library="heroicons"
                                              font-size="1.2rem"
                                          ></terra-icon>
                                      </slot>
                                  </button>
                              `
                : ''}
                        ${this.passwordToggle &&
                this.type === 'password' &&
                !this.disabled
                ? html`
                                  <button
                                      part="password-toggle-button"
                                      class="input__password-toggle"
                                      type="button"
                                      aria-label=${this.passwordVisible
                        ? 'Hide password'
                        : 'Show password'}
                                      @click=${this.handlePasswordToggle}
                                      tabindex="-1"
                                  >
                                      ${this.passwordVisible
                        ? html`
                                                <slot name="show-password-icon">
                                                    <terra-icon
                                                        name="solid-eye-slash"
                                                        library="heroicons"
                                                    ></terra-icon>
                                                </slot>
                                            `
                        : html`
                                                <slot name="hide-password-icon">
                                                    <terra-icon
                                                        name="solid-eye"
                                                        library="heroicons"
                                                    ></terra-icon>
                                                </slot>
                                            `}
                                  </button>
                              `
                : ''}
                        ${showResetIcon
                ? html`
                                  <button
                                      type="button"
                                      class="input__reset"
                                      @click=${this.handleReset}
                                      ?disabled=${this.disabled || this.readonly}
                                      aria-label="Clear input"
                                      tabindex="-1"
                                  >
                                      <terra-icon
                                          name="solid-x-circle"
                                          library="heroicons"
                                          font-size="1.2rem"
                                      ></terra-icon>
                                  </button>
                              `
                : ''}
                        ${hasSuffixSlot &&
                !isClearIconVisible &&
                !showResetIcon &&
                !(this.passwordToggle && this.type === 'password')
                ? html`
                                  <span part="suffix" class="input__suffix">
                                      <slot name="suffix"></slot>
                                  </span>
                              `
                : ''}
                    </div>
                </div>

                ${hasError
                ? html`
                          <div
                              aria-live="polite"
                              aria-hidden="false"
                              class="form-control__error-text"
                              id="error-text"
                              part="form-control-error-text"
                          >
                              <slot name="error">${errorMessage}</slot>
                          </div>
                      `
                : hasHelpText
                    ? html`
                            <div
                                aria-hidden="false"
                                class="form-control__help-text"
                                id="help-text"
                                part="form-control-help-text"
                            >
                                <slot name="help-text">${this.helpText}</slot>
                            </div>
                        `
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
