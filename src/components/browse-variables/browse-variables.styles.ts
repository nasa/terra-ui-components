import { css } from 'lit'

export default css`
    :host {
        background-color: var(--terra-color-bg-surface-neutral-primary);
        display: block;
        padding-bottom: 55% !important;
        position: relative;
        width: 100%;
    }

    h3 {
        color: var(--terra-text-brand-on-primary);
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

    @media (max-width: 768px) {
        .container {
            position: relative;
            top: auto;
            right: auto;
            bottom: auto;
            left: auto;
            height: auto;
            min-height: 0;

            grid-template-rows: auto auto;
        }
    }
    .scrollable {
        overflow-y: auto;
        display: grid;
        grid-template-columns: 250px 1fr;
        grid-column: span 2;
        width: 100%;
    }

    header.search {
        border-bottom: 1px solid var(--terra-border-neutral-default, #e9ecef);
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

    @media (max-width: 768px) {
        .browse-by-category {
            grid-template-areas:
                'aside'
                'main';
            grid-template-columns: 1fr;
        }

        .browse-by-category main {
            grid-template-columns: 1fr;
            gap: 1rem;
            min-width: 0;
            padding: 0 15px;
            margin-top: 10px;
        }

        .browse-by-category h3 {
            margin: 5px 0;
        }

        .browse-by-category ul {
            margin-top: 0;
            margin-bottom: 0;
        }

        .browse-by-category li {
            padding: 0px;
            margin-bottom: 2px;
            margin-left: 5px;
        }
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
        border: 0.125em solid var(--terra-radio-border-color);
        border-radius: 50%;
        background-color: var(--terra-radio-background-color);
        cursor: pointer;
        position: relative; /* for the dot */
    }

    /* Selected state */
    input[type='radio']:checked {
        border-color: var(--terra-radio-border-color-checked);
        background-color: var(--terra-radio-background-color); /* keep white bg */
    }

    /* Inner dot */
    input[type='radio']:checked::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 0.5em; /* size of the dot */
        height: 0.5em;
        background-color: var(--terra-radio-background-color-checked);
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

    .variables-container header .research-area {
        display: flex;
        justify-content: flex-start;
    }

    .variables-container header menu {
        display: inline-flex;
        padding: 0;
        margin: 0;
        /* min-width: 24em; */
        justify-content: flex-end;
    }

    .variables-container header menu ::marker {
        font-size: 0;
    }

    @media (max-width: 768px) {
        .variables-container header {
            display: flex;
            flex-wrap: wrap;
            row-gap: 0.5rem;
        }

        .variables-container header .research-area {
            flex: 0 1 auto;
            min-width: 0;
            white-space: wrap;
        }

        .variables-container header menu {
            flex: 0 0 auto;
            white-space: nowrap;
        }
    }

    .list-menu-dropdown terra-button::part(base) {
        border-color: transparent;
        font-weight: 700;
    }

    .variables-container aside {
        grid-area: aside;
        padding: 8px 15px 5px;
        overflow-y: auto;
        height: max-content;
    }

    .variables-container aside details {
        margin-bottom: 0.5rem;
    }

    summary::marker {
        color: var(--terra-text-brand-on-primary); /* changes the arrow color */
        cursor: pointer;
    }

    .variables-container main {
        grid-area: main;
        display: grid;
        grid-template-columns: 1fr;
        gap: 1rem;
        min-height: 100%;
        overflow-x: auto;
        padding: 15px;
    }

    .variables-container main:has(.variable-details) {
        grid-template-columns: 1fr 400px;
    }

    @media (max-width: 768px) {
        .variables-container {
            grid-template-areas:
                'header'
                'aside'
                'main';
            grid-template-columns: 1fr;
            grid-template-rows: auto auto 1fr;
        }

        .variables-container > header,
        .variables-container > aside,
        .variables-container > main {
            min-width: 0;
            width: 100%;
            max-width: 100%;
            box-sizing: border-box;
        }

        .variables-container aside {
            height: min-content;
        } 

        .variables-container main {
            grid-template-columns: minmax(0, 1fr);
            min-width: 0;
            min-height: 0;
            width: 100%;
            height: min-content;
            padding: 5px 15px;
            box-sizing: border-box;
            overflow-x: hidden;
        }

        .variables-container main:has(.variable-details) {
            grid-template-columns: 1fr;
        }
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
        border: 0.125em solid var(--terra-checkbox-border-color);
        border-radius: 0.25em;
        background-color: var(--terra-checkbox-background-color);
        cursor: pointer;
        position: relative;
    }

    .facet label input[type='checkbox']:checked {
        background-color: var(--terra-checkbox-background-color-checked);
        accent-color: var(--terra-checkbox-background-color-checked);
    }

    /* Draw the checkmark */
    .facet label input[type='checkbox']:checked::before,
    .facet label input[type='checkbox']:checked::after {
        content: '';
        position: absolute;
        height: 2px; /* thickness of the line */
        background-color: var(--terra-checkbox-icon-color); /* checkmark color */
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
        /* border: 0.0625em var(--terra-color-nasa-blue-tint) solid; */
        border-radius: 0.25em;
        background-color: var(--terra-color-bg-surface-neutral-secondary);
        padding: 0.5em 1em;
        margin-bottom: var(--terra-spacing-2x-small);
    }

    .variable-list-item label {
        color: var(--terra-text-secondary);
    }

    .variable-list-item:hover {
        background-color: var(--terra-color-bg-info-subtle);
    }

    .variable-list-item:hover label {
        color: var(--terra-text-secondary);
    }

    .variable-list-item::marker {
        font-size: 0;
    }

    @media (max-width: 768px) {
        .variable-list {
            width: 100%;
            min-width: 0;
        }
        .variable-list-item {
            width: 100%;
            min-width: 0;
            box-sizing: border-box;
            overflow: hidden;
            overflow-wrap: anywhere;
        }
    }

    .variable[open] .details-panel {
        height: max-content;
    }

    .variable input[type='checkbox'] {
        margin-block: 0.5em;
        margin-inline: 0 0.5em;
        align-self: flex-start;
    }

    .variable {
        display: flex;
        justify-content: space-between;
    }

    @media (max-width: 768px) {
        .variable {
            justify-content: flex-start;
        }
    }

    .variable a {
        color: white;
    }

    .variable label {
        cursor: pointer;
        display: flex;
        flex-direction: row;
        font-weight: 400;
    }

    @media (max-width: 768px) {
        .variable label {
            flex-direction: column;
            justify-content: flex-start;
        }
    }

    .variable label input[type='checkbox'] {
        align-self: flex-start;
        margin-top: 0.40em;
    }

    .resolution-info {
        padding-inline-start: 16px;
    }
    
    .left-column {
        /* overflow-y: auto; */
    }

    .variable-details {
        display: flex;
        flex-direction: column;
        background-color: var(--terra-color-bg-info-subtle);
        color: var(--terra-text-secondary);
        border-radius: 0.25em;
        padding: 0.5em 1em;
    }

    @media (max-width: 768px) {
        .variable-details {
            width: 100%;
            min-width: 0;
            padding: 0.5em 0.0em;
            box-sizing: border-box;
            overflow: hidden;
            overflow-wrap: anywhere;
            background-color: none;
        }
        .variable-details span {
            display: grid;
            grid-template-columns: 1fr 30px;
            align-items: center;
            gap: 0.5em;
        }
    }

    .variable-details h4 {
        margin-top: 0;
        margin-bottom: 1rem;
    }

    .variable-details label {
        color: var(--terra-text-primary);
    }

    .variable-details p {
        margin: 0.5rem 0;
        line-height: 1.4;
    }

    .placeholder {
        color: var(--terra-text-secondary);
        font-style: italic;
    }

    .sticky-element {
        position: sticky;
        /* For older browsers, consider adding: */
        position: -webkit-sticky;
        top: 0; /* Sticks to the top of the viewport when scrolled to */
    }
`
