import { css } from 'lit'

export default css`
    :host {
        --label-height: 1.8125rem;
        --help-height: 1.8125rem;
        --host-height: 5.8125rem;

        block-size: var(--terra-block-size, 2.1875rem);
        box-sizing: border-box;
        color: #1b1b1b; /* HDS uses this color for body text but does not have a defined color in the HDS palette */
        contain: layout size style;
        contain-intrinsic-size: var(--terra-inline-size, 100%)
            calc(33vh + var(--terra-block-size, 2.1875rem));
        display: block;
        font-family: var(--terra-font-family--public-sans);
        height: var(--terra-block-size, var(--host-height));
        inline-size: var(--terra-inline-size, 100%);
        position: relative;
        z-index: 10;
    }

    :host([hide-help]) {
        height: calc(
            var(--terra-block-size, var(--host-height)) - var(--help-height)
        );
    }

    :host([hide-label]) {
        height: calc(
            var(--terra-block-size, var(--host-height)) - var(--label-height)
        );
    }

    :host([hide-help][hide-label]) {
        height: calc(
            var(--terra-block-size, var(--host-height)) - var(--help-height) - var(
                    --label-height
                )
        );
    }

    * {
        box-sizing: inherit;
    }

    .search-input-group {
        block-size: 100%;
        display: flex;
        flex-wrap: wrap;
    }

    .tag-container {
        block-size: var(--terra-block-size, 2.25rem);
        position: absolute;
        top: 2.25rem;
        display: flex;
        flex-wrap: wrap;
        align-content: center;
        padding-inline-start: 0.5rem;
    }

    .tag {
        --terra-button-height-small: 1.25rem;
        --terra-spacing-small: 0.5rem;
    }

    .tag:hover .tag-icon,
    .tag:active .tag-icon,
    .tag:focus .tag-icon {
        transform: scale(1.125);
        color: var(--terra-color-nasa-red-shade);
        transition:
            transform 0.2s ease-out,
            color 0.2s ease-out;
    }

    .tag-icon {
        font-size: 1.25em;
    }

    .tag-icon::part(svg) {
        stroke-width: 2;
    }

    .combobox {
        block-size: var(--terra-block-size, 2.25rem);
        flex: 1 1 auto;
        padding-inline: 0.5rem;
        transition:
            background-color 0.2s ease,
            border-color 0.2s ease;
        max-inline-size: 100%;
    }

    .combobox::placeholder {
        color: var(--terra-color-carbon-60);
    }

    .combobox:focus {
        border-color: var(--terra-color-carbon-40);
        outline: 0;
    }

    .search-input-group:has(.combobox:not(:focus)) + .search-results[open] {
        border-color: var(--terra-color-carbon-30);
    }

    .combobox-button {
        position: absolute;
        right: 0;
        z-index: 2;
        margin-block: 0;
        margin-inline: 0;
        outline: 0;
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
        color: var(--terra-color-carbon-60);
        flex: 1 1 100%;
        font-size: var(--terra-font-size-small);
        line-height: var(--terra-line-height-normal);
        margin-block: 0;
        position: absolute;
        bottom: -10px;
    }

    .external-link {
        fill: currentColor;
        vertical-align: middle;
    }

    .search-results {
        background-color: var(--terra-color-spacesuit-white);
        block-size: calc(33vh - var(--terra-block-size, 2.1875rem));
        border-block-end: 2px solid transparent;
        border-inline: 2px solid transparent;
        contain: strict;
        contain-intrinsic-size: var(--terra-inline-size, 100%)
            calc(33vh - var(--terra-block-size, 2.1875rem));
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
        border-color: var(--terra-color-carbon-40);
        content-visibility: auto;
        max-height: calc(33vh - var(--terra-block-size, 2.1875rem));
        opacity: 1;
        visibility: visible;
    }

    .search-results .updating {
        font-size: var(--terra-font-size-x-large);
        padding-block: 4rem;
        text-align: center;
    }

    .search-results .error {
        color: var(--terra-color-nasa-red);
        font-family: var(--terra-font-family--dm-mono);
        padding-block: 2rem;
    }

    .listbox-option-group {
        padding-inline: 0.5rem;
        padding-block: 1rem 0.5rem;
    }

    .group-title {
        font-family: var(--terra-font-family--inter);
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
`
