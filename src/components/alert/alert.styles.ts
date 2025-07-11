import { css } from 'lit'

export default css`
    :host {
        display: contents;

        /* For better DX, we'll reset the margin here so the base part can inherit it */
        margin: 0;
    }

    .alert {
        position: relative;
        display: flex;
        align-items: stretch;
        background-color: var(--terra-panel-background-color);
        border: solid var(--terra-panel-border-width) var(--terra-panel-border-color);
        border-top-width: calc(var(--terra-panel-border-width) * 3);
        border-radius: var(--terra-border-radius-medium);
        font-family: var(--terra-font-sans);
        font-size: var(--terra-font-size-small);
        font-weight: var(--terra-font-weight-normal);
        line-height: 1.6;
        color: var(--terra-color-neutral-700);
        margin: inherit;
        overflow: hidden;
    }

    .alert:not(.alert--has-icon) .alert__icon,
    .alert:not(.alert--closable) .alert__close-button {
        display: none;
    }

    .alert__icon {
        flex: 0 0 auto;
        display: flex;
        align-items: center;
        font-size: var(--terra-font-size-large);
        padding-inline-start: var(--terra-spacing-large);
    }

    .alert--has-countdown {
        border-bottom: none;
    }

    .alert--primary {
        border-top-color: var(--terra-color-nasa-blue-shade);
    }

    .alert--primary .alert__icon {
        color: var(--terra-color-nasa-blue-shade);
    }

    .alert--success {
        border-top-color: var(--terra-color-success-green);
    }

    .alert--success .alert__icon {
        color: var(--terra-color-success-green);
    }

    .alert--neutral {
        border-top-color: var(--terra-color-neutral-600);
    }

    .alert--neutral .alert__icon {
        color: var(--terra-color-neutral-600);
    }

    .alert--warning {
        border-top-color: var(--terra-color-international-orange);
    }

    .alert--warning .alert__icon {
        color: var(--terra-color-international-orange);
    }

    .alert--danger {
        border-top-color: var(--terra-color-nasa-red);
    }

    .alert--danger .alert__icon {
        color: var(--terra-color-nasa-red);
    }

    .alert__message {
        flex: 1 1 auto;
        display: block;
        padding: var(--terra-spacing-large);
        overflow: hidden;
    }

    .alert__close-button {
        flex: 0 0 auto;
        display: flex;
        align-items: center;
        font-size: var(--terra-font-size-medium);
        margin-inline-end: var(--terra-spacing-medium);
        align-self: center;
    }

    .alert__countdown {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: calc(var(--terra-panel-border-width) * 3);
        background-color: var(--terra-panel-border-color);
        display: flex;
    }

    .alert__countdown--ltr {
        justify-content: flex-end;
    }

    .alert__countdown .alert__countdown-elapsed {
        height: 100%;
        width: 0;
    }

    .alert--primary .alert__countdown-elapsed {
        background-color: var(--terra-color-nasa-blue-shade);
    }

    .alert--success .alert__countdown-elapsed {
        background-color: var(--terra-color-success-green);
    }

    .alert--neutral .alert__countdown-elapsed {
        background-color: var(--terra-color-neutral-600);
    }

    .alert--warning .alert__countdown-elapsed {
        background-color: var(--terra-color-international-orange);
    }

    .alert--danger .alert__countdown-elapsed {
        background-color: var(--terra-color-nasa-red);
    }

    .alert__timer {
        display: none;
    }
`
