import { css } from 'lit'

export default css`
    :host {
        display: flex;
        flex: 1;
        flex-direction: column;
    }

    .stepper-step {
        display: flex;
        flex-direction: column;
        flex: 1;
    }

    .stepper-step--default {
        position: relative;
    }

    .stepper-step--condensed {
        flex-direction: row;
    }

    .stepper-step__bar {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 4px;
        background-color: var(--terra-color-carbon-20);
        transition: background-color var(--terra-transition-medium);
    }

    .stepper-step--default .stepper-step__bar {
        height: 4px;
        margin-bottom: var(--terra-spacing-small);
    }

    .stepper-step--condensed .stepper-step__bar {
        flex: 1;
        height: 4px;
    }

    /* Completed state */
    .stepper-step--completed .stepper-step__bar {
        background-color: var(--terra-color-nasa-blue-tint);
    }

    /* Current state */
    .stepper-step--current .stepper-step__bar {
        background-color: var(--terra-color-nasa-blue);
    }

    /* Upcoming state */
    .stepper-step--upcoming .stepper-step__bar {
        background-color: var(--terra-color-carbon-20);
    }

    .stepper-step__icon {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 1.25rem;
        height: 1.25rem;
        color: var(--terra-color-spacesuit-white);
        background-color: var(--terra-color-success-green);
        border-radius: 50%;
        padding: 0.25rem;
        margin-right: var(--terra-spacing-x-small);
        flex-shrink: 0;
    }

    .stepper-step__content {
        display: flex;
        flex-direction: column;
    }

    .stepper-step__title {
        display: flex;
        align-items: center;
        font-family: var(--terra-font-family--inter);
        font-size: var(--terra-font-size-small);
        font-weight: var(--terra-font-weight-semibold);
        line-height: var(--terra-line-height-normal);
        color: var(--terra-color-carbon-90);
        transition: color var(--terra-transition-medium);
    }

    .stepper-step--completed .stepper-step__title {
        color: var(--terra-color-carbon-60);
    }

    .stepper-step--current .stepper-step__title {
        color: var(--terra-color-nasa-blue);
    }

    .stepper-step--upcoming .stepper-step__title {
        color: var(--terra-color-carbon-60);
    }

    .stepper-step__caption {
        font-family: var(--terra-font-family--public-sans);
        font-size: var(--terra-font-size-x-small);
        font-weight: var(--terra-font-weight-normal);
        line-height: var(--terra-line-height-normal);
        color: var(--terra-color-carbon-60);
        margin-top: var(--terra-spacing-x-small);
    }

    .stepper-step__caption:empty {
        display: none;
    }
`
