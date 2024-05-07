import { css } from 'lit'

export default css`
    :host {
        --color-blue--400: #007acc;
        --color-blue--500: #1c67e3;
        --color-blue--600: #0b3d91;

        --color-red--400: #f64137;
        --color-red--500: #b60109;

        --color-neutral--000: #ffffff;
        --color-neutral--100: #f7f7f7;
        --color-neutral--200: #d1d1d1;
        --color-neutral--300: #b9b9bb;
        --color-neutral--400: #959599;
        --color-neutral--500: #767676;
        --color-neutral--600: #58585b;
        --color-neutral--700: #2e2e32;
        --color-neutral--800: #1b1b1b;

        --font-family--inter: Inter, sans-serif;
        --font-family--public-sans: 'Public Sans', sans-serif;
        --font-family--dm-mono: 'DM Mono', monospace;

        --label-height: 1.8125rem;
        --help-height: 1.8125rem;
        --host-height: 5.8125rem;

        block-size: var(--edux-block-size, 2.1875rem);
        box-sizing: border-box;
        color: var(--edux-color-neutral--700, var(--color-neutral--700));
        contain: layout size style;
        contain-intrinsic-size: var(--edux-inline-size, 100%)
            calc(33vh + var(--edux-block-size, 2.1875rem));
        display: block;
        font-family: var(
            --edux-font-family--public-sans,
            var(--font-family--public-sans)
        );
        height: var(--edux-block-size, var(--host-height));
        inline-size: var(--edux-inline-size, 100%);
        position: relative;
    }

    :host([hide-help]) {
        height: calc(var(--edux-block-size, var(--host-height)) - var(--help-height));
    }

    :host([hide-label]) {
        height: calc(var(--edux-block-size, var(--host-height)) - var(--label-height));
    }

    :host([hide-help][hide-label]) {
        height: calc(
            var(--edux-block-size, var(--host-height)) - var(--help-height) - var(
                    --label-height
                )
        );
    }

    * {
        box-sizing: inherit;
    }

    .search-input-label {
        font-family: var(--edux-font-family--inter, var(--font-family--inter));
        font-weight: 600;
        line-height: 1.1875rem;
    }

    .search-input-group {
        block-size: 100%;
        display: flex;
        flex-wrap: wrap;
    }

    .combobox {
        background-color: var(--edux-color-neutral--100, var(--color-neutral--100));
        block-size: var(--edux-block-size, 2.1875rem);
        border-block: 2px solid
            var(--edux-color-neutral--200, var(--color-neutral--200));
        border-inline-end: 0;
        border-inline-start: 2px solid
            var(--edux-color-neutral--200, var(--color-neutral--200));
        color: currentColor;
        flex: 1 1 auto;
        font-size: 1rem;
        padding-inline: 0.5rem;
        transition:
            background-color 0.2s ease,
            border-color 0.2s ease;
    }

    .combobox::placeholder {
        color: var(--edux-color-neutral--600, var(--color-neutral--600));
    }

    .combobox:focus {
        background-color: var(--edux-color-neutral--000, var(--color-neutral--000));
        border-color: var(--edux-color-neutral--400, var(--color-neutral--400));
        outline: 0;
    }

    .combobox:focus + .combobox-button {
        background-color: var(--edux-color-neutral--800, var(--color-neutral--800));
        border-block-color: var(--edux-color-neutral--400, var(--color-neutral--400));
        border-inline-end-color: var(
            --edux-color-neutral--400,
            var(--color-neutral--400)
        );
    }

    .search-input-group:has(.combobox:not(:focus)) + .search-results[open] {
        border-color: var(--edux-color-neutral--200, var(--color-neutral--200));
    }

    .combobox-button {
        align-items: center;
        background-color: var(--edux-color-neutral--500, var(--color-neutral--500));
        block-size: var(--edux-block-size, 2.1875rem);
        border-block: 2px solid
            var(--edux-color-neutral--500, var(--color-neutral--500));
        border-inline-end: 2px solid
            var(--edux-color-neutral--500, var(--color-neutral--500));
        border-inline-start: 0;
        color: var(--edux-color-neutral--000, var(--color-neutral--000));
        cursor: pointer;
        display: flex;
        flex: 0 0 auto;
        font-size: 1rem;
        justify-content: center;
        margin-block: 0;
        margin-inline: 0;
        outline: 0;
        padding-inline: 0.5rem;
        transition:
            background-color 0.2s ease,
            border-color 0.2s ease;
    }

    .combobox-button[aria-expanded='true'] .chevron {
        rotate: -0.5turn;
    }

    .button-icon {
        height: 1rem;
        width: 1rem;
    }

    .chevron {
        transition: rotate 0.2s ease;
        will-change: rotate;
    }

    .spinner {
        transform-origin: center;
        animation: spin 2s linear infinite;
    }

    .spinner circle {
        stroke-linecap: round;
        animation: vary-stroke 1.5s ease-in-out infinite;
    }

    .search-help {
        bottom: 0;
        color: var(--edux-color-neutral--600, var(--color-neutral--600));
        flex: 1 1 100%;
        font-size: 0.875rem;
        margin-block: 0;
        position: absolute;
    }

    .external-link {
        fill: currentColor;
        vertical-align: middle;
    }

    .search-results {
        background-color: var(--edux-color-neutral--000, var(--color-neutral--000));
        block-size: calc(33vh - var(--edux-block-size, 2.1875rem));
        border-block-end: 2px solid transparent;
        border-inline: 2px solid transparent;
        contain: strict;
        contain-intrinsic-size: var(--edux-inline-size, 100%)
            calc(33vh - var(--edux-block-size, 2.1875rem));
        content-visibility: hidden;
        left: 0;
        margin-block: 0;
        margin-inline: 0;
        max-height: 0;
        opacity: 0;
        overflow-y: auto;
        overscroll-behavior: contain;
        padding-block: 0.5rem;
        padding-inline: 0.5rem;
        position: absolute;
        right: 0;
        visibility: hidden;
        transition:
            background-color 0.2s ease,
            border-color 0.2s ease;
    }

    .search-results[open] {
        border-color: var(--edux-color-neutral--400, var(--color-neutral--400));
        content-visibility: auto;
        max-height: calc(33vh - var(--edux-block-size, 2.1875rem));
        opacity: 1;
        visibility: visible;
    }

    .search-results .updating {
        font-size: 1.5rem;
        padding-block: 4rem;
        text-align: center;
    }

    .search-results .error {
        color: var(--edux-color-red--500, var(--color-red--500));
        font-family: var(--edux-font-family--dm-mono, var(--font-family--dm-mono));
        padding-block: 2rem;
    }

    .listbox-option-group {
        padding-inline: 0.5rem;
        padding-block: 1rem 0.5rem;
    }

    .listbox-option-group:has(.clear-button) {
        text-align: center;
    }

    .group-title {
        font-family: var(--edux-font-family--inter, var(--font-family--inter));
        font-weight: 700;
        margin-block: 0;
    }

    .listbox-option {
        cursor: pointer;
        list-style: disc;
        position: relative;
    }

    .listbox-option:hover::before,
    .listbox-option[aria-selected='true']::before {
        block-size: 1rem;
        content: url("data:image/svg+xml,%3Csvg viewBox='0 0 32 32' fill='%231c67e3' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='16' cy='16' r='16'%3E%3C/circle%3E%3Cpath fill='%23ffffff' d='M8 16.956h12.604l-3.844 4.106 1.252 1.338L24 16l-5.988-6.4-1.252 1.338 3.844 4.106H8v1.912z' %3E%3C/path%3E%3C/svg%3E%0A");
        inline-size: 1rem;
        left: -2ch;
        position: absolute;
        top: 0.0625lh;
    }

    @media (prefers-reduced-motion) {
        .button-icon {
            transition: rotate 0s ease;
        }

        .search-results {
            scroll-behavior: auto;
        }
    }

    @keyframes spin {
        to {
            transform: rotate(1turn);
        }
    }

    @keyframes vary-stroke {
        0% {
            stroke-dasharray: 0 150;
            stroke-dashoffset: 0;
        }
        47.5% {
            stroke-dasharray: 42 150;
            stroke-dashoffset: -16;
        }
        95%,
        100% {
            stroke-dasharray: 42 150;
            stroke-dashoffset: -59;
        }
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
