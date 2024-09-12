import { css } from 'lit'

export default css`
    :host {
        display: inline-block;
        position: relative;
        width: auto;
        cursor: pointer;
    }

    .button {
        display: inline-flex;
        align-items: stretch;
        justify-content: center;
        width: 100%;
        border-style: solid;
        border-width: var(--terra-button-border-width);
        font-family: var(--terra-font-family--inter);
        font-weight: var(--terra-font-weight-bold);
        text-decoration: none;
        user-select: none;
        -webkit-user-select: none;
        white-space: nowrap;
        vertical-align: middle;
        padding: 0;
        transition:
            var(--terra-transition-x-fast) background-color,
            var(--terra-transition-x-fast) color,
            var(--terra-transition-x-fast) border,
            var(--terra-transition-x-fast) box-shadow;
        cursor: inherit;
    }

    .button::-moz-focus-inner {
        border: 0;
    }

    .button:focus {
        outline: none;
    }

    .button:focus-visible {
        outline: var(--terra-focus-ring);
        outline-offset: var(--terra-focus-ring-offset);
    }

    .button--disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    /* When disabled, prevent mouse events from bubbling up from children */
    .button--disabled * {
        pointer-events: none;
    }

    .button__prefix,
    .button__suffix {
        flex: 0 0 auto;
        display: flex;
        align-items: center;
        pointer-events: none;
    }

    .button__label {
        flex: 0 0 auto;
        display: flex;
        align-items: center;
        pointer-events: none;
    }

    .button__label::slotted(terra-icon) {
        vertical-align: -2px;
    }

    /*
   * Standard buttons
   */

    /* Default */
    .button--standard.button--default {
        background-color: var(--terra-color-default-gray);
        border-color: var(--terra-color-default-gray);
        color: var(--terra-color-spacesuit-white);
    }

    .button--standard.button--default:hover:not(.button--disabled) {
        background-color: var(--terra-color-default-gray-shade);
        border-color: var(--terra-color-default-gray-shade);
        color: var(--terra-color-spacesuit-white);
    }

    .button--standard.button--default:active:not(.button--disabled) {
        background-color: var(--terra-color-default-gray-tint);
        border-color: var(--terra-color-default-gray-tint);
        color: var(--terra-color-spacesuit-white);
    }

    /* Primary */
    .button--standard.button--primary {
        background-color: var(--terra-color-nasa-blue);
        border-color: var(--terra-color-nasa-blue);
        color: var(--terra-color-spacesuit-white);
    }

    .button--standard.button--primary:hover:not(.button--disabled) {
        background-color: var(--terra-color-nasa-blue-shade);
        border-color: var(--terra-color-nasa-blue-shade);
        color: var(--terra-color-spacesuit-white);
    }

    .button--standard.button--primary:active:not(.button--disabled) {
        background-color: var(--terra-color-nasa-blue-tint);
        border-color: var(--terra-color-nasa-blue-tint);
        color: var(--terra-color-spacesuit-white);
    }

    /* Success */
    .button--standard.button--success {
        background-color: var(--terra-color-success-green);
        border-color: var(--terra-color-success-green);
        color: var(--terra-color-spacesuit-white);
    }

    .button--standard.button--success:hover:not(.button--disabled) {
        background-color: var(--terra-color-success-green-hover);
        border-color: var(--terra-color-success-green-hover);
        color: var(--terra-color-spacesuit-white);
    }

    .button--standard.button--success:active:not(.button--disabled) {
        background-color: var(--terra-color-success-green-focus);
        border-color: var(--terra-color-success-green-focus);
        color: var(--terra-color-spacesuit-white);
    }

    /* Warning */
    .button--standard.button--warning {
        background-color: var(--terra-color-international-orange);
        border-color: var(--terra-color-international-orange);
        color: var(--terra-color-spacesuit-white);
    }

    .button--standard.button--warning:hover:not(.button--disabled) {
        background-color: var(--terra-color-international-orange-shade);
        border-color: var(--terra-color-international-orange-shade);
        color: var(--terra-color-spacesuit-white);
    }

    .button--standard.button--warning:active:not(.button--disabled) {
        background-color: var(--terra-color-international-orange-tint);
        border-color: var(--terra-color-international-orange-tint);
        color: var(--terra-color-spacesuit-white);
    }

    /* Danger */
    .button--standard.button--danger {
        background-color: var(--terra-color-nasa-red);
        border-color: var(--terra-color-nasa-red);
        color: var(--terra-color-spacesuit-white);
    }

    .button--standard.button--danger:hover:not(.button--disabled) {
        background-color: var(--terra-color-nasa-red-shade);
        border-color: var(--terra-color-nasa-red-shade);
        color: var(--terra-color-spacesuit-white);
    }

    .button--standard.button--danger:active:not(.button--disabled) {
        background-color: var(--terra-color-nasa-red-tint);
        border-color: var(--terra-color-nasa-red-tint);
        color: var(--terra-color-spacesuit-white);
    }

    /*
   * Outline buttons
   */

    .button--outline {
        background: none;
    }

    /* Primary */
    .button--outline.button--primary {
        border-color: var(--terra-color-nasa-blue);
        color: var(--terra-button-outline-text-color);
    }

    .button--outline.button--primary:hover:not(.button--disabled),
    .button--outline.button--default.button--checked:not(.button--disabled) {
        border-color: var(--terra-color-nasa-blue);
        background-color: var(--terra-color-nasa-blue);
        color: var(--terra-color-spacesuit-white);
    }

    .button--outline.button--primary:active:not(.button--disabled) {
        border-color: var(--terra-color-nasa-blue-tint);
        background-color: var(--terra-color-nasa-blue-tint);
        color: var(--terra-color-spacesuit-white);
    }

    /* Default */
    .button--outline.button--default {
        border-color: var(--terra-color-default-gray);
        color: var(--terra-button-outline-text-color);
    }

    .button--outline.button--default:hover:not(.button--disabled),
    .button--outline.button--default.button--checked:not(.button--disabled) {
        border-color: var(--terra-color-default-gray);
        background-color: var(--terra-color-default-gray);
        color: var(--terra-color-spacesuit-white);
    }

    .button--outline.button--default:active:not(.button--disabled) {
        border-color: var(--terra-color-default-gray-tint);
        background-color: var(--terra-color-default-gray-tint);
        color: var(--terra-color-spacesuit-white);
    }

    /* Success */
    .button--outline.button--success {
        border-color: var(--terra-color-success-green);
        color: var(--terra-button-outline-text-color);
    }

    .button--outline.button--success:hover:not(.button--disabled),
    .button--outline.button--success.button--checked:not(.button--disabled) {
        background-color: var(--terra-color-success-green);
        color: var(--terra-color-spacesuit-white);
    }

    .button--outline.button--success:active:not(.button--disabled) {
        border-color: var(--terra-color-success-green-focus);
        background-color: var(--terra-color-success-green-focus);
        color: var(--terra-color-spacesuit-white);
    }

    /* Warning */
    .button--outline.button--warning {
        border-color: var(--terra-color-international-orange);
        color: var(--terra-button-outline-text-color);
    }

    .button--outline.button--warning:hover:not(.button--disabled),
    .button--outline.button--warning.button--checked:not(.button--disabled) {
        background-color: var(--terra-color-international-orange);
        color: var(--terra-color-spacesuit-white);
    }

    .button--outline.button--warning:active:not(.button--disabled) {
        border-color: var(--terra-color-international-orange-tint);
        background-color: var(--terra-color-international-orange-tint);
        color: var(--terra-color-spacesuit-white);
    }

    /* Danger */
    .button--outline.button--danger {
        border-color: var(--terra-color-nasa-red);
        color: var(--terra-button-outline-text-color);
    }

    .button--outline.button--danger:hover:not(.button--disabled),
    .button--outline.button--danger.button--checked:not(.button--disabled) {
        background-color: var(--terra-color-nasa-red);
        color: var(--terra-color-spacesuit-white);
    }

    .button--outline.button--danger:active:not(.button--disabled) {
        border-color: var(--terra-color-nasa-red-tint);
        background-color: var(--terra-color-nasa-red-tint);
        color: var(--terra-color-spacesuit-white);
    }

    @media (forced-colors: active) {
        .button.button--outline.button--checked:not(.button--disabled) {
            outline: solid 2px transparent;
        }
    }

    /*
   * Text buttons
   */

    .button--text {
        background-color: transparent;
        border-color: transparent;
        color: var(--terra-button-text-text-color);
    }

    .button--text:hover:not(.button--disabled) {
        background-color: transparent;
        border-color: transparent;
        color: var(--terra-button-text-text-color-hover);
    }

    .button--text:focus-visible:not(.button--disabled) {
        background-color: transparent;
        border-color: transparent;
        color: var(--terra-color-nasa-blue);
    }

    .button--text:active:not(.button--disabled) {
        background-color: transparent;
        border-color: transparent;
        color: var(--terra-color-nasa-blue-tint);
    }

    /*
   * Page Link buttons
   */

    .button--pagelink {
        background-color: transparent;
        border-color: transparent;
        color: var(--terra-button-page-link-text);
        & slot[name='suffix'] span {
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: var(--terra-color-nasa-red);
            color: var(--terra-color-spacesuit-white);
            padding-left: 0;
            padding-right: 0;
        }
    }

    .button--pagelink:hover:not(.button--disabled) slot[name='suffix'] span {
        background-color: var(--terra-color-nasa-red-shade);
    }

    .button--pagelink.button--small {
        & slot[part='label'] {
            padding-right: 0.3rem;
            font-size: 1rem;
        }
        & slot[name='suffix'] span {
            height: var(--terra-icon-small);
            width: var(--terra-icon-small);
            border-radius: 50%;
        }
    }

    .button--pagelink.button--medium {
        & slot[part='label'] {
            padding-right: 0.4rem;
            font-size: 1.4rem;
        }
        & slot[name='suffix'] span {
            height: var(--terra-icon-medium);
            width: var(--terra-icon-medium);
            border-radius: 50%;
        }
    }

    .button--pagelink.button--large {
        & slot[part='label'] {
            padding-right: 0.5rem;
            font-size: 1.8rem;
        }
        & slot[name='suffix'] span {
            height: var(--terra-icon-large);
            width: var(--terra-icon-large);
            border-radius: 50%;
        }
    }

    /*
   * Size modifiers
   */

    .button--small {
        height: auto;
        min-height: var(--terra-button-height-small);
        font-size: var(--terra-button-font-size-small);
        line-height: calc(
            var(--terra-button-height-small) - var(--terra-button-border-width) * 2
        );
        border-radius: var(--terra-input-border-radius-small);
    }

    .button--medium {
        height: auto;
        min-height: var(--terra-button-height-medium);
        font-size: var(--terra-button-font-size-medium);
        line-height: calc(
            var(--terra-button-height-medium) - var(--terra-button-border-width) * 2
        );
        border-radius: var(--terra-input-border-radius-medium);
    }

    .button--large {
        height: auto;
        min-height: var(--terra-button-height-large);
        font-size: var(--terra-button-font-size-large);
        line-height: calc(
            var(--terra-button-height-large) - var(--terra-button-border-width) * 2
        );
        border-radius: var(--terra-input-border-radius-large);
    }

    /*
   * Circle modifier
   */

    .button--circle {
        padding-left: 0;
        padding-right: 0;
    }

    .button--circle.button--small {
        height: var(--terra-button-height-small);
        width: var(--terra-button-height-small);
        border-radius: 50%;
    }

    .button--circle.button--medium {
        height: var(--terra-button-height-medium);
        width: var(--terra-button-height-medium);
        border-radius: 50%;
    }

    .button--circle.button--large {
        height: var(--terra-button-height-medium);
        width: var(--terra-button-height-large);
        border-radius: 50%;
    }

    .button--circle .button__prefix,
    .button--circle .button__suffix,
    .button--circle .button__caret {
        display: none;
    }

    /*
   * Caret modifier
   */

    .button--caret .button__suffix {
        display: none;
    }

    .button--caret .button__caret {
        height: auto;
    }

    /*
   * Loading modifier
   */

    .button--loading {
        position: relative;
        cursor: wait;
    }

    .button--loading .button__prefix,
    .button--loading .button__label,
    .button--loading .button__suffix,
    .button--loading .button__caret {
        visibility: hidden;
    }

    .button--loading sl-spinner {
        --indicator-color: currentColor;
        position: absolute;
        font-size: 1em;
        height: 1em;
        width: 1em;
        top: calc(50% - 0.5em);
        left: calc(50% - 0.5em);
    }

    /*
   * Badges
   */

    .button ::slotted(sl-badge) {
        position: absolute;
        top: 0;
        right: 0;
        translate: 50% -50%;
        pointer-events: none;
    }

    .button--rtl ::slotted(sl-badge) {
        right: auto;
        left: 0;
        translate: -50% -50%;
    }

    /*
   * Button spacing
   */

    .button--has-label.button--small .button__label {
        padding: 0 var(--terra-spacing-small);
    }

    .button--has-label.button--medium .button__label {
        padding: 0 var(--terra-spacing-medium);
    }

    .button--has-label.button--large .button__label {
        padding: 0 var(--terra-spacing-large);
    }

    .button--has-prefix.button--small {
        padding-inline-start: var(--terra-spacing-x-small);
    }

    .button--has-prefix.button--small .button__label {
        padding-inline-start: var(--terra-spacing-x-small);
    }

    .button--has-prefix.button--medium {
        padding-inline-start: var(--terra-spacing-small);
    }

    .button--has-prefix.button--medium .button__label {
        padding-inline-start: var(--terra-spacing-small);
    }

    .button--has-prefix.button--large {
        padding-inline-start: var(--terra-spacing-small);
    }

    .button--has-prefix.button--large .button__label {
        padding-inline-start: var(--terra-spacing-small);
    }

    .button--has-suffix.button--small,
    .button--caret.button--small {
        padding-inline-end: var(--terra-spacing-x-small);
    }

    .button--has-suffix.button--small .button__label,
    .button--caret.button--small .button__label {
        padding-inline-end: var(--terra-spacing-x-small);
    }

    .button--has-suffix.button--medium,
    .button--caret.button--medium {
        padding-inline-end: var(--terra-spacing-small);
    }

    .button--has-suffix.button--medium .button__label,
    .button--caret.button--medium .button__label {
        padding-inline-end: var(--terra-spacing-small);
    }

    .button--has-suffix.button--large,
    .button--caret.button--large {
        padding-inline-end: var(--terra-spacing-small);
    }

    .button--has-suffix.button--large .button__label,
    .button--caret.button--large .button__label {
        padding-inline-end: var(--terra-spacing-small);
    }

    /* Shape modifier

    * Button radius overrides used to control the edge shape when button is not in a terra-button-group. 
    * Useful for integrating buttons into input form controls such as drop-down lists, search fields.
    */
    .button--square-right {
        border-start-end-radius: 0;
        border-end-end-radius: 0;
    }

    .button--square {
        border-start-start-radius: 0;
        border-start-end-radius: 0;
        border-end-start-radius: 0;
        border-end-end-radius: 0;
    }

    .button--square-left {
        border-start-start-radius: 0;
        border-end-start-radius: 0;
    }

    /*
   * Button groups support a variety of button types (e.g. buttons with tooltips, buttons as dropdown triggers, etc.).
   * This means buttons aren't always direct descendants of the button group, thus we can't target them with the
   * ::slotted selector. To work around this, the button group component does some magic to add these special classes to
   * buttons and we style them here instead.
   */

    :host(
            [data-terra-button-group__button--first]:not(
                    [data-terra-button-group__button--last]
                )
        )
        .button {
        border-start-end-radius: 0;
        border-end-end-radius: 0;
    }

    :host([data-terra-button-group__button--inner]) .button {
        border-radius: 0;
    }

    :host(
            [data-terra-button-group__button--last]:not(
                    [data-terra-button-group__button--first]
                )
        )
        .button {
        border-start-start-radius: 0;
        border-end-start-radius: 0;
    }

    /* All except the first */
    :host(
            [data-terra-button-group__button]:not(
                    [data-terra-button-group__button--first]
                )
        ) {
        margin-inline-start: calc(-1 * var(--terra-input-border-width));
    }

    /* Add a visual separator between solid buttons */
    :host(
            [data-terra-button-group__button]:not(
                    [data-terra-button-group__button--first],
                    [data-terra-button-group__button--radio],
                    [variant='default']
                ):not(:hover)
        )
        .button:after {
        content: '';
        position: absolute;
        top: 0;
        inset-inline-start: 0;
        bottom: 0;
        border-left: solid 1px rgb(128 128 128 / 33%);
        mix-blend-mode: multiply;
    }

    /* Bump hovered, focused, and checked buttons up so their focus ring isn't clipped */
    :host([data-terra-button-group__button--hover]) {
        z-index: 1;
    }

    /* Focus and checked are always on top */
    :host([data-terra-button-group__button--focus]),
    :host([data-terra-button-group__button][checked]) {
        z-index: 2;
    }
`
