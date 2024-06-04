import { css } from 'lit'

export default css`
    :host {
        box-sizing: border-box;
    }

    :host *,
    :host *::before,
    :host *::after {
        box-sizing: inherit;
    }

    [hidden] {
        display: none !important;
    }

/* Horizon Design System Font Classes */

    /* Display Fonts */

    .display-120 {
        font-family: var(--edux-font-display);
        font-size: 7.5rem; /* 120px */
        font-weight: var(--edux-font-bold);
    }

    .display-100 {
        font-family: var(--edux-font-display);
        font-size: 6.25rem; /* 100px */
        font-weight: var(--edux-font-bold);
    }

    .display-80 {
        font-family: var(--edux-font-display);
        font-size: 5rem; /* 80px */
        font-weight: var(--edux-font-bold);
    }

    .display-72 {
        font-family: var(--edux-font-display);
        font-size: 4.5rem; /* 72px */
        font-weight: var(--edux-font-bold);
    }

     .display-60 {
        font-family: var(--edux-font-display);
        font-size: 3.75rem; /* 60px */
        font-weight: var(--edux-font-bold);
    }
    
    .display-48 {
        font-family: var(--edux-font-display);
        font-size: 3rem; /* 48px */
        font-weight: var(--edux-font-bold);
    }

    .display-41 {
        font-family: var(--edux-font-display);
        font-size: 2.563rem; /* 41px */
        font-weight: var(--edux-font-bold);
    }

    /* Heading Fonts */

    .heading-36-bold {
        font-family: var(--edux-font-heading);
        font-size: 2.25rem; /* 36px */
        font-weight: var(--edux-font-bold);
    }

    .heading-36-light {
        font-family: var(--edux-font-heading);
        font-size: 2.25rem; /* 36px */
        font-weight: var(--edux-font-light);
    }

    .heading-29-bold {
        font-family: var(--edux-font-heading);
        font-size: 1.813rem; /* 29px */
        font-weight: var(--edux-font-bold);
    }

    .heading-29-light {
        font-family: var(--edux-font-heading);
        font-size: 1.813rem; /* 29px */
        font-weight: var(--edux-font-light);
    }

    .heading-22-bold {
        font-family: var(--edux-font-heading);
        font-size: 1.375rem; /* 22px */
        font-weight: var(--edux-font-bold);
    }

    .heading-22-light {
        font-family: var(--edux-font-heading);
        font-size: 1.375rem; /*22px */
        font-weight: var(--edux-font-light);
    }

    .heading-18-bold {
        font-family: var(--edux-font-heading);
        font-size: 1.125rem; /* 18px */
        font-weight: var(--edux-font-bold);
    }

    .heading-18-light {
        font-family: var(--edux-font-heading);
        font-size: 1.125rem; /* 18px */
        font-weight: var(--edux-font-light);
    }

    .heading-16-bold {
        font-family: var(--edux-font-heading);
        font-size: 1rem; /* 16px */
        font-weight: var(--edux-font-bold);
    }

    .heading-16-light {
        font-family: var(--edux-font-heading);
        font-size: 1rem; /* 16px */
        font-weight: var(--edux-font-light);
    }

    .heading-14-bold {
        font-family: var(--edux-font-heading);
        font-size: 0.875rem; /* 14px */
        font-weight: var(--edux-font-bold);
    }

    .heading-14-light {
        font-family: var(--edux-font-heading);
        font-size: 0.875rem; /* 14px */
        font-weight: var(--edux-font-light);
    }

    .heading-12-bold {
        font-family: var(--edux-font-heading);
        font-size: 0.75rem; /* 12px */
        font-weight: var(--edux-font-bold);
    }

    .heading-12-light {
        font-family: var(--edux-font-heading);
        font-size: 0.75rem; /* 12px */
        font-weight: var(--edux-font-light);
    }

    .heading-11-semi-bold {
        font-family: var(--edux-font-heading);
        font-size: 0.688rem; /* 11px */
        font-weight: var(--edux-font-semi-bold);
    }

    .body-18 {
        font-family: var(--edux-font-body);
        font-size: 1.125rem; /* 18px */
        font-weight: var(--edux-font-normal);
    }

    /* Body Fonts */

    .body-16 {
        font-family: var(--edux-font-body);
        font-size: 1rem; /* 16px */
        font-weight: var(--edux-font-normal);
    }

    .body-14 {
        font-family: var(--edux-font-body);
        font-size: 0.875rem; /* 14px */
        font-weight: var(--edux-font-normal);
    }

    .body-12 {
        font-family: var(--edux-font-body);
        font-size: 0.75rem; /* 12px */
        font-weight: var(--edux-font-normal);
    }

    .body-11 {
        font-family: var(--edux-font-body);
        font-size: 0.688rem; /* 11px */
        font-weight: var(--edux-font-normal);
    }

    /* Number & Label Fonts */

    .number-240 {
        font-family: var(--edux-font-number-label);
        font-size: 15rem; /* 240px */
        font-weight: var(--edux-font-light);
    }

    .number-120 {
        font-family: var(--edux-font-number-label);
        font-size: 7.5rem; /* 120px */
        font-weight: var(--edux-font-light);
    }

    .number-48 {
        font-family: var(--edux-font-number-label);
        font-size: 3rem; /* 48px */
        font-weight: var(--edux-font-light);
    }
    
    .number-36 {
        font-family: var(--edux-font-number-label);
        font-size: 2.25rem; /* 36px */
        font-weight: var(--edux-font-light);
    }

    .number-11 {
        font-family: var(--edux-font-number-label);
        font-size: 0.688rem; /* 11px */
        font-weight: 500;
    }

    .label-14 {
        font-family: var(--edux-font-number-label);
        font-size: 0.875rem; /* 14px */
        font-weight: var(--edux-font-light);
        text-transform: uppercase;
    }

    .label-12 {
        font-family: var(--edux-font-number-label);
        font-size: 0.75rem; /* 12px */
        font-weight: var(--edux-font-light);
        text-transform: uppercase;
    }

    .label-11 {
        font-family: var(--edux-font-number-label);
        font-size: 0.688rem; /* 11px */
        font-weight: var(--edux-font-light);
        text-transform: uppercase;
    }

    /* Forms */

    /* Input Field */

        .input {
            font-family: var(--edux-input-font-family);
            font-size: var(--edux-input-font-size);
            font-weight: var(--edux-input-font-weight);
            line-height: var(--edux-input-line-height);
            color: var(--edux-input-color);
            background-color: var(--edux-input-background-color);
            border: var(--edux-input-border-width) solid var(--edux-input-border-color);
            border-radius: var(--edux-input-border-radius);
        }

`
