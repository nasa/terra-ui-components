import { css } from 'lit'

export default css`
    :host {
        display: block;
    }

    .textarea__label {
        display: block;
        margin: 0 0 var(--terra-spacing-x-small, 0.5rem) 0;
        font-family: var(--terra-input-label-font-family);
        font-size: var(--terra-input-label-font-size);
        font-weight: var(--terra-input-label-line-weight);
        line-height: var(--terra-input-label-line-height);
        color: var(--terra-input-label-color);
    }

    .textarea__label--hidden {
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

    .textarea__required-indicator {
        color: var(--terra-input-required-content-color);
        margin-left: var(--terra-input-required-content-offset);
    }

    .textarea {
        position: relative;
        display: flex;
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

    .textarea:hover:not(.textarea--disabled) {
        border-color: var(--terra-input-border-color-hover);
    }

    .textarea--focused:not(.textarea--disabled) {
        outline: none;
        border-color: var(--terra-input-border-color-focus);
        box-shadow: 0 0 0 var(--terra-focus-ring-width, 3px)
            var(--terra-input-focus-ring-color);
    }

    .textarea--disabled {
        background-color: var(--terra-input-background-color-disabled);
        border-color: var(--terra-input-border-color-disabled);
        cursor: not-allowed;
    }

    .textarea__control {
        flex: 1;
        width: 100%;
        min-height: 6rem; /* ~96px - reasonable default for textarea */
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
        resize: vertical;
    }

    .textarea--resize-none .textarea__control {
        resize: none;
    }

    .textarea--resize-both .textarea__control {
        resize: both;
    }

    .textarea--resize-horizontal .textarea__control {
        resize: horizontal;
    }

    .textarea--resize-vertical .textarea__control {
        resize: vertical;
    }

    .textarea__control::placeholder {
        color: var(--terra-input-placeholder-color);
    }

    .textarea__control:disabled {
        color: var(--terra-input-color-disabled);
        cursor: not-allowed;
    }

    .textarea__control:disabled::placeholder {
        color: var(--terra-input-placeholder-color-disabled);
    }

    .textarea__control:hover:not(:disabled) {
        color: var(--terra-input-color-hover);
    }

    .textarea__control:focus:not(:disabled) {
        color: var(--terra-input-color-focus);
    }

    .textarea__control:read-only {
        cursor: default;
    }

    /* Error State - using data attributes from FormControlController */
    :host([data-user-invalid]) .textarea {
        border-color: var(--terra-color-nasa-red);
    }

    :host([data-user-invalid]) .textarea:hover:not(.textarea--disabled) {
        border-color: var(--terra-color-nasa-red-shade);
    }

    :host([data-user-invalid]) .textarea.textarea--focused:not(.textarea--disabled) {
        border-color: var(--terra-color-nasa-red);
        box-shadow: 0 0 0 var(--terra-focus-ring-width, 3px)
            var(--terra-color-nasa-red-tint);
    }
`
