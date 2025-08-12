import { css } from 'lit'

export default css`
    :host {
        --terra-dialog-backdrop-color: rgba(0, 0, 0, 0.5);
        --terra-dialog-z-index: 1000;

        display: block;
    }

    ::backdrop {
        background-color: var(--terra-dialog-backdrop-color);
    }

    dialog[open] {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0;
        position: fixed;
        inset: 0px;
        z-index: var(--terra-dialog-z-index);
        max-width: 90vw;
    }

    .dialog-content {
        max-height: 90vh;
        overflow: auto;
        width: 100%;
    }
`
