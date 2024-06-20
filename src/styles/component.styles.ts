import { css } from 'lit'

console.log("window.matchMedia('(prefers-color-scheme: dark)').media === 'not all' -----> " + window.matchMedia('(prefers-color-scheme: dark)').media === 'not all');
console.log("window.matchMedia('(prefers-color-scheme: dark)').media -----> " + window.matchMedia('(prefers-color-scheme: dark)').media);
console.log("window.matchMedia('(prefers-color-scheme: light)').media -----> " + window.matchMedia('(prefers-color-scheme: light)').media);

const darkModeCSS = '/dist/themes/horizon-dark.css';
const lightModeCSS = '/dist/themes/horizon-light.css';

function loadCSSFile(filename: string, media?: string, onloadCallback?: () => void): void {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = filename;
    if (media) {
        link.media = media;
    }
    if (onloadCallback) {
        link.onload = onloadCallback;
    }
    document.head.appendChild(link);
}

// Load base component theme
loadCSSFile('/dist/themes/horizon.css', '(prefers-color-scheme: dark)');

// If `prefers-color-scheme` is not supported, fall back to light mode.
// In this case, horizon-light.css will be downloaded with `highest` priority.
if (window.matchMedia('(prefers-color-scheme: dark)').media === 'not all') {
    document.documentElement.style.display = 'none';
    loadCSSFile(lightModeCSS,'',() => { document.documentElement.style.display = '' });
}

