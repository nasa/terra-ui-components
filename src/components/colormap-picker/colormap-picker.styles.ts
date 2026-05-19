import { css } from 'lit'

export default css`
    :host {
        display: block;
    }

    :host([disabled]) {
        opacity: 0.5;
        cursor: not-allowed;
    }

    .colormap-picker {
        display: flex;
        flex-direction: column;
        gap: var(--terra-spacing-small);
    }

    /* Filter bar */

    .colormap-picker__filter {
        display: flex;
        gap: var(--terra-spacing-x-small);
        flex-wrap: wrap;
    }

    .colormap-picker__filter-btn {
        padding: var(--terra-spacing-x-small) var(--terra-spacing-small);
        border: 1px solid var(--terra-color-carbon-30);
        border-radius: var(--terra-border-radius-medium);
        background: transparent;
        color: var(--terra-color-carbon-80);
        font-size: var(--terra-font-size-small);
        font-family: inherit;
        cursor: pointer;
        transition: background-color 120ms ease, border-color 120ms ease, color 120ms ease;
        white-space: nowrap;
    }

    .colormap-picker__filter-btn:hover:not(:disabled) {
        background-color: var(--terra-color-carbon-10);
        border-color: var(--terra-color-carbon-50);
    }

    .colormap-picker__filter-btn--active {
        background-color: var(--terra-color-nasa-blue);
        border-color: var(--terra-color-nasa-blue);
        color: var(--terra-color-spacesuit-white);
    }

    .colormap-picker__filter-btn--active:hover:not(:disabled) {
        background-color: var(--terra-color-nasa-blue);
        border-color: var(--terra-color-nasa-blue);
    }

    .colormap-picker__filter-btn:focus-visible {
        outline: 2px solid var(--terra-color-nasa-blue);
        outline-offset: 2px;
    }

    .colormap-picker__filter-btn:disabled {
        cursor: not-allowed;
    }

    /* Swatch grid */

    .colormap-picker__grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
        gap: var(--terra-spacing-x-small);
    }

    .colormap-picker__swatch {
        display: flex;
        flex-direction: column;
        gap: 4px;
        padding: var(--terra-spacing-x-small);
        border: 2px solid transparent;
        border-radius: var(--terra-border-radius-medium);
        background: var(--terra-color-carbon-5, #f8f8f8);
        cursor: pointer;
        text-align: left;
        transition: border-color 120ms ease, background-color 120ms ease;
    }

    .colormap-picker__swatch:hover:not(:disabled) {
        background-color: var(--terra-color-carbon-10);
        border-color: var(--terra-color-carbon-30);
    }

    .colormap-picker__swatch--selected {
        border-color: var(--terra-color-nasa-blue);
        background-color: var(--terra-color-carbon-10);
    }

    .colormap-picker__swatch:focus-visible {
        outline: 2px solid var(--terra-color-nasa-blue);
        outline-offset: 2px;
    }

    .colormap-picker__swatch:disabled {
        cursor: not-allowed;
    }

    .colormap-picker__swatch-gradient {
        display: block;
        height: 18px;
        border-radius: var(--terra-border-radius-small);
        width: 100%;
    }

    .colormap-picker__swatch-label {
        font-size: var(--terra-font-size-x-small);
        color: var(--terra-color-carbon-70);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-family: var(--terra-font-mono, monospace);
    }
`
