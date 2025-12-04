import { css } from 'lit'

export default css`
    :host {
        background-color: var(--terra-color-carbon-5);
        display: block;
        padding-bottom: 55% !important;
        position: relative;
        width: 100%;
    }

    h3 {
        color: var(--terra-color-nasa-blue-shade);
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
        border-bottom: 1px solid var(--terra-color-carbon-30);
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
    }

    label {
        display: flex;
        line-height: var(--terra-line-height-normal);
    }

    input[type='radio'] {
        appearance: none; /* removes OS default styling */
        -webkit-appearance: none; /* for Safari */
        -moz-appearance: none; /* for Firefox */
        margin-right: 10px;
        width: 1em;
        height: 1em;
        border: 0.125em solid var(--terra-color-carbon-40);
        border-radius: 50%;
        background-color: var(--terra-color-spacesuit-white);
        cursor: pointer;
        position: relative; /* for the dot */
    }

    /* Selected state */
    input[type='radio']:checked {
        border-color: var(--terra-color-nasa-blue);
        background-color: var(--terra-color-spacesuit-white); /* keep white bg */
    }

    /* Inner dot */
    input[type='radio']:checked::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 0.5em; /* size of the dot */
        height: 0.5em;
        background-color: var(--terra-color-nasa-blue);
        border-radius: 50%; /* makes it circular */
        transform: translate(-50%, -50%); /* center it */
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

    .list-menu-dropdown terra-button::part(base) {
        border-color: transparent;
        font-weight: 700;
    }

    .variables-container aside {
        grid-area: aside;
        padding: 15px;
    }

    .variables-container aside details {
        margin-bottom: 0.5rem;
    }

    summary::marker {
        color: var(--terra-color-nasa-blue); /* changes the arrow color */
        cursor: pointer;
    }

    .variables-container main {
        grid-area: main;
        display: grid;
        grid-template-columns: 1fr 400px; /* left flexible, right fixed */
        gap: 1rem;
        min-height: 100%;
        overflow-x: auto;
        padding: 15px;
    }

    .facet {
        margin-left: 10px;
    }

    .facet label {
        align-items: center; /* vertical alignment */
        line-height: var(--terra-line-height-loose);
    }

    .facet label input[type='checkbox'] {
        appearance: none; /* removes OS default styling */
        -webkit-appearance: none; /* for Safari */
        -moz-appearance: none; /* for Firefox */
        width: 1em;
        height: 1em;
        border: 0.125em solid var(--terra-color-carbon-40);
        border-radius: 0.25em;
        background-color: var(--terra-color-spacesuit-white);
        cursor: pointer;
        position: relative;
    }

    .facet label input[type='checkbox']:checked {
        background-color: var(--terra-color-nasa-blue);
        accent-color: var(--terra-color-nasa-blue);
    }

    /* Draw the checkmark */
    .facet label input[type='checkbox']:checked::before,
    .facet label input[type='checkbox']:checked::after {
        content: '';
        position: absolute;
        height: 2px; /* thickness of the line */
        background-color: white; /* checkmark color */
        transform-origin: left center;
    }

    /* First stroke of the checkmark */
    .facet label input[type='checkbox']:checked::before {
        width: 0.37em;
        top: 38%;
        left: 23%;
        transform: rotate(45deg);
    }

    /* Second stroke of the checkmark */
    .facet label input[type='checkbox']:checked::after {
        width: 0.58em;
        top: 60%;
        left: 45%;
        transform: rotate(-49deg);
    }

    .variable-list {
        margin: 0;
        padding: 0;
        list-style: none;
    }

    .variable-list-item {
        border: 0.0625em var(--terra-color-nasa-blue-tint) solid;
        border-radius: 0.25em;
        background-color: var(--terra-color-carbon-10);
        padding: 0.5em 1em;
        margin-bottom: 0.5em;
    }

    .variable-list-item:hover {
        background-color: var(--terra-color-blue-light);
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
        display: flex;
        flex-direction: column;
        font-weight: 400;
    }

    .left-column {
        overflow-y: auto;
    }

    /* Right column (details panel) */
    .right-column {
        display: flex;
        flex-direction: column;
        background-color: var(--terra-color-blue-light);
        border: 0.0625em solid var(--terra-color-nasa-blue-tint);
        border-radius: 0.25em;
        padding: 0.5em 1em;
        box-shadow: 0 0.125em 0.25em rgb(0 0 0 / 0.075);
        padding: 1rem;
        overflow-y: auto;
    }

    .right-column h4 {
        margin-top: 0;
        margin-bottom: 1rem;
    }

    .right-column p {
        margin: 0.5rem 0;
        line-height: 1.4;
    }

    .placeholder {
        color: var(--terra-color-carbon-50);
        font-style: italic;
    }
`
