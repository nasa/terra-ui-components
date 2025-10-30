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
        margin-bottom: 0.5rem;
        font-size: 0.875rem;
        font-weight: 500;
        color: var(--terra-color-neutral-700, #374151);
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
        color: var(--terra-color-error-500, #ef4444);
        margin-left: 0.125rem;
    }

    .input {
        position: relative;
        display: flex;
        align-items: center;
        width: 100%;
        background: white;
        border: 1px solid var(--terra-color-neutral-300, #d1d5db);
        border-radius: 0.375rem;
        transition: all 0.15s ease;
    }

    .input:hover:not(.input--disabled) {
        border-color: var(--terra-color-neutral-400, #9ca3af);
    }

    .input--focused:not(.input--disabled) {
        outline: none;
        border-color: var(--terra-color-primary-500, #3b82f6);
        box-shadow: 0 0 0 3px var(--terra-color-primary-100, #dbeafe);
    }

    .input--disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    .input__control {
        flex: 1;
        width: 100%;
        padding: 0.625rem 1rem;
        background: transparent;
        border: none;
        border-right: none !important;
        font-size: 0.875rem;
        color: var(--terra-color-neutral-900, #111827);
        outline: none;
        box-shadow: none;
    }

    .input__control::placeholder {
        color: var(--terra-color-neutral-400, #9ca3af);
    }

    .input__control:disabled {
        cursor: not-allowed;
    }

    .input__control:read-only {
        cursor: pointer;
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
        display: flex;
        align-items: center;
        color: var(--terra-color-neutral-500, #6b7280);
        flex-shrink: 0;
    }

    .input__prefix {
        padding-left: 1rem;
        gap: 0.5rem;
    }

    .input__suffix {
        padding-right: 1rem;
        gap: 0.5rem;
    }

    .input--has-prefix .input__control {
        padding-left: 0.5rem;
    }

    .input--has-suffix .input__control {
        padding-right: 0.5rem;
    }

    /* Help Text */
    .input__help-text {
        margin-top: 0.375rem;
        font-size: 0.875rem;
        color: var(--terra-color-neutral-600, #4b5563);
    }

    /* Error State (can be enhanced with a prop later) */
    .input--error {
        border-color: var(--terra-color-error-500, #ef4444);
    }

    .input--error:hover:not(.input--disabled) {
        border-color: var(--terra-color-error-600, #dc2626);
    }

    .input--error.input--focused:not(.input--disabled) {
        border-color: var(--terra-color-error-500, #ef4444);
        box-shadow: 0 0 0 3px var(--terra-color-error-100, #fee2e2);
    }
`
