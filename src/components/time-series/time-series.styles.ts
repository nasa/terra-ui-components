import { css } from 'lit'

export default css`
    :host {
        display: grid;
        gap: 1.5rem 0.75rem;
        grid-template-rows: auto;
        grid-template-columns: 1fr 1fr;
    }

    terra-variable-combobox {
        grid-column: 1 / 2;
    }

    terra-spatial-picker {
        grid-column: 2 / 3;
    }

    .plot-container {
        grid-column: 1 / 3;
    }

    .spacer {
        padding-block: 1.375rem;
    }

    terra-plot::part(plot-title) {
        opacity: 0;
        z-index: 0 !important;
    }

    dialog {
        opacity: 1;
        transition: opacity 0.3s ease-out 0.4s;

        @starting-style {
            opacity: 0;
        }

        place-self: center;
        z-index: var(--terra-z-index-dialog);
    }

    dialog {
        width: 450px;
        max-width: 90vw;
        padding: 1.5rem;
        border-radius: 8px;
        border: 1px solid var(--terra-color-neutral-200, #e5e7eb);
        box-shadow:
            0 4px 6px -1px rgba(0, 0, 0, 0.1),
            0 2px 4px -1px rgba(0, 0, 0, 0.06);
        background-color: var(--terra-color-neutral-0, #ffffff);
    }

    dialog h2 {
        margin-top: 0;
        color: var(--terra-color-danger-600, #dc2626);
        font-size: 1.2rem;
    }

    dialog ul {
        margin-bottom: 1.5rem;
    }

    dialog li {
        margin-bottom: 0.5rem;
    }

    .dialog-buttons {
        display: flex;
        justify-content: flex-end;
        gap: 1rem;
        margin-top: 1.5rem;
    }
`
