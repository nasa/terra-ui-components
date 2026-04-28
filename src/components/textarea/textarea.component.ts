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
import styles from './textarea.styles.js'
import type { CSSResultGroup } from 'lit'

/**
 * @summary A textarea component with consistent styling across the design system.
 * @documentation https://terra-ui.netlify.app/components/textarea
 * @status stable
 * @since 1.0
 *
 * @slot help-text - Text that describes how to use the textarea. Alternatively, you can use the `help-text` attribute.
 *
 * @event terra-input - Emitted when the textarea receives input.
 * @event terra-change - Emitted when an alteration to the control's value is committed by the user.
 * @event terra-focus - Emitted when the textarea gains focus.
 * @event terra-blur - Emitted when the textarea loses focus.
 * @event terra-invalid - Emitted when the form control has been checked for validity and its constraints aren't satisfied.
 *
 * @csspart base - The component's base wrapper.
 * @csspart textarea - The internal textarea control.
 * @csspart form-control-help-text - The help text's wrapper.
 */
export default class TerraTextarea extends TerraElement implements TerraFormControl {
    static styles: CSSResultGroup = [componentStyles, formControlStyles, styles]

    private readonly formControlController = new FormControlController(this, {
        value: (control: TerraTextarea) => control.value,
        defaultValue: (control: TerraTextarea) => control.defaultValue,
        setValue: (control: TerraTextarea, value: string) => (control.value = value),
    })
    private readonly hasSlotController = new HasSlotController(this, 'help-text')

    @query('.textarea__control') textarea: HTMLTextAreaElement

    @state() hasFocus = false

    @property() name = ''
    @property() value = ''
    @property() placeholder = ''
    @property({ type: Boolean, reflect: true }) disabled = false
    @property({ type: Boolean, reflect: true }) readonly = false
    @property({ type: Boolean, reflect: true }) required = false
    @property() autocomplete?: string
    @property({ type: Number }) minlength?: number
    @property({ type: Number }) maxlength?: number
    @property({ type: Number }) rows?: number
    @property({ type: Number }) cols?: number
    @property() label = ''
    @property({ attribute: 'hide-label', type: Boolean }) hideLabel = false
    @property({ attribute: 'help-text' }) helpText = ''
    @property({ reflect: true }) resize: 'none' | 'both' | 'horizontal' | 'vertical' =
        'vertical'

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
        return this.textarea.validity
    }

    /** Gets the validation message */
    get validationMessage() {
        return this.textarea.validationMessage
    }

    firstUpdated() {
        this.formControlController.updateValidity()
    }

    handleInput() {
        this.value = this.textarea.value
        this.formControlController.updateValidity()
        this.emit('terra-input')
    }

    handleChange() {
        this.value = this.textarea.value
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
        return this.textarea.checkValidity()
    }

    /** Gets the associated form, if one exists. */
    getForm(): HTMLFormElement | null {
        return this.formControlController.getForm()
    }

    /** Checks for validity and shows the browser's validation message if the control is invalid. */
    reportValidity() {
        return this.textarea.reportValidity()
    }

    /**
     * Sets a custom validation message. The value provided will be shown to the user when the form is submitted. To clear
     * the custom validation message, call this method with an empty string.
     */
    setCustomValidity(message: string) {
        this.textarea.setCustomValidity(message)
        this.formControlController.updateValidity()
    }

    focus(options?: FocusOptions) {
        this.textarea.focus(options)
    }

    blur() {
        this.textarea.blur()
    }

    select() {
        this.textarea.select()
    }

    setSelectionRange(
        selectionStart: number,
        selectionEnd: number,
        selectionDirection: 'forward' | 'backward' | 'none' = 'none'
    ) {
        this.textarea.setSelectionRange(
            selectionStart,
            selectionEnd,
            selectionDirection
        )
    }

    render() {
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
                              for="textarea"
                              part="form-control-label"
                              class=${this.hideLabel
                                  ? 'textarea__label textarea__label--hidden'
                                  : 'textarea__label'}
                          >
                              ${this.label}
                              ${this.required
                                  ? html`<span class="textarea__required-indicator"
                                        >*</span
                                    >`
                                  : ''}
                          </label>
                      `
                    : ''}

                <div
                    part="base"
                    class=${classMap({
                        textarea: true,
                        'textarea--disabled': this.disabled,
                        'textarea--focused': this.hasFocus,
                        'textarea--resize-none': this.resize === 'none',
                        'textarea--resize-both': this.resize === 'both',
                        'textarea--resize-horizontal': this.resize === 'horizontal',
                        'textarea--resize-vertical': this.resize === 'vertical',
                    })}
                >
                    <textarea
                        part="textarea"
                        id="textarea"
                        class="textarea__control"
                        name=${ifDefined(this.name || undefined)}
                        ?disabled=${this.disabled}
                        ?readonly=${this.readonly}
                        ?required=${this.required}
                        placeholder=${ifDefined(this.placeholder || undefined)}
                        minlength=${ifDefined(this.minlength)}
                        maxlength=${ifDefined(this.maxlength)}
                        rows=${ifDefined(this.rows)}
                        cols=${ifDefined(this.cols)}
                        .value=${live(this.value)}
                        autocomplete=${ifDefined(this.autocomplete)}
                        aria-describedby="help-text"
                        @input=${this.handleInput}
                        @change=${this.handleChange}
                        @invalid=${this.handleInvalid}
                        @focus=${this.handleFocus}
                        @blur=${this.handleBlur}
                    ></textarea>
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
        'terra-textarea': TerraTextarea
    }
}
