import { css } from 'lit'

export default css`
    :host {
        --color-neutral--100: #f7f7f7; /* Retain these 2 local color variables rather than HDS references because color-carbon-XX scale flips with light/dark theme */
        --color-neutral--200: #d1d1d1;

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

    .combobox {
        block-size: var(--terra-block-size, 2.1875rem);
        flex: 1 1 auto;
        font-size: 1rem;
        padding-inline: 0.5rem;
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
        bottom: 0;
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
        padding-inline: 0px;
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
        padding-inline: 0.5rem;
        font-family: var(--terra-font-family--inter);
        font-weight: 700;
        margin-block: 0;
    }

    .listbox-option-group ul {
        padding-left: 0px;
    }

    .listbox-option {
        cursor: pointer;
        list-style: none;
        position: relative;
        padding-left: 2rem;
    }

    .listbox-option:hover,
    .listbox-option[aria-selected='true'] {
        transition: background-color 0.2s ease;
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

    /* General reset for skeleton elements */
    .skeleton,
    .skeleton * {
        margin: 0;
        padding: 0;
        list-style: none;
        box-sizing: border-box;
    }

    /* Styling for the skeleton groups */
    .skeleton.listbox-option-group {
        padding: 0.25rem;
        margin: 0.5rem 0;
        background: var(--color-neutral--100); /* Light background for the group */
    }

    /* Styling for the title in each group */
    .skeleton-title {
        display: flex;
        height: 1.25rem;
        width: 80%; /* Slightly longer than before */
        background-color: var(--color-neutral--100);
        margin-bottom: 10px;
    }

    /* Styling for each option inside the group */
    .skeleton .listbox-option {
        height: 1rem;
        width: 60%; /* Shorter width to differentiate from title */
        background-color: var(--color-neutral--200);
        margin-top: 5px;
        margin-left: 1.5rem;
    }

    /* Keyframes for the animation */
    @keyframes pulse {
        0%,
        100% {
            background-color: var(
                --terra-color-neutral--200,
                var(--color-neutral--200)
            );
        }
        50% {
            background-color: var(--color-neutral--100);
        }
    }

    /* Applying the animation to simulate loading */
    .skeleton-title,
    .skeleton .listbox-option {
        animation: pulse 2s infinite ease-in-out;
    }
`
