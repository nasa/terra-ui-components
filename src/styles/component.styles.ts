import { css } from 'lit'

export default css`
    :host {
        box-sizing: border-box;
        display: none;
    }

    :host *,
    :host *::before,
    :host *::after {
        box-sizing: inherit;
    }

    :host {
        background-color: var(--background-color);
        color: var(--color);
    }

    [hidden] {
        display: none !important;
    }

    /* Horizon Design System Font Classes */

    /* Display Fonts */

    .display-120 {
        font-family: var(--terra-font-family--inter);
        font-size: 7.5rem; /* 120px */
        font-weight: var(--terra-font-weight-bold);
    }

    .display-100 {
        font-family: var(--terra-font-family--inter);
        font-size: 6.25rem; /* 100px */
        font-weight: var(--terra-font-weight-bold);
    }

    .display-80 {
        font-family: var(--terra-font-family--inter);
        font-size: 5rem; /* 80px */
        font-weight: var(--terra-font-weight-bold);
    }

    .display-72 {
        font-family: var(--terra-font-family--inter);
        font-size: 4.5rem; /* 72px */
        font-weight: var(--terra-font-weight-bold);
    }

    .display-60 {
        font-family: var(--terra-font-family--inter);
        font-size: 3.75rem; /* 60px */
        font-weight: var(--terra-font-weight-bold);
    }

    .display-48 {
        font-family: var(--terra-font-family--inter);
        font-size: 3rem; /* 48px */
        font-weight: var(--terra-font-weight-bold);
    }

    .display-41 {
        font-family: var(--terra-font-family--inter);
        font-size: 2.563rem; /* 41px */
        font-weight: var(--terra-font-weight-bold);
    }

    /* Heading Fonts */

    .heading-36-bold {
        font-family: var(--terra-font-family--inter);
        font-size: 2.25rem; /* 36px */
        font-weight: var(--terra-font-weight-bold);
    }

    .heading-36-light {
        font-family: var(--terra-font-family--inter);
        font-size: 2.25rem; /* 36px */
        font-weight: var(--terra-font-weight-light);
    }

    .heading-29-bold {
        font-family: var(--terra-font-family--inter);
        font-size: 1.813rem; /* 29px */
        font-weight: var(--terra-font-weight-bold);
    }

    .heading-29-light {
        font-family: var(--terra-font-family--inter);
        font-size: 1.813rem; /* 29px */
        font-weight: var(--terra-font-weight-light);
    }

    .heading-22-bold {
        font-family: var(--terra-font-family--inter);
        font-size: 1.375rem; /* 22px */
        font-weight: var(--terra-font-weight-bold);
    }

    .heading-22-light {
        font-family: var(--terra-font-family--inter);
        font-size: 1.375rem; /*22px */
        font-weight: var(--terra-font-weight-light);
    }

    .heading-18-bold {
        font-family: var(--terra-font-family--inter);
        font-size: 1.125rem; /* 18px */
        font-weight: var(--terra-font-weight-bold);
    }

    .heading-18-light {
        font-family: var(--terra-font-family--inter);
        font-size: 1.125rem; /* 18px */
        font-weight: var(--terra-font-weight-light);
    }

    .heading-16-bold {
        font-family: var(--terra-font-family--inter);
        font-size: 1rem; /* 16px */
        font-weight: var(--terra-font-weight-bold);
    }

    .heading-16-light {
        font-family: var(--terra-font-family--inter);
        font-size: 1rem; /* 16px */
        font-weight: var(--terra-font-weight-light);
    }

    .heading-14-bold {
        font-family: var(--terra-font-family--inter);
        font-size: 0.875rem; /* 14px */
        font-weight: var(--terra-font-weight-bold);
    }

    .heading-14-light {
        font-family: var(--terra-font-family--inter);
        font-size: 0.875rem; /* 14px */
        font-weight: var(--terra-font-weight-light);
    }

    .heading-12-bold {
        font-family: var(--terra-font-family--inter);
        font-size: 0.75rem; /* 12px */
        font-weight: var(--terra-font-weight-bold);
    }

    .heading-12-light {
        font-family: var(--terra-font-family--inter);
        font-size: 0.75rem; /* 12px */
        font-weight: var(--terra-font-weight-light);
    }

    .heading-11-semi-bold {
        font-family: var(--terra-font-family--inter);
        font-size: 0.688rem; /* 11px */
        font-weight: var(--terra-font-weight-semi-bold);
    }

    /* Body Fonts */

    .body-18 {
        font-family: var(--terra-font-family--public-sans);
        font-size: 1.125rem; /* 18px */
        font-weight: var(--terra-font-weight-normal);
    }

    .body-16 {
        font-family: var(--terra-font-family--public-sans);
        font-size: 1rem; /* 16px */
        font-weight: var(--terra-font-weight-normal);
    }

    .body-14 {
        font-family: var(--terra-font-family--public-sans);
        font-size: 0.875rem; /* 14px */
        font-weight: var(--terra-font-weight-normal);
    }

    .body-12 {
        font-family: var(--terra-font-family--public-sans);
        font-size: 0.75rem; /* 12px */
        font-weight: var(--terra-font-weight-normal);
    }

    .body-11 {
        font-family: var(--terra-font-family--public-sans);
        font-size: 0.688rem; /* 11px */
        font-weight: var(--terra-font-weight-normal);
    }

    /* Number & Label Fonts */

    .number-240 {
        font-family: var(--terra-font-family--dm-mono);
        font-size: 15rem; /* 240px */
        font-weight: var(--terra-font-weight-light);
    }

    .number-120 {
        font-family: var(--terra-font-family--dm-mono);
        font-size: 7.5rem; /* 120px */
        font-weight: var(--terra-font-weight-light);
    }

    .number-48 {
        font-family: var(--terra-font-family--dm-mono);
        font-size: 3rem; /* 48px */
        font-weight: var(--terra-font-weight-light);
    }

    .number-36 {
        font-family: var(--terra-font-family--dm-mono);
        font-size: 2.25rem; /* 36px */
        font-weight: var(--terra-font-weight-light);
    }

    .number-14 {
        font-family: var(--terra-font-family--dm-mono);
        font-size: 0.875rem; /* 14px */
        font-weight: 500;
    }

    .number-11 {
        font-family: var(--terra-font-family--dm-mono);
        font-size: 0.688rem; /* 11px */
        font-weight: 500;
    }

    .label-14 {
        font-family: var(--terra-font-family--dm-mono);
        font-size: 0.875rem; /* 14px */
        font-weight: var(--terra-font-weight-light);
        text-transform: uppercase;
    }

    .label-12 {
        font-family: var(--terra-font-family--dm-mono);
        font-size: 0.75rem; /* 12px */
        font-weight: var(--terra-font-weight-light);
        text-transform: uppercase;
    }

    .label-11 {
        font-family: var(--terra-font-family--dm-mono);
        font-size: 0.688rem; /* 11px */
        font-weight: var(--terra-font-weight-light);
        text-transform: uppercase;
    }

    /* Forms */

    /* Input Field */

    input[type='text'],
    input[type='password'],
    select,
    .input {
        font-family: var(--terra-input-font-family);
        font-size: var(--terra-input-font-size);
        color: var(--terra-input-color);
        font-weight: var(--terra-input-font-weight);
        line-height: var(--terra-input-line-height);
        background-color: var(--terra-input-background-color);
        border: var(--terra-input-border-width) solid var(--terra-input-border-color);
        border-radius: var(--terra-input-border-radius);
    }

    label,
    .input-label {
        font-family: var(--terra-input-label-font-family);
        font-size: var(--terra-input-label-font-size);
        color: var(--terra-input-label-color);
        font-weight: var(--terra-font-weight-semibold);
        line-height: var(--terra-input-label-line-height);
    }

    /* Elements */

    a {
        text-decoration: underline;
        text-decoration-color: #585858;
        text-decoration-style: dashed;
        text-decoration-thickness: 0.05em;
        text-underline-offset: 0.25rem;
        color: var(--terra-color-carbon-60);
    }

    /* UTILITY CSS */
    .sr-only {
        block-size: 1px;
        border-width: 0;
        clip: rect(0, 0, 0, 0);
        margin: -1px;
        overflow: hidden;
        padding: 0;
        position: absolute;
        white-space: nowrap;
        width: 1px;
    }
`
