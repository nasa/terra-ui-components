import { css } from 'lit'

export default css`
    :host {
        display: block;
    }

    .data-access-info-icon {
        font-size: 16pt;
        margin-top: 0.8em;
    }

    .dasb-map-container {
        margin-left: 1em;
        border: solid 1px var(--terra-border-neutral-default);
        padding: 0.5em;
        border-radius: 4px;
        background-color: var( --terra-color-bg-surface-neutral-base);

    }

    .dasb-map-header {
        margin-left: 1em;
        margin-bottom: -0.4em;
        color: var(--terra-color-neutral-600);
    }

    .dasb-map {

        border: none;
    }

    .poly-feature-info-title {
        margin-left: 1em;
        margin-top: 0.5em;
        color: var(--terra-color-neutral-600);
    }

    .polygon-feature-info {
        font-size: smaller;
        height: calc(30vh - 2em);
        overflow-y: auto;
        border: solid 1px var(--terra-border-neutral-default);
        margin: 0em 1em 1em 1em;
        padding: 0.5em;
        border-radius: 4px;
        background-color: var(--terra-color-neutral-50);
        width: 30em;
    }

`
