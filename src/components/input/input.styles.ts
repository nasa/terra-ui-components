import { css } from 'lit'

export default css`
    :host {
        display: block;
    }

    .input-wrapper {
        width: 100%;
    }

    .input__label {
        display: block;
        margin: 0 0 var(--terra-spacing-x-small, 0.5rem) 0;
        font-family: var(--terra-input-label-font-family);
        font-size: var(--terra-input-label-font-size);
        font-weight: var(--terra-input-label-line-weight);
        line-height: var(--terra-input-label-line-height);
        color: var(--terra-input-label-color);
    }

    .input__label--hidden {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border-width: 0;
    }

    .input__required-indicator {
        color: var(--terra-input-required-content-color);
        margin-left: var(--terra-input-required-content-offset);
    }

    .input {
        position: relative;
        display: var(--terra-input-display, flex);
        align-items: center;
        width: 100%;
        background: var(--terra-input-background-color);
        border-width: var(--terra-input-border-width);
        border-color: var(--terra-input-border-color);
        border-style: solid;
        border-radius: var(--terra-input-border-radius);
        transition:
            border-color var(--terra-transition-fast),
            box-shadow var(--terra-transition-fast);
    }

    .input:hover:not(.input--disabled) {
        border-color: var(--terra-input-border-color-hover);
    }

    .input--focused:not(.input--disabled) {
        outline: none;
        border-color: var(--terra-input-border-color-focus);
        box-shadow: 0 0 0 var(--terra-focus-ring-width, 3px)
            var(--terra-input-focus-ring-color);
    }

    .input--disabled {
        background-color: var(--terra-input-background-color-disabled);
        border-color: var(--terra-input-border-color-disabled);
        cursor: not-allowed;
    }

    .form-control-input {
        position: relative;
    }

    .input__control {
        flex: 1;
        width: 100%;
        padding: var(--terra-input-spacing-medium) var(--terra-input-spacing-medium);
        background: transparent;
        border: none;
        outline: none;
        box-shadow: none;
        font-family: var(--terra-input-font-family);
        font-size: var(--terra-input-font-size);
        font-weight: var(--terra-input-font-weight);
        line-height: var(--terra-input-line-height);
        letter-spacing: var(--terra-input-letter-spacing);
        color: var(--terra-input-color);
    }

    /* Size variants */
    .input--small .input__control {
        padding: var(--terra-input-spacing-x-small) var(--terra-input-spacing-small);
        font-size: var(--terra-font-size-small);
    }

    .input--large .input__control {
        padding: var(--terra-input-spacing-large) var(--terra-input-spacing-large);
        font-size: var(--terra-font-size-large);
    }

    /* Filled variant */
    .input--filled {
        background: var(--terra-color-carbon-5);
    }

    .input--filled:hover:not(.input--disabled) {
        background: var(--terra-color-carbon-10);
    }

    .input--filled.input--focused:not(.input--disabled) {
        background: var(--terra-color-carbon-5);
    }

    /* Pill variant */
    .input--pill {
        border-radius: 9999px;
    }

    /* No spin buttons */
    .input--no-spin-buttons .input__control[type='number']::-webkit-outer-spin-button,
    .input--no-spin-buttons
        .input__control[type='number']::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }

    .input--no-spin-buttons .input__control[type='number'] {
        -moz-appearance: textfield;
    }

    .input__control::placeholder {
        color: var(--terra-input-placeholder-color);
    }

    .input__control:disabled {
        color: var(--terra-input-color-disabled);
        cursor: not-allowed;
    }

    .input__control:disabled::placeholder {
        color: var(--terra-input-placeholder-color-disabled);
    }

    .input__control:hover:not(:disabled) {
        color: var(--terra-input-color-hover);
    }

    .input__control:focus:not(:disabled) {
        color: var(--terra-input-color-focus);
    }

    .input__control:read-only {
        cursor: default;
    }

    /* Hide browser spinners for number inputs */
    .input__control::-webkit-outer-spin-button,
    .input__control::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }

    .input__control[type='number'] {
        -moz-appearance: textfield;
    }

    /* Prefix and Suffix */
    .input__prefix,
    .input__suffix {
        align-items: center;
        color: var(--terra-input-icon-color);
        flex-shrink: 0;
    }

    .input__prefix {
        display: var(--terra-input-prefix-display, flex);
        padding-left: var(--terra-input-spacing-medium);
        gap: var(--terra-spacing-x-small);
    }

    .input__suffix {
        display: var(--terra-input-suffix-display, flex);
        padding-right: var(--terra-input-spacing-medium);
        gap: var(--terra-spacing-x-small);
    }

    .input--has-prefix .input__control {
        padding-left: var(--terra-input-spacing-small);
    }

    .input--has-suffix .input__control {
        padding-right: var(--terra-input-spacing-small);
    }

    .input:hover:not(.input--disabled) .input__prefix,
    .input:hover:not(.input--disabled) .input__suffix {
        color: var(--terra-input-icon-color-hover);
    }

    .input--focused:not(.input--disabled) .input__prefix,
    .input--focused:not(.input--disabled) .input__suffix {
        color: var(--terra-input-icon-color-focus);
    }

    .input__clear,
    .input__reset {
        display: flex;
        align-items: center;
        justify-content: center;
        background: transparent;
        border: none;
        padding: 0;
        margin: 0;
        margin-right: var(--terra-input-spacing-medium);
        cursor: pointer;
        color: inherit;
        transition: color var(--terra-transition-fast);
    }

    .input__clear terra-icon,
    .input__reset terra-icon {
        --color: var(--terra-color-carbon-40);
    }

    .input__clear:hover,
    .input__reset:hover {
        color: var(--terra-input-icon-color-hover);
    }

    .input__clear:focus-visible,
    .input__reset:focus-visible {
        outline: 2px solid var(--terra-input-border-color-focus);
        outline-offset: 2px;
        border-radius: var(--terra-border-radius-small);
    }

    .input--disabled .input__clear,
    .input--disabled .input__reset {
        cursor: not-allowed;
        opacity: 0.5;
    }

    /* Password toggle button */
    .input__password-toggle {
        display: flex;
        align-items: center;
        justify-content: center;
        background: transparent;
        border: none;
        padding: 0;
        margin: 0;
        margin-right: var(--terra-input-spacing-medium);
        cursor: pointer;
        color: inherit;
        transition: color var(--terra-transition-fast);
    }

    .input__password-toggle terra-icon {
        --color: var(--terra-color-carbon-40);
    }

    .input__password-toggle:hover {
        color: var(--terra-input-icon-color-hover);
    }

    .input__password-toggle:focus-visible {
        outline: 2px solid var(--terra-input-border-color-focus);
        outline-offset: 2px;
        border-radius: var(--terra-border-radius-small);
    }

    .input--disabled .input__password-toggle {
        cursor: not-allowed;
        opacity: 0.5;
    }

    /* Error State - using data attributes from FormControlController */
    :host([data-user-invalid]) .input {
        border-color: var(--terra-color-nasa-red);
    }

    :host([data-user-invalid]) .input:hover:not(.input--disabled) {
        border-color: var(--terra-color-nasa-red-shade);
    }

    :host([data-user-invalid]) .input.input--focused:not(.input--disabled) {
        border-color: var(--terra-color-nasa-red);
        box-shadow: 0 0 0 var(--terra-focus-ring-width, 3px)
            var(--terra-color-nasa-red-tint);
    }

    /* Error Text */
    .form-control__error-text {
        display: none;
        color: var(--terra-color-nasa-red-shade);
        font-size: var(--terra-font-size-small);
        margin-top: var(--terra-spacing-3x-small);
    }

    .form-control--has-error-text .form-control__error-text {
        display: block;
    }

    /* Hide help text when error is shown */
    .form-control--has-error-text .form-control__help-text {
        display: none;
    }

    /* Error label color */
    :host([data-user-invalid]) .input__label {
        color: var(--terra-color-nasa-red-shade);
    }

    /* Form control size variants */
    .form-control--small .input__label {
        font-size: var(--terra-font-size-small);
    }

    .form-control--large .input__label {
        font-size: var(--terra-font-size-large);
    }
`
