import { css } from 'lit'

export default css`
    :host {
        --label-height: 1.8125rem;

        block-size: var(--terra-block-size, 2.1875rem);
        box-sizing: border-box;
        color: #1b1b1b; /* HDS uses this color for body text but does not have a defined color in the HDS palette */
        contain: layout size style;
        contain-intrinsic-size: var(--terra-inline-size, 100%)
            calc(33vh + var(--terra-block-size, 2.1875rem));
        display: block;
        font-family: var(--terra-font-family--public-sans);
        inline-size: var(--terra-inline-size, 100%);
        position: relative;
        z-index: 10;
    }

    * {
        box-sizing: inherit;
    }

    .search-input-group {
        block-size: 100%;
        display: flex;
        flex-wrap: wrap;
    }

    .combobox {
        block-size: var(--terra-block-size, 2.25rem);
        flex: 1 1 auto;
        padding-inline: 2rem;
        transition:
            background-color 0.2s ease,
            border-color 0.2s ease;
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

    .search-input-button {
        margin-block: 0;
        margin-inline: 0;
        outline: 0;
        position: absolute;
        transition:
            background-color 0.2s ease,
            border-color 0.2s ease;
        z-index: 2;
    }

    .search-input-button::part(base) {
        border-color: transparent;
    }

    .search-input-button::part(base):hover {
        background-color: transparent;
        border-color: var(--terra-color-nasa-blue-shade);
        color: var(--terra-button-outline-text-color);
    }

    .search-button {
        left: 0;
    }

    .clear-button {
        right: 0;
    }

    .button-icon {
        height: 1rem;
        width: 1rem;
    }

    .spinner {
        transform-origin: center;
        animation: spin 2s linear infinite;
    }

    .spinner circle {
        stroke-linecap: round;
        animation: vary-stroke 1.5s ease-in-out infinite;
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
        padding-inline: 0rem;
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

    .listbox-option-group:has(.clear-button) {
        text-align: center;
    }

    .group-title {
        font-family: var(--terra-font-family--inter);
        font-weight: 700;
        margin-block: 0;
    }

    .listbox-option {
        cursor: pointer;
        list-style: none;
        padding-inline: 0.5rem;
        transition: background-color 0.1s ease-in-out;
    }

    .listbox-option[aria-selected='true'] {
        animation: traverse 0.2s ease-in-out forwards;
        background-color: var(--terra-color-nasa-blue-shade);
        color: var(--terra-color-spacesuit-white);
    }

    @media (prefers-reduced-motion) {
        .button-icon {
            transition: rotate 0s ease;
        }

        .search-results {
            scroll-behavior: auto;
        }
    }

    @keyframes traverse {
        from {
            filter: brightness(0.8);
            opacity: 0.8;
        }

        to {
            filter: brightness(1);
            opacity: 1;
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
