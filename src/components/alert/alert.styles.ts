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
        border-radius: var(--terra-border-radius-medium);
        font-family: var(--terra-font-family--inter);
        font-size: var(--terra-font-size-small);
        font-weight: var(--terra-font-weight-normal);
        line-height: var(--terra-alert-line-height);
        margin: inherit;
        overflow: hidden;
    }

    /* Filled appearance (HDS default) - colored background with white text */
    .alert--filled {
        background-color: var(--terra-alert-filled-background-color-primary);
        border: none;
        color: var(--terra-alert-filled-color);
    }

    .alert--filled.alert--primary {
        background-color: var(--terra-alert-filled-background-color-primary);
    }

    .alert--filled.alert--success {
        background-color: var(--terra-alert-filled-background-color-success);
    }

    .alert--filled.alert--neutral {
        background-color: var(--terra-alert-filled-background-color-neutral);
    }

    .alert--filled.alert--warning {
        background-color: var(--terra-alert-filled-background-color-warning);
    }

    .alert--filled.alert--danger {
        background-color: var(--terra-alert-filled-background-color-danger);
    }

    .alert--filled .alert__icon {
        color: var(--terra-alert-filled-icon-color);
    }

    .alert--filled .alert__close-button {
        color: var(--terra-alert-filled-icon-color);
    }

    /* White appearance - white background with colored top border */
    .alert--white {
        background-color: var(--terra-alert-white-background-color);
        border: solid var(--terra-panel-border-width) var(--terra-panel-border-color);
        border-top-width: calc(var(--terra-panel-border-width) * 3);
        color: var(--terra-alert-white-color);
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

    /* White appearance variant colors */
    .alert--white.alert--primary {
        border-top-color: var(--terra-color-nasa-blue-shade);
    }

    .alert--white.alert--primary .alert__icon {
        color: var(--terra-color-nasa-blue-shade);
    }

    .alert--white.alert--success {
        border-top-color: var(--terra-color-success-green);
    }

    .alert--white.alert--success .alert__icon {
        color: var(--terra-color-success-green);
    }

    .alert--white.alert--neutral {
        border-top-color: var(--terra-color-carbon-60);
    }

    .alert--white.alert--neutral .alert__icon {
        color: var(--terra-color-carbon-60);
    }

    .alert--white.alert--warning {
        border-top-color: var(--terra-color-international-orange);
    }

    .alert--white.alert--warning .alert__icon {
        color: var(--terra-color-international-orange);
    }

    .alert--white.alert--danger {
        border-top-color: var(--terra-color-nasa-red);
    }

    .alert--white.alert--danger .alert__icon {
        color: var(--terra-color-nasa-red);
    }

    .alert__message {
        flex: 1 1 auto;
        display: block;
        padding: var(--terra-spacing-large);
        overflow: hidden;
    }

    .alert__message ::slotted(a) {
        color: inherit !important;
        text-decoration-color: inherit !important;
    }

    .alert__message ::slotted(a):hover {
        text-decoration: none !important;
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
        display: flex;
    }

    .alert--white .alert__countdown {
        background-color: var(--terra-panel-border-color);
    }

    .alert--filled .alert__countdown {
        background-color: rgba(0, 0, 0, 0.2);
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
        background-color: var(--terra-color-carbon-60);
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
