import { css } from 'lit'

export default css`
    :host {
        display: block;
    }

    :host(:focus-visible) {
        outline: 0px;
    }

    .radio {
        display: inline-flex;
        align-items: flex-start;
        font-family: var(--terra-radio-label-font-family);
        font-size: var(--terra-radio-label-font-size);
        font-weight: var(--terra-radio-label-font-weight);
        color: var(--terra-radio-label-color);
        vertical-align: middle;
        cursor: pointer;
    }

    .radio--small {
        --radio-size: var(--terra-radio-size-small);
        font-size: var(--terra-radio-label-font-size);
    }

    .radio--medium {
        --radio-size: var(--terra-radio-size-medium);
        font-size: var(--terra-radio-label-font-size);
    }

    .radio--large {
        --radio-size: var(--terra-radio-size-large);
        font-size: var(--terra-radio-label-font-size);
    }

    .radio__checked-icon {
        display: inline-flex;
        width: var(--radio-size);
        height: var(--radio-size);
        color: var(--terra-radio-icon-color);
    }

    .radio__control {
        flex: 0 0 auto;
        position: relative;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: var(--radio-size);
        height: var(--radio-size);
        border: solid var(--terra-radio-border-width) var(--terra-radio-border-color);
        border-radius: 50%;
        background-color: var(--terra-radio-background-color);
        color: transparent;
        transition:
            var(--terra-transition-fast) border-color,
            var(--terra-transition-fast) background-color,
            var(--terra-transition-fast) color,
            var(--terra-transition-fast) box-shadow;
    }

    .radio__input {
        position: absolute;
        opacity: 0;
        padding: 0;
        margin: 0;
        pointer-events: none;
        width: 0;
        height: 0;
    }

    /* Hover - unchecked */
    .radio:not(.radio--checked):not(.radio--disabled) .radio__control:hover {
        border-color: var(--terra-radio-border-color-hover);
        background-color: var(--terra-radio-background-color-hover);
    }

    /* Checked */
    .radio--checked .radio__control {
        border-color: var(--terra-radio-border-color-checked);
        background-color: var(--terra-radio-background-color-checked);
    }

    /* Checked + hover */
    .radio.radio--checked:not(.radio--disabled) .radio__control:hover {
        border-color: var(--terra-radio-border-color-checked-hover);
        background-color: var(--terra-radio-background-color-checked-hover);
    }

    /* Focus */
    .radio:not(.radio--disabled) .radio__input:focus-visible ~ .radio__control {
        outline: var(--terra-focus-ring-style) var(--terra-radio-focus-ring-width)
            var(--terra-radio-focus-ring-color);
        outline-offset: var(--terra-radio-focus-ring-offset);
    }

    /* Disabled */
    .radio--disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    .radio--disabled .radio__control {
        background-color: var(--terra-radio-background-color-disabled);
        border-color: var(--terra-radio-border-color-disabled);
    }

    /* When the control isn't checked, hide the circle for Windows High Contrast mode a11y */
    .radio:not(.radio--checked) svg circle {
        opacity: 0;
    }

    .radio__label {
        display: inline-block;
        color: var(--terra-radio-label-color);
        line-height: var(--radio-size);
        margin-inline-start: 0.5em;
        user-select: none;
        -webkit-user-select: none;
    }
`
