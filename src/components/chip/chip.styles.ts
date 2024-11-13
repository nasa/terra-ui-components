import { css } from 'lit'

export default css`
    .chip {
        display: inline-flex;
        flex-direction: row;
        background-color: var(--terra-color-carbon-5);
        border: 1.5px solid var(--terra-color-nasa-blue);
        cursor: default;
        border-radius: var(--terra-border-radius-medium);
        padding: 0;
        margin: 5px;
        color: var(--terra-color-carbon-50);
        font-family: var(--terra-font-family--inter);
        font-weight: var(--terra-font-weight-bold);
        white-space: nowrap;
        align-items: center;
        vertical-align: middle;
        text-decoration: none;
        justify-content: center;
    }

    .chip:hover {
        color: var(--terra-color-carbon-90);
    }

    .chip:focus {
        text-decoration: underline;
        text-decoration-style: dotted;
    }

    .chip--small {
        height: auto;
        min-height: 1.375rem;
        font-size: var(--terra-font-size-x-small);
    }

    .chip--medium {
        height: auto;
        min-height: 1.875rem;
        font-size: var(--terra-font-size-small);
    }

    .chip--large {
        height: auto;
        min-height: 2.5rem;
        font-size: var(--terra-font-size-large);
    }

    .chip-content {
        cursor: inherit;
        display: flex;
        align-items: center;
        user-select: none;
        white-space: nowrap;
    }

    .chip-content--small {
        padding-left: 8px;
        padding-right: 8px;
    }

    .chip-content--medium {
        padding-left: 12px;
        padding-right: 12px;
    }

    .chip-content--large {
        padding-left: 15px;
        padding-right: 15px;
    }

    .chip-svg {
        cursor: pointer;
        height: auto;
        fill: var(--terra-color-carbon-50);
        display: inline-block;
        transition: fill 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
        user-select: none;
        flex-shrink: 0;
    }

    .chip-svg--small {
        margin: 3px 3px 0px -6px;
        width: 0.75em;
        height: 0.75em;
        font-size: 20px;
    }

    .chip-svg--medium {
        margin: 4px 4px 0px -8px;
        width: 1em;
        height: 1em;
        font-size: 24px;
    }

    .chip-svg--large {
        margin: 6px 6px 0px -12px;
        width: 1.4em;
        height: 1.4em;
        font-size: 24px;
    }

    .chip:hover .chip-svg {
        fill: var(--terra-color-carbon-90);
    }

    .chip-close {
        padding: 0;
        border: 0;
        background: none;
        box-shadow: none;
        text-align: center;
        vertical-align: middle;
    }
`
