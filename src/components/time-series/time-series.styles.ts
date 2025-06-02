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

    .toggles {
        display: flex;
        justify-content: space-between;
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
         padding: 1em;
         display: none
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

    terra-date-range-slider {
        grid-column: 1 / 3;
        padding-block-start: 2rem;
    }

    terra-spatial-picker::part(leaflet-bbox),
    terra-spatial-picker::part(leaflet-edit) {
        display: none;
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
`
