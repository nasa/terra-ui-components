import { css } from 'lit'

export default css`
    :host {
        --terra-dialog-backdrop-color: rgba(0, 0, 0, 0.5);
        --terra-dialog-z-index: 1000;

        display: block;
    }

    .dialog-backdrop {
        pointer-events: none;
        position: fixed;
        top: 0;
        left: -9999;
        right: auto;
        bottom: auto;
        width: 0;
        height: 0;
        z-index: calc(var(--terra-dialog-z-index) - 1);
        /* TODO: fade in the backdrop */
    }

    .dialog-backdrop.visible {
        background-color: var(--terra-dialog-backdrop-color);
    }

    .dialog-backdrop.clickable {
        pointer-events: auto;
    }

    .dialog-backdrop.active {
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        width: auto;
        height: auto;
    }

    dialog[open] {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0;
        position: fixed;
        inset: 0px;
        z-index: var(--terra-dialog-z-index);
        max-width: 100%;
    }
`
