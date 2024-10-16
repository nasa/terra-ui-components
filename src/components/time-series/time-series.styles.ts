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

    header {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
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
        margin: 0;
        max-height: 0;
        overscroll-behavior: contain;
        padding-block: 0.25em;
        padding-inline: 0.5em;
        transition: max-height 0.1s ease-in;
    }

    menu[data-expanded='true'] {
        max-height: 85dvh;
        overflow-y: auto;
        padding-block: 1em;
    }

    menu li {
        list-style: none;
        margin: 0;
        padding: 0;
    }

    menu dt {
        font-weight: var(--terra-font-weight-semibold);
    }

    menu dd {
        font-style: italic;
    }

    terra-date-range-slider {
        grid-column: 1 / 3;
        padding-block-start: 2rem;
    }

    /* The current Giovanni API doesn't accept bounding box subsetting. */
    terra-spatial-picker::part(leaflet-bbox),
    terra-spatial-picker::part(leaflet-edit) {
        display: none;
    }

    .plot-container {
        position: relative;
    }

    dialog {
        opacity: 0;
        transition: all 0.15s ease-out;
        transition-delay: 0.4s; /* a short delay, to allow local results to be displayed without a loading icon */
        position: absolute;
        top: 20%;
        left: 0;
        z-index: 100;
    }

    dialog.open {
        opacity: 1;
    }

    @starting-style {
        dialog.open {
            opacity: 0;
        }
    }
`
