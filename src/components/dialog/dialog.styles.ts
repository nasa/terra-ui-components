import { css } from 'lit'

export default css`
    :host {
        --width: fit-content;
        --header-spacing: var(--terra-spacing-large);
        --body-spacing: var(--terra-spacing-large);
        --footer-spacing: var(--terra-spacing-large);

        display: contents;
    }

    .dialog {
        display: flex;
        align-items: center;
        justify-content: center;
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: var(--terra-z-index-dialog);
    }

    .dialog__panel {
        display: flex;
        flex-direction: column;
        z-index: 2;
        width: var(--width);
        min-width: 20rem;
        max-width: calc(100% - var(--terra-spacing-2x-large));
        max-height: calc(100% - var(--terra-spacing-2x-large));
        background-color: var(--terra-panel-background-color);
        border-radius: var(--terra-border-radius-medium);
        box-shadow: var(--terra-shadow-x-large);
    }

    .dialog__panel:focus {
        outline: none;
    }

    /* Ensure there's enough vertical padding for phones that don't update vh when chrome appears (e.g. iPhone) */
    @media screen and (max-width: 420px) {
        .dialog__panel {
            max-height: 80vh;
        }
    }

    .dialog--open .dialog__panel {
        display: flex;
        opacity: 1;
    }

    .dialog__header {
        flex: 0 0 auto;
        display: flex;
    }

    .dialog__title {
        flex: 1 1 auto;
        font: inherit;
        font-size: var(--terra-font-size-large);
        line-height: var(--terra-line-height-dense);
        padding: var(--header-spacing);
        margin: 0;
    }

    .dialog__header-actions {
        flex-shrink: 0;
        display: flex;
        flex-wrap: wrap;
        justify-content: end;
        gap: var(--terra-spacing-2x-small);
        padding: 0 var(--header-spacing);
    }

    .dialog__header-actions terra-button,
    .dialog__header-actions ::slotted(terra-button) {
        flex: 0 0 auto;
        display: flex;
        align-items: center;
        font-size: var(--terra-font-size-medium);
    }

    .dialog__body {
        flex: 1 1 auto;
        display: block;
        padding: var(--body-spacing);
        overflow: auto;
        -webkit-overflow-scrolling: touch;
    }

    .dialog__footer {
        flex: 0 0 auto;
        text-align: right;
        padding: var(--footer-spacing);
    }

    .dialog__footer ::slotted(terra-button:not(:first-of-type)) {
        margin-inline-start: var(--terra-spacing-x-small);
    }

    .dialog:not(.dialog--has-footer) .dialog__footer {
        display: none;
    }

    .dialog__overlay {
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        background-color: var(--terra-overlay-background-color);
    }

    @media (forced-colors: active) {
        .dialog__panel {
            border: solid 1px var(--terra-color-spacesuit-white);
        }
    }
`
