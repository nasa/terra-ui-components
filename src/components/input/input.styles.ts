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
`
