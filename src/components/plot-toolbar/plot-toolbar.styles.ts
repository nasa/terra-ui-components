import { css } from 'lit'

export default css`
    :host {
        display: block;
    }

    header {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        position: relative;
        z-index: 10;
        padding-bottom: 10px;
    }

    .title {
        margin: 0;
        font-size: 1.25rem;
    }

    .subtitle {
        font-weight: var(--terra-font-weight-normal);
        margin: 0;
        margin-bottom: 0.5em;
        font-size: 0.875rem;
    }

    .toggles {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 0 1em;
    }

    .toggle {
        position: relative;
    }

    .toggle[aria-expanded='true']::after {
        background-color: var(--terra-color-nasa-blue);
        block-size: 0.125em;
        border-radius: 0.25em;
        bottom: -0.5em;
        content: ' ';
        inline-size: 100%;
        left: 0;
        position: absolute;
    }

    menu {
        all: unset;
        position: absolute;
        top: calc(100%);
        right: 0;
        z-index: 1000;
        background: white;
        border: 1px solid #ccc;
        border-radius: 0.5em;
        box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.1);
        width: max-content;
        min-width: 20ch;
        max-width: 100%;
        padding: 1em;
        display: none;
    }

    menu[data-expanded='true'] {
        display: block;
    }

    menu [role='menuitem'] {
        display: block;
        list-style: none;
        margin: 0;
        padding: 0.5em 0;
    }

    [role='menuitem'] p {
        margin-block: 0.5em;
    }

    menu dt {
        font-weight: var(--terra-font-weight-semibold);
    }

    menu dd {
        font-style: italic;
        text-wrap: balance;
    }

    .spacer {
        padding-block: 1.375rem;
    }
`
