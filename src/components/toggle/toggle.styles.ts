import { css } from 'lit'

export default css`
    :host {
        display: inline-block;
    }

    :host([size='small']) {
        --height: var(--terra-toggle-size-small);
        --thumb-size: calc(var(--terra-toggle-size-small) + 4px);
        --width: calc(var(--height) * 2);

        font-size: var(--terra-input-font-size-small);
    }

    :host([size='medium']) {
        --height: var(--terra-toggle-size-medium);
        --thumb-size: calc(var(--terra-toggle-size-medium) + 4px);
        --width: calc(var(--height) * 2);

        font-size: var(--terra-input-font-size-medium);
    }

    :host([size='large']) {
        --height: var(--terra-toggle-size-large);
        --thumb-size: calc(var(--terra-toggle-size-large) + 4px);
        --width: calc(var(--height) * 2);

        font-size: var(--terra-input-font-size-large);
    }

    .toggle {
        position: relative;
        display: inline-flex;
        align-items: center;
        font-family: var(--terra-input-font-family);
        font-size: inherit;
        font-weight: var(--terra-input-font-weight);
        color: var(--terra-toggle-label-color);
        vertical-align: middle;
        cursor: pointer;
    }

    .toggle__control {
        flex: 0 0 auto;
        position: relative;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: var(--width);
        height: var(--height);
        background-color: var(--terra-toggle-background-color-off);
        border: solid var(--terra-input-border-width)
            var(--terra-toggle-border-color-off);
        border-radius: var(--height);
        transition:
            var(--terra-transition-fast) border-color,
            var(--terra-transition-fast) background-color;
    }

    .toggle__control .toggle__thumb {
        width: var(--thumb-size);
        height: var(--thumb-size);
        background-color: var(--terra-toggle-thumb-background-color);
        border-radius: 50%;
        border: solid var(--terra-input-border-width)
            var(--terra-toggle-thumb-border-color-off);
        translate: calc((var(--width) - var(--height)) / -2);
        transition:
            var(--terra-transition-fast) translate ease,
            var(--terra-transition-fast) background-color,
            var(--terra-transition-fast) border-color,
            var(--terra-transition-fast) box-shadow;
    }

    .toggle__input {
        position: absolute;
        opacity: 0;
        padding: 0;
        margin: 0;
        pointer-events: none;
    }

    /* Hover */
    .toggle:not(.toggle--checked):not(.toggle--disabled) .toggle__control:hover {
        background-color: var(--terra-toggle-background-color-off);
        border-color: var(--terra-toggle-border-color-off);
    }

    .toggle:not(.toggle--checked):not(.toggle--disabled)
        .toggle__control:hover
        .toggle__thumb {
        background-color: var(--terra-toggle-thumb-background-color);
        border-color: var(--terra-toggle-thumb-border-color-off);
    }

    /* Focus */
    .toggle:not(.toggle--checked):not(.toggle--disabled)
        .toggle__input:focus-visible
        ~ .toggle__control {
        background-color: var(--terra-toggle-background-color-off);
        border-color: var(--terra-toggle-border-color-off);
    }

    .toggle:not(.toggle--checked):not(.toggle--disabled)
        .toggle__input:focus-visible
        ~ .toggle__control
        .toggle__thumb {
        background-color: var(--terra-toggle-thumb-background-color);
        border-color: var(--terra-toggle-focus-ring-color);
        outline: var(--terra-focus-ring);
        outline-offset: var(--terra-focus-ring-offset);
    }

    /* Checked */
    .toggle--checked .toggle__control {
        background-color: var(--terra-toggle-background-color-on);
        border-color: var(--terra-toggle-border-color-on);
    }

    .toggle--checked .toggle__control .toggle__thumb {
        background-color: var(--terra-toggle-thumb-background-color);
        border-color: var(--terra-toggle-thumb-border-color-on);
        translate: calc((var(--width) - var(--height)) / 2);
    }

    /* Checked + hover */
    .toggle.toggle--checked:not(.toggle--disabled) .toggle__control:hover {
        background-color: var(--terra-toggle-background-color-on);
        border-color: var(--terra-toggle-border-color-on);
    }

    .toggle.toggle--checked:not(.toggle--disabled)
        .toggle__control:hover
        .toggle__thumb {
        background-color: var(--terra-toggle-thumb-background-color);
        border-color: var(--terra-toggle-thumb-border-color-on);
    }

    /* Checked + focus */
    .toggle.toggle--checked:not(.toggle--disabled)
        .toggle__input:focus-visible
        ~ .toggle__control {
        background-color: var(--terra-toggle-background-color-on);
        border-color: var(--terra-toggle-border-color-on);
    }

    .toggle.toggle--checked:not(.toggle--disabled)
        .toggle__input:focus-visible
        ~ .toggle__control
        .toggle__thumb {
        background-color: var(--terra-toggle-thumb-background-color);
        border-color: var(--terra-toggle-focus-ring-color);
        outline: var(--terra-focus-ring);
        outline-offset: var(--terra-focus-ring-offset);
    }

    /* Disabled */
    .toggle--disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    .toggle__label {
        display: inline-block;
        line-height: var(--height);
        margin-inline-start: 0.5em;
        user-select: none;
        -webkit-user-select: none;
    }

    :host([required]) .toggle__label::after {
        content: var(--terra-input-required-content);
        color: var(--terra-input-required-content-color);
        margin-inline-start: var(--terra-input-required-content-offset);
    }

    @media (forced-colors: active) {
        .toggle.toggle--checked:not(.toggle--disabled)
            .toggle__control:hover
            .toggle__thumb,
        .toggle--checked .toggle__control .toggle__thumb {
            background-color: ButtonText;
        }
    }
`
