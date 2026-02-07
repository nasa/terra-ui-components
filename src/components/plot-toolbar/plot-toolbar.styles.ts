import { css } from 'lit'

export default css`
    :host {
        display: block;

        --bottom-sheet-handle-height: 5px;
        --bottom-sheet-handle-margin: 10px;
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

    .toggles[data-mobile-view='true'] .toggle::part(base) {
        background-color: antiquewhite;
        border: 0;
    }

    .square-button {
        border-radius: 0 !important; /* square corners */
        width: 2.5em;
        height: 2.5em;
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

    .bottom-sheet-backdrop {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.3);
        transition: opacity 0.35s ease;
        z-index: 10;
    }

    .bottom-sheet-backdrop[data-state='close'] {
        opacity: 0;
        pointer-events: none;
    }

    .bottom-sheet-backdrop[data-state='open'] {
        opacity: 1;
        pointer-events: all;
    }

    .bottom-sheet {
        position: fixed;
        left: 50%;
        bottom: 0;
        z-index: 1002;
        width: 100%;
        max-width: 768px;
        min-height: 50vh;
        border: 0;
        background: var(--terra-color-spacesuit-white);
        color: var(--terra-font-color-primary);
        transition: transform 0.35s cubic-bezier(0.25, 1, 0.5, 1);
        box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.2);
        will-change: transform;
        user-select: none;
        pointer-events: all;
        touch-action: none;
        overflow: auto;
        cursor: grab;
    }

    .bottom-sheet[data-state='open'] {
        display: flex;
        flex-direction: column;

        transform: translate(-50%, 0);
        visibility: visible;
    }

    .bottom-sheet[data-state='close'] {
        transform: translate(-50%, 100%);
        visibility: hidden;
    }

    .bottom-sheet-list {
        list-style: none;
        padding-left: 0.5rem;
    }

    .bottom-sheet-list li {
        padding: 0.5rem 0.3rem;
        border-bottom: 1px solid silver;
    }

    .bottom-sheet h3:not(.sr-only) {
        background-color: var(--terra-color-nasa-blue);
        color: var(--terra-color-spacesuit-white);
        padding: 0.3rem 0.7rem;
    }

    .bottom-sheet-handle {
        width: 40px;
        height: var(--bottom-sheet-handle-height);
        background-color: var(--terra-color-carbon-20);
        border-radius: 10px;
        margin: var(--bottom-sheet-handle-margin) auto;
    }

    .bottom-sheet-content {
        padding: 15px;
        height: calc(
            97vh - var(--bottom-sheet-handle-height) - var(
                    --bottom-sheet-handle-margin
                )
        );
        overflow-y: auto;
    }

    .spacer {
        padding-block: 1.375rem;
    }

    .location-text {
        cursor: pointer;
        transition: color 0.2s ease;
        display: inline-flex;
        align-items: center;
    }

    .location-icon {
        vertical-align: middle;
        color: var(--terra-color-nasa-blue);
    }

    .location-text:hover {
        color: var(--terra-color-nasa-blue);
    }

    .location-tooltip {
        position: absolute;
        top: 100%;
        left: 50px;
        z-index: 1001;
        background: white;
        border: 1px solid #ccc;
        border-radius: 0.5em;
        box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
        padding: 0.5em;
        margin-top: 0.5em;
        animation: fadeIn 0.2s ease-in-out;
        min-width: 320px;
    }

    .location-tooltip terra-map {
        height: auto !important;
    }

    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    #settings {
        opacity: 0.75;
        position: absolute;
        bottom: 150px;
        left: 10px;
        background: rgba(255, 255, 255, 0.9);
        padding: 8px 10px;
        border-radius: 4px;
        font-size: 12px;
        font-family: monospace;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
        z-index: 10;
        pointer-events: auto;
    }

    label {
        display: flex;
        align-items: center;
        gap: 8px;
    }
`
