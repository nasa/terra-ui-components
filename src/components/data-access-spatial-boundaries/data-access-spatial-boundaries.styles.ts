import { css } from 'lit'

export default css`
    :host {
        display: block;
    }

    .dasb-map-container {
        margin-left: 1em;
        border: 1px solid var(--terra-border-primary, #9e7440);
        padding: 0.5em;
        border-radius: 4px;
        background-color: var(--terra-background-secondary, #ffffff);
    }

    .dasb-map {
        width: 100%;
        border: none;
    }

    .poly-feature-info-title {
        margin-left: 1em;
        margin-top: 0.5em;
        font-style: italic;
        color: var(--terra-text-tertiary, #6b7280);
    }

    .polygon-feature-info {
        font-size: smaller;
        max-width:30em;
        height: calc(30vh - 2em);
        overflow-y: auto;
        border: 1px solid var(--terra-border-primary, #9e7440);
        margin-left: 1em;
        padding: 0.5em;
        border-radius: 4px;
        background-color: var(--terra-background-secondary, #f5f5f5);
    }

`
