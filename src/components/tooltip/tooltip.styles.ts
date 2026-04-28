import { css } from 'lit'

export default css`
    :host {
        --max-width: 20rem;
        --hide-delay: 0ms;
        --show-delay: 150ms;

        display: contents;
    }

    .tooltip {
        --arrow-size: var(--terra-tooltip-arrow-size);
        --arrow-color: var(--terra-tooltip-background-color);
    }

    .tooltip::part(popup) {
        z-index: var(--terra-z-index-tooltip);
    }

    .tooltip[placement^='top']::part(popup) {
        transform-origin: bottom;
    }

    .tooltip[placement^='bottom']::part(popup) {
        transform-origin: top;
    }

    .tooltip[placement^='left']::part(popup) {
        transform-origin: right;
    }

    .tooltip[placement^='right']::part(popup) {
        transform-origin: left;
    }

    .tooltip__body {
        display: block;
        width: max-content;
        max-width: var(--max-width);
        border-radius: var(--terra-tooltip-border-radius);
        background-color: var(--terra-tooltip-background-color);
        font-family: var(--terra-tooltip-font-family);
        font-size: var(--terra-tooltip-font-size);
        font-weight: var(--terra-tooltip-font-weight);
        line-height: var(--terra-tooltip-line-height);
        text-align: start;
        white-space: normal;
        color: var(--terra-tooltip-color);
        padding: var(--terra-tooltip-padding);
        pointer-events: none;
        user-select: none;
        -webkit-user-select: none;
    }

    .tooltip__image {
        display: none;
    }

    .tooltip__image ::slotted(*) {
        display: block;
    }

    :host([variant='popover']) .tooltip__body {
        /* Popovers are card-like panels with richer content */
        width: auto;
        min-width: 260px;
        max-width: 320px;
        border-radius: var(--terra-popover-border-radius);
        background-color: var(--terra-popover-background-color);
        color: var(--terra-popover-color);
        font-family: var(--terra-popover-font-family);
        font-size: var(--terra-popover-font-size);
        font-weight: var(--terra-popover-font-weight);
        line-height: var(--terra-popover-line-height);
        padding: var(--terra-popover-padding);
        box-shadow: var(--terra-popover-shadow);
        overflow: hidden;
        pointer-events: auto; /* allow interactive content such as links and buttons */
    }

    :host([variant='popover']) .tooltip {
        --arrow-size: var(--terra-popover-arrow-size);
        --arrow-color: var(--terra-popover-background-color);
    }

    :host([variant='popover']) .tooltip__image {
        display: block;
        margin: calc(-1 * var(--terra-popover-padding));
        margin-bottom: var(--terra-popover-padding);
    }

    :host([variant='popover']) .tooltip__image ::slotted(img),
    :host([variant='popover']) .tooltip__image ::slotted(picture),
    :host([variant='popover']) .tooltip__image ::slotted(video) {
        width: 100%;
        max-height: 260px;
        object-fit: cover;
        border-top-left-radius: var(--terra-popover-border-radius);
        border-top-right-radius: var(--terra-popover-border-radius);
    }
`
