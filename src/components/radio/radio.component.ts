import { classMap } from 'lit/directives/class-map.js'
import { defaultValue } from '../../internal/default-value.js'
import { FormControlController } from '../../internal/form.js'
import { html } from 'lit'
import { ifDefined } from 'lit/directives/if-defined.js'
import { live } from 'lit/directives/live.js'
import { property, query, state } from 'lit/decorators.js'
import { watch } from '../../internal/watch.js'
import componentStyles from '../../styles/component.styles.js'
import formControlStyles from '../../styles/form-control.styles.js'
import styles from './radio.styles.js'
import type { CSSResultGroup } from 'lit'
import TerraElement, { type TerraFormControl } from '../../internal/terra-element.js'

/**
 * @summary Radio buttons are a form field used when only a single selection can be made from a list.
 * @documentation https://terra-ui.netlify.app/components/radio
 * @status stable
 * @since 1.0
 *
 * @slot - The radio's label.
 *
 * @event terra-blur - Emitted when the radio loses focus.
 * @event terra-change - Emitted when the checked state changes.
 * @event terra-focus - Emitted when the radio gains focus.
 * @event terra-input - Emitted when the radio receives input.
 * @event terra-invalid - Emitted when the form control has been checked for validity and its constraints aren't satisfied.
 *
 * @csspart base - The component's base wrapper.
 * @csspart control - The circular container that wraps the radio's checked state.
 * @csspart control--checked - The radio control when the radio is checked.
 * @csspart checked-icon - The checked icon, an SVG element.
 * @csspart label - The container that wraps the radio's label.
 *
 * @cssproperty --terra-radio-* - All radio design tokens from horizon.css are supported.
 */
export default class TerraRadio extends TerraElement implements TerraFormControl {
    static styles: CSSResultGroup = [componentStyles, formControlStyles, styles]

    private readonly formControlController = new FormControlController(this, {
        value: (control: TerraRadio) =>
            control.checked ? control.value || 'on' : undefined,
        defaultValue: (control: TerraRadio) => control.defaultChecked,
        setValue: (control: TerraRadio, checked: boolean) =>
            (control.checked = checked),
    })

    @query('input[type="radio"]') input: HTMLInputElement

    @state() private hasFocus = false

    @property() title = '' // make reactive to pass through

    /** The name of the radio, submitted as a name/value pair with form data. */
    @property() name = ''

    /** The radio's value. When selected, the radio group will receive this value. */
    @property() value: string

    /**
     * The radio's size. When used inside a radio group, the size will be determined by the radio group's size so this
     * attribute can typically be omitted.
     */
    @property({ reflect: true }) size: 'small' | 'medium' | 'large' = 'medium'

    /** Disables the radio. */
    @property({ type: Boolean, reflect: true }) disabled = false

    /** Draws the radio in a checked state. */
    @property({ type: Boolean, reflect: true }) checked = false

    /** The default value of the form control. Primarily used for resetting the form control. */
    @defaultValue('checked') defaultChecked = false

    /**
     * By default, form controls are associated with the nearest containing `<form>` element. This attribute allows you
     * to place the form control outside of a form and associate it with the form that has this `id`. The form must be in
     * the same document or shadow root for this to work.
     */
    @property({ reflect: true }) form = ''

    /** Makes the radio a required field. */
    @property({ type: Boolean, reflect: true }) required = false

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

    private handleBlur() {
        this.hasFocus = false
        this.emit('terra-blur')
    }

    private handleClick() {
        if (!this.disabled) {
            this.checked = true
            this.emit('terra-change')
        }
    }

    private handleFocus() {
        this.hasFocus = true
        this.emit('terra-focus')
    }

    private handleInput() {
        this.emit('terra-input')
    }

    private handleChange() {
        // Sync checked state from native input (for native form behavior)
        this.checked = this.input.checked
        this.emit('terra-change')
    }

    private handleInvalid(event: Event) {
        this.formControlController.setValidity(false)
        this.formControlController.emitInvalidEvent(event)
    }

    @watch('disabled', { waitUntilFirstUpdate: true })
    handleDisabledChange() {
        // Disabled form controls are always valid
        this.formControlController.setValidity(this.disabled)
    }

    @watch('checked', { waitUntilFirstUpdate: true })
    handleCheckedChange() {
        this.input.checked = this.checked // force a sync update
        this.formControlController.updateValidity()
    }

    /** Simulates a click on the radio. */
    click() {
        this.input.click()
    }

    /** Sets focus on the radio. */
    focus(options?: FocusOptions) {
        this.input.focus(options)
    }

    /** Removes focus from the radio. */
    blur() {
        this.input.blur()
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

    render() {
        return html`
            <label
                part="base"
                class=${classMap({
                    radio: true,
                    'radio--checked': this.checked,
                    'radio--disabled': this.disabled,
                    'radio--focused': this.hasFocus,
                    'radio--small': this.size === 'small',
                    'radio--medium': this.size === 'medium',
                    'radio--large': this.size === 'large',
                })}
            >
                <input
                    class="radio__input"
                    type="radio"
                    title=${
                        this
                            .title /* An empty title prevents browser validation tooltips from appearing on hover */
                    }
                    name=${this.name}
                    value=${ifDefined(this.value)}
                    .checked=${live(this.checked)}
                    .disabled=${this.disabled}
                    .required=${this.required}
                    aria-checked=${this.checked ? 'true' : 'false'}
                    @click=${this.handleClick}
                    @input=${this.handleInput}
                    @change=${this.handleChange}
                    @invalid=${this.handleInvalid}
                    @blur=${this.handleBlur}
                    @focus=${this.handleFocus}
                />

                <span
                    part="${`control${this.checked ? ' control--checked' : ''}`}"
                    class="radio__control"
                >
                    ${this.checked
                        ? html`
                              <svg
                                  part="checked-icon"
                                  class="radio__checked-icon"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                              >
                                  <circle cx="12" cy="12" r="6" fill="currentColor" />
                              </svg>
                          `
                        : ''}
                </span>

                <slot part="label" class="radio__label"></slot>
            </label>
        `
    }
}
