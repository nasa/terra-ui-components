import { css } from 'lit'

export default css`
    :host {
        display: block;
        width: 100%;
    }

    .stepper slot {
        display: flex;
        width: 100%;
        flex-direction: row;
        gap: var(--terra-spacing-small);
    }

    .stepper-step__title {
        display: flex;
        align-items: center;
        font-family: var(--terra-font-family--inter);
        font-size: var(--terra-font-size-small);
        font-weight: var(--terra-font-weight-semibold);
        line-height: var(--terra-line-height-normal);
        color: var(--terra-text-primary);
        transition: color var(--terra-transition-medium);
    }

    .stepper-step__caption {
        font-family: var(--terra-font-family--public-sans);
        font-size: var(--terra-font-size-x-small);
        font-weight: var(--terra-font-weight-normal);
        line-height: var(--terra-line-height-normal);
        color: var(--terra-text-secondary);
        margin-top: var(--terra-spacing-x-small);
    }

    .step-progress {
        margin-top: 0.5rem; 
        font-size: 0.875rem; 
        color: var(--terra-color-carbon-60);
    }
`
