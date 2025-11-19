import { css } from 'lit'

export default css`
    :host {
        display: inline-block;
    }

    :host([stack]) {
        display: block;
    }

    .chip {
        display: inline-flex;
        flex-direction: row;
        background-color: var(--terra-chip-background-color);
        border: var(--terra-chip-border-width) solid var(--terra-chip-border-color);
        cursor: default;
        border-radius: var(--terra-border-radius-medium);
        padding: 0;
        margin: var(--terra-chip-margin);
        color: var(--terra-chip-color);
        font-family: var(--terra-chip-font-family);
        font-weight: var(--terra-chip-font-weight);
        white-space: nowrap;
        align-items: center;
        vertical-align: middle;
        text-decoration: none;
        justify-content: center;
    }

    .chip:hover {
        color: var(--terra-chip-color-hover);
    }

    .chip:focus {
        text-decoration: underline;
        text-decoration-style: dotted;
    }

    .chip--small {
        height: auto;
        min-height: var(--terra-chip-height-small);
        font-size: var(--terra-font-size-x-small);
    }

    .chip--medium {
        height: auto;
        min-height: var(--terra-chip-height-medium);
        font-size: var(--terra-font-size-small);
    }

    .chip--large {
        height: auto;
        min-height: var(--terra-chip-height-large);
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
        padding-left: var(--terra-chip-padding-small);
        padding-right: var(--terra-chip-padding-small);
    }

    .chip-content--medium {
        padding-left: var(--terra-chip-padding-medium);
        padding-right: var(--terra-chip-padding-medium);
    }

    .chip-content--large {
        padding-left: var(--terra-chip-padding-large);
        padding-right: var(--terra-chip-padding-large);
    }

    .chip-svg {
        cursor: pointer;
        height: auto;
        fill: var(--terra-chip-icon-color);
        display: inline-block;
        transition: var(--terra-chip-transition);
        user-select: none;
        flex-shrink: 0;
    }

    .chip-svg--small {
        margin: 3px 3px 0px -6px;
        width: 0.75em;
        height: 0.75em;
        font-size: 18px;
    }

    .chip-svg--medium {
        margin: 4px 4px 0px -8px;
        width: 1em;
        height: 1em;
        font-size: 18px;
    }

    .chip-svg--large {
        margin: 6px 6px 0px -12px;
        width: 1.4em;
        height: 1.4em;
        font-size: 20px;
    }

    .chip:hover .chip-svg {
        fill: var(--terra-chip-icon-color-hover);
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