// Load both light and dark theme CSS files with appropriate media queries. The matching 
// file will be downloaded with `highest`, the non-matching file with `lowest` priority.
loadCSSFile(darkModeCSS, '(prefers-color-scheme: dark)');
loadCSSFile(lightModeCSS, '(prefers-color-scheme: light)');

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
        font-family: var(--edux-font-family--inter);
        font-size: 7.5rem; /* 120px */
        font-weight: var(--edux-font-weight-bold);
    }

    .display-100 {
        font-family: var(--edux-font-family--inter);
        font-size: 6.25rem; /* 100px */
        font-weight: var(--edux-font-weight-bold);
    }

    .display-80 {
        font-family: var(--edux-font-family--inter);
        font-size: 5rem; /* 80px */
        font-weight: var(--edux-font-weight-bold);
    }

    .display-72 {
        font-family: var(--edux-font-family--inter);
        font-size: 4.5rem; /* 72px */
        font-weight: var(--edux-font-weight-bold);
    }

     .display-60 {
        font-family: var(--edux-font-family--inter);
        font-size: 3.75rem; /* 60px */
        font-weight: var(--edux-font-weight-bold);
    }
    
    .display-48 {
        font-family: var(--edux-font-family--inter);
        font-size: 3rem; /* 48px */
        font-weight: var(--edux-font-weight-bold);
    }

    .display-41 {
        font-family: var(--edux-font-family--inter);
        font-size: 2.563rem; /* 41px */
        font-weight: var(--edux-font-weight-bold);
    }

    /* Heading Fonts */

    .heading-36-bold {
        font-family: var(--edux-font-family--inter);
        font-size: 2.25rem; /* 36px */
        font-weight: var(--edux-font-weight-bold);
    }

    .heading-36-light {
        font-family: var(--edux-font-family--inter);
        font-size: 2.25rem; /* 36px */
        font-weight: var(--edux-font-weight-light);
    }

    .heading-29-bold {
        font-family: var(--edux-font-family--inter);
        font-size: 1.813rem; /* 29px */
        font-weight: var(--edux-font-weight-bold);
    }

    .heading-29-light {
        font-family: var(--edux-font-family--inter);
        font-size: 1.813rem; /* 29px */
        font-weight: var(--edux-font-weight-light);
    }

    .heading-22-bold {
        font-family: var(--edux-font-family--inter);
        font-size: 1.375rem; /* 22px */
        font-weight: var(--edux-font-weight-bold);
    }

    .heading-22-light {
        font-family: var(--edux-font-family--inter);
        font-size: 1.375rem; /*22px */
        font-weight: var(--edux-font-weight-light);
    }

    .heading-18-bold {
        font-family: var(--edux-font-family--inter);
        font-size: 1.125rem; /* 18px */
        font-weight: var(--edux-font-weight-bold);
    }

    .heading-18-light {
        font-family: var(--edux-font-family--inter);
        font-size: 1.125rem; /* 18px */
        font-weight: var(--edux-font-weight-light);
    }

    .heading-16-bold {
        font-family: var(--edux-font-family--inter);
        font-size: 1rem; /* 16px */
        font-weight: var(--edux-font-weight-bold);
    }

    .heading-16-light {
        font-family: var(--edux-font-family--inter);
        font-size: 1rem; /* 16px */
        font-weight: var(--edux-font-weight-light);
    }

    .heading-14-bold {
        font-family: var(--edux-font-family--inter);
        font-size: 0.875rem; /* 14px */
        font-weight: var(--edux-font-weight-bold);
    }

    .heading-14-light {
        font-family: var(--edux-font-family--inter);
        font-size: 0.875rem; /* 14px */
        font-weight: var(--edux-font-weight-light);
    }

    .heading-12-bold {
        font-family: var(--edux-font-family--inter);
        font-size: 0.75rem; /* 12px */
        font-weight: var(--edux-font-weight-bold);
    }

    .heading-12-light {
        font-family: var(--edux-font-family--inter);
        font-size: 0.75rem; /* 12px */
        font-weight: var(--edux-font-weight-light);
    }

    .heading-11-semi-bold {
        font-family: var(--edux-font-family--inter);
        font-size: 0.688rem; /* 11px */
        font-weight: var(--edux-font-weight-semi-bold);
    }

    /* Body Fonts */
    
    .body-18 {
        font-family: var(--edux-font-family--public-sans);
        font-size: 1.125rem; /* 18px */
        font-weight: var(--edux-font-weight-normal);
    }

    .body-16 {
        font-family: var(--edux-font-family--public-sans);
        font-size: 1rem; /* 16px */
        font-weight: var(--edux-font-weight-normal);
    }

    .body-14 {
        font-family: var(--edux-font-family--public-sans);
        font-size: 0.875rem; /* 14px */
        font-weight: var(--edux-font-weight-normal);
    }

    .body-12 {
        font-family: var(--edux-font-family--public-sans);
        font-size: 0.75rem; /* 12px */
        font-weight: var(--edux-font-weight-normal);
    }

    .body-11 {
        font-family: var(--edux-font-family--public-sans);
        font-size: 0.688rem; /* 11px */
        font-weight: var(--edux-font-weight-normal);
    }

    /* Number & Label Fonts */

    .number-240 {
        font-family: var(--edux-font-family--dm-mono);
        font-size: 15rem; /* 240px */
        font-weight: var(--edux-font-weight-light);
    }

    .number-120 {
        font-family: var(--edux-font-family--dm-mono);
        font-size: 7.5rem; /* 120px */
        font-weight: var(--edux-font-weight-light);
    }

    .number-48 {
        font-family: var(--edux-font-family--dm-mono);
        font-size: 3rem; /* 48px */
        font-weight: var(--edux-font-weight-light);
    }
    
    .number-36 {
        font-family: var(--edux-font-family--dm-mono);
        font-size: 2.25rem; /* 36px */
        font-weight: var(--edux-font-weight-light);
    }

    .number-11 {
        font-family: var(--edux-font-family--dm-mono);
        font-size: 0.688rem; /* 11px */
        font-weight: 500;
    }

    .label-14 {
        font-family: var(--edux-font-family--dm-mono);
        font-size: 0.875rem; /* 14px */
        font-weight: var(--edux-font-weight-light);
        text-transform: uppercase;
    }

    .label-12 {
        font-family: var(--edux-font-family--dm-mono);
        font-size: 0.75rem; /* 12px */
        font-weight: var(--edux-font-weight-light);
        text-transform: uppercase;
    }

    .label-11 {
        font-family: var(--edux-font-family--dm-mono);
        font-size: 0.688rem; /* 11px */
        font-weight: var(--edux-font-weight-light);
        text-transform: uppercase;
    }

/* Forms */

    /* Input Field */

    .input {
        font-family: var(--edux-input-font-family);
        font-size: var(--edux-input-font-size);
        color: var(--edux-input-color);
        font-weight: var(--edux-input-font-weight);
        line-height: var(--edux-input-line-height);
        background-color: var(--edux-input-background-color);
        border: var(--edux-input-border-width) solid var(--edux-input-border-color);
        border-radius: var(--edux-input-border-radius);
    }

    .input-label {
        font-family: var(--edux-input-label-font-family);
        font-size: var(--edux-input-label-font-size);
        color: var(--edux-input-label-color);
        font-weight: var(--edux-font-weight-semibold);
        line-height: var(--edux-input-label-line-height);
    }  

/* Elements */

    a {
        text-decoration: underline;
        text-decoration-color: #585858;
        text-decoration-style: dashed;
        text-decoration-thickness: .05em;
        text-underline-offset: .25rem;
        color: var(--edux-color-carbon-60);     
    }
`
