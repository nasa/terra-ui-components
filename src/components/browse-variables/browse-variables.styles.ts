import { css } from 'lit'

export default css`
    :host {
        --light-blue-color: color-mix(
            in hsl,
            var(--terra-color-nasa-blue-tint) 65%,
            white
        ); /* this color doesn't exist in HDS, perhaps the design should change? */

        background-color: var(--terra-color-nasa-blue-dark);
        color: white;
        display: block;
        padding-bottom: 55% !important;
        position: relative;
        width: 100%;
    }

    h3 {
        color: var(--light-blue-color);
        margin-bottom: 1rem;
    }

    dialog {
        position: absolute;
        z-index: 999;
        width: 100px;
        height: 100px;
        padding: 0;
        place-self: center;
    }

    .container {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        display: grid;
        grid-template-rows: auto 1fr;
    }

    .scrollable {
        overflow-y: auto;
        display: grid;
        grid-template-columns: 250px 1fr;
        grid-column: span 2;
        width: 100%;
    }

    header.search {
        border-bottom: 1px solid var(--terra-color-nasa-blue-shade);
        grid-column: span 2;
        padding: 15px;
        padding-bottom: 25px;
        display: flex;
        gap: 10px;
    }

    header.search button {
        width: 36px;
        height: 36px;
    }

    .browse-by-category aside {
        padding: 0 15px;
    }

    .browse-by-category main {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(0, 1fr));
        gap: 2rem;
        min-width: 800px;
        overflow-x: auto;
    }

    .column {
        min-width: 0; /* Prevents overflow issues */
    }

    .browse-by-category ul {
        padding: 0;
    }

    .browse-by-category ul ::marker {
        font-size: 0; /*Safari removes the semantic meaning / role of the list if we remove the list style. */
    }

    .browse-by-category li {
        border-radius: 4px;
        cursor: pointer;
        margin: 0;
        margin-bottom: 0.5rem;
        padding: 8px;
        transition: background-color 0.15s;
    }

    .browse-by-category li:hover {
        background-color: rgba(255, 255, 255, 0.1);
    }

    .browse-by-category terra-button {
        margin-top: 15px;
    }

    .browse-by-category terra-button::part(base) {
        color: white;
    }

    label {
        color: white;
        display: flex;
        align-items: center;
    }

    input[type='radio'] {
        margin-right: 10px;
    }

    .variables-container {
        display: grid;
        grid-template-areas:
            'header header'
            'aside main';
        grid-template-columns: 250px 1fr;
        grid-template-rows: auto 1fr;
    }

    .variables-container header {
        grid-area: header;
        padding: 15px;
        padding-bottom: 0;
        display: flex;
        justify-content: space-between;
    }

    .variables-container header menu {
        display: inline-flex;
        padding: 0;
        margin: 0;
        min-width: 24em;
        justify-content: space-evenly;
    }

    .variables-container header menu ::marker {
        font-size: 0;
    }

    .list-menu-dropdown sl-button::part(base) {
        border-color: transparent;
        font-weight: 700;
    }

    .variables-container aside {
        grid-area: aside;
        padding: 15px;
    }

    .variables-container main {
        grid-area: main;
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(0, 1fr));
        gap: 2rem;
        overflow-x: auto;
        padding: 15px;
    }

    .facet {
        margin-left: 10px;
    }

    .variable-list {
        margin: 0;
        padding: 0;
    }

    .variable-list-item {
    }

    .variable-list-item::marker {
        font-size: 0;
    }

    .variable[open] .details-panel {
        height: max-content;
    }

    .variable input[type='checkbox'] {
        margin-block: 0.25em;
        margin-inline: 0 0.5em;
    }

    .variable {
        display: flex;
        justify-content: space-between;
    }

    .variable a {
        color: white;
    }

    .variable label {
        cursor: pointer;
        display: block;
        font-weight: 400;
    }

    .variable sl-drawer {
        font-style: italic;
    }

    .variable sl-drawer::part(base) {
        --body-spacing: 0.25em;
        --header-spacing: 0.25em;
        --footer-spacing: 1em 0;
    }

    .variable sl-drawer::part(header-actions) {
        --header-spacing: 0.25em;

        align-items: flex-start;
        margin-block-start: 1em;
        margin-inline-end: 0.5em;
    }

    .variable sl-drawer::part(close-button__base) {
        --sl-focus-ring: var(--terra-focus-ring);
        --sl-focus-ring-offset: var(--terra-focus-ring-offset);
    }

    .variable sl-drawer::part(panel) {
        background-color: var(--terra-color-nasa-blue-shade);
        border: 0.0625em solid var(--terra-color-carbon-10);
        left: auto;
        right: 0;
        top: 4.25rem;
    }

    .variable sl-drawer::part(body) {
        padding-block-end: 6em;
    }

    .variable sl-drawer > * {
        margin-block-start: 0;
    }

    .variable sl-drawer h4 {
        font-weight: 400;
    }

    .variable-details-button {
        position: static;
    }

    .variable-details-button::part(base) {
        border-color: transparent;
        color: var(--spacesuit-white);
    }
`
