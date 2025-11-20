import { css } from 'lit'

export default css`
    :host {
        display: inline-block;
    }

    .checkbox {
        position: relative;
        display: inline-flex;
        align-items: flex-start;
        font-family: var(--terra-checkbox-label-font-family);
        font-weight: var(--terra-checkbox-label-font-weight);
        color: var(--terra-checkbox-label-color);
        vertical-align: middle;
        cursor: pointer;
    }

    .checkbox--small {
        --checkbox-size: var(--terra-checkbox-size-small);
        font-size: var(--terra-checkbox-label-font-size);
    }

    .checkbox--medium {
        --checkbox-size: var(--terra-checkbox-size-medium);
        font-size: var(--terra-checkbox-label-font-size);
    }

    .checkbox--large {
        --checkbox-size: var(--terra-checkbox-size-large);
        font-size: var(--terra-checkbox-label-font-size);
    }

    .checkbox__control {
        flex: 0 0 auto;
        position: relative;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: var(--checkbox-size);
        height: var(--checkbox-size);
        border: solid var(--terra-checkbox-border-width)
            var(--terra-checkbox-border-color);
        border-radius: var(--terra-checkbox-border-radius);
        background-color: var(--terra-checkbox-background-color);
        color: var(--terra-checkbox-icon-color);
        transition:
            var(--terra-transition-fast) border-color,
            var(--terra-transition-fast) background-color,
            var(--terra-transition-fast) color,
            var(--terra-transition-fast) box-shadow;
    }

    .checkbox__input {
        position: absolute;
        opacity: 0;
        padding: 0;
        margin: 0;
        pointer-events: none;
    }

    .checkbox__checked-icon,
    .checkbox__indeterminate-icon {
        display: inline-flex;
        width: var(--checkbox-size);
        height: var(--checkbox-size);
    }

    /* Hover - unchecked */
    .checkbox:not(.checkbox--checked):not(.checkbox--disabled):not(
            .checkbox--indeterminate
        )
        .checkbox__control:hover {
        border-color: var(--terra-checkbox-border-color-hover);
        background-color: var(--terra-checkbox-background-color-hover);
    }

    /* Focus - unchecked */
    .checkbox:not(.checkbox--checked):not(.checkbox--disabled):not(
            .checkbox--indeterminate
        )
        .checkbox__input:focus-visible
        ~ .checkbox__control {
        outline: var(--terra-focus-ring-style) var(--terra-checkbox-focus-ring-width)
            var(--terra-checkbox-focus-ring-color);
        outline-offset: var(--terra-checkbox-focus-ring-offset);
    }

    /* Checked/indeterminate */
    .checkbox--checked .checkbox__control,
    .checkbox--indeterminate .checkbox__control {
        border-color: var(--terra-checkbox-border-color-checked);
        background-color: var(--terra-checkbox-background-color-checked);
    }

    /* Checked/indeterminate + hover */
    .checkbox.checkbox--checked:not(.checkbox--disabled) .checkbox__control:hover,
    .checkbox.checkbox--indeterminate:not(.checkbox--disabled)
        .checkbox__control:hover {
        border-color: var(--terra-checkbox-border-color-checked-hover);
        background-color: var(--terra-checkbox-background-color-checked-hover);
    }

    /* Checked/indeterminate + focus */
    .checkbox.checkbox--checked:not(.checkbox--disabled)
        .checkbox__input:focus-visible
        ~ .checkbox__control,
    .checkbox.checkbox--indeterminate:not(.checkbox--disabled)
        .checkbox__input:focus-visible
        ~ .checkbox__control {
        outline: var(--terra-focus-ring-style) var(--terra-checkbox-focus-ring-width)
            var(--terra-checkbox-focus-ring-color);
        outline-offset: var(--terra-checkbox-focus-ring-offset);
    }

    /* Disabled */
    .checkbox--disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    .checkbox--disabled .checkbox__control {
        background-color: var(--terra-checkbox-background-color-disabled);
        border-color: var(--terra-checkbox-border-color-disabled);
    }

    .checkbox__label {
        display: inline-block;
        color: var(--terra-checkbox-label-color);
        line-height: var(--checkbox-size);
        margin-inline-start: 0.5em;
        user-select: none;
        -webkit-user-select: none;
    }

    :host([required]) .checkbox__label::after {
        content: var(--terra-input-required-content);
        color: var(--terra-input-required-content-color);
        margin-inline-start: var(--terra-input-required-content-offset);
    }
`
