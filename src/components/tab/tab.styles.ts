import { css } from 'lit'

export default css`
    :host {
        display: inline-block;
    }

    .tab {
        display: inline-flex;
        align-items: center;
        font-family: var(--terra-tab-font-family);
        font-size: var(--terra-tab-font-size-large);
        font-weight: var(--terra-tab-font-weight-normal);
        color: var(--terra-tab-color);
        padding: var(--terra-tab-padding-large);
        white-space: nowrap;
        user-select: none;
        -webkit-user-select: none;
        cursor: pointer;
        transition: var(--terra-transition-fast) color;
        position: relative;
    }

    .tab--small {
        font-size: var(--terra-tab-font-size-small);
        padding: var(--terra-tab-padding-small);
    }

    .tab:hover:not(.tab--disabled) {
        color: var(--terra-tab-color-hover);
    }

    :host(:focus) {
        outline: transparent;
    }

    :host(:focus-visible) {
        outline: var(--terra-focus-ring-style);
        outline-offset: var(--terra-tab-focus-ring-offset);
    }

    .tab.tab--active:not(.tab--disabled) {
        color: var(--terra-tab-color-active);
        font-weight: var(--terra-tab-font-weight-active);
    }

    .tab.tab--closable {
        padding-inline-end: var(--terra-tab-padding-closable);
    }

    .tab.tab--disabled {
        opacity: var(--terra-tab-opacity-disabled);
        cursor: not-allowed;
    }

    .tab__close-button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        background: transparent;
        border: none;
        padding: var(--terra-tab-close-button-padding);
        margin-inline-start: var(--terra-tab-close-button-margin);
        cursor: pointer;
        color: inherit;
        opacity: 0.7;
        transition: var(--terra-transition-fast) opacity;
    }

    .tab__close-button:hover {
        opacity: 1;
    }

    .tab__close-button:focus-visible {
        outline: var(--terra-focus-ring-style);
        outline-offset: 2px;
    }

    @media (forced-colors: active) {
        .tab.tab--active:not(.tab--disabled) {
            outline: solid 1px transparent;
            outline-offset: -3px;
        }
    }
`
