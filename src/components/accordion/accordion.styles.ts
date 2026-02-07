import { css } from 'lit'

export default css`
    :host {
        display: block;
    }

    .accordion {
        background: var(--terra-accordion-background-color);
        margin-bottom: var(--terra-spacing-medium);
        border: var(--terra-accordion-border-width) solid
            var(--terra-accordion-border-color);
        border-radius: var(--terra-accordion-border-radius);
        overflow: hidden;
    }

    .accordion-summary {
        background: var(--terra-accordion-summary-background-color);
        padding: var(--terra-accordion-summary-padding);
        border-bottom: var(--terra-accordion-border-width) solid
            var(--terra-accordion-summary-border-color);
        font-size: var(--terra-accordion-summary-font-size);
        font-weight: var(--terra-accordion-summary-font-weight);
        color: var(--terra-accordion-summary-color);
        cursor: pointer;
        outline: none;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: var(--terra-spacing-medium);
        transition: var(--terra-accordion-transition);
    }

    .accordion-summary:hover {
        background: var(--terra-accordion-summary-background-color-hover);
    }

    .accordion-summary-right {
        display: flex;
        align-items: flex-end;
        gap: var(--terra-spacing-small);
    }

    .accordion-summary terra-icon {
        transition: transform var(--terra-transition-fast) ease;
    }

    :host([open]) .accordion-summary terra-icon {
        transform: rotate(180deg);
    }

    .accordion-content {
        padding: var(--terra-accordion-content-padding);
    }

    /* Remove margin from last accordion when stacked */
    :host:last-child .accordion {
        margin-bottom: 0;
    }
`
