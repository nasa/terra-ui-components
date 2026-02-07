import { css } from 'lit'

export default css`
    :host {
        display: block;
        user-select: none;
        -webkit-user-select: none;
    }

    :host(:focus) {
        outline: none;
    }

    .option {
        position: relative;
        display: flex;
        align-items: center;
        font-family: var(--terra-font-family--inter);
        font-size: var(--terra-font-size-medium);
        font-weight: var(--terra-font-weight-normal);
        line-height: var(--terra-line-height-normal);
        letter-spacing: var(--terra-letter-spacing-normal);
        color: var(--terra-color-carbon-70);
        padding: var(--terra-spacing-x-small) var(--terra-spacing-medium)
            var(--terra-spacing-x-small) var(--terra-spacing-x-small);
        transition: var(--terra-transition-fast) fill;
        cursor: pointer;
    }

    .option--hover:not(.option--current):not(.option--disabled) {
        background-color: var(--terra-color-carbon-10);
        color: var(--terra-color-carbon-90);
    }

    .option--current,
    .option--current.option--disabled {
        background-color: var(--terra-color-nasa-blue);
        color: var(--terra-color-spacesuit-white);
        opacity: 1;
    }

    .option--disabled {
        outline: none;
        opacity: 0.5;
        cursor: not-allowed;
    }

    .option__label {
        flex: 1 1 auto;
        display: inline-block;
        line-height: var(--terra-line-height-dense);
    }

    .option .option__check {
        flex: 0 0 auto;
        display: flex;
        align-items: center;
        justify-content: center;
        visibility: hidden;
        padding-inline-end: var(--terra-spacing-2x-small);
    }

    .option--selected .option__check {
        visibility: visible;
    }

    .option__prefix,
    .option__suffix {
        flex: 0 0 auto;
        display: flex;
        align-items: center;
    }

    .option__prefix::slotted(*) {
        margin-inline-end: var(--terra-spacing-x-small);
    }

    .option__suffix::slotted(*) {
        margin-inline-start: var(--terra-spacing-x-small);
    }

    @media (forced-colors: active) {
        :host(:hover:not([aria-disabled='true'])) .option {
            outline: dashed 1px SelectedItem;
            outline-offset: -1px;
        }
    }
`
