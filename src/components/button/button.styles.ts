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
        border-width: var(--edux-button-border-width);
        font-family: var(--edux-font-family--inter);
        font-weight: var(--edux-font-weight-bold);
        text-decoration: none;
        user-select: none;
        -webkit-user-select: none;
        white-space: nowrap;
        vertical-align: middle;
        padding: 0;
        transition:
            var(--edux-transition-x-fast) background-color,
            var(--edux-transition-x-fast) color,
            var(--edux-transition-x-fast) border,
            var(--edux-transition-x-fast) box-shadow;
        cursor: inherit;
    }

    .button::-moz-focus-inner {
        border: 0;
    }

    .button:focus {
        outline: none;
    }

    .button:focus-visible {
        outline: var(--edux-focus-ring);
        outline-offset: var(--edux-focus-ring-offset);
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

    .button__label::slotted(edux-icon) {
        vertical-align: -2px;
    }

    /*
   * Standard buttons
   */

    /* Default */
    .button--standard.button--default {
        background-color: var(--edux-color-default-gray);
        border-color: var(--edux-color-default-gray);
        color: var(--edux-color-spacesuit-white);
    }

    .button--standard.button--default:hover:not(.button--disabled) {
        background-color: var(--edux-color-default-gray-shade);
        border-color: var(--edux-color-default-gray-shade);
        color: var(--edux-color-spacesuit-white);
    }

    .button--standard.button--default:active:not(.button--disabled) {
        background-color: var(--edux-color-default-gray-tint);
        border-color: var(--edux-color-default-gray-tint);
        color: var(--edux-color-spacesuit-white);
    }

    /* Primary */
    .button--standard.button--primary {
        background-color: var(--edux-color-nasa-blue);
        border-color: var(--edux-color-nasa-blue);
        color: var(--edux-color-spacesuit-white);
    }

    .button--standard.button--primary:hover:not(.button--disabled) {
        background-color: var(--edux-color-nasa-blue-shade);
        border-color: var(--edux-color-nasa-blue-shade);
        color: var(--edux-color-spacesuit-white);
    }

    .button--standard.button--primary:active:not(.button--disabled) {
        background-color: var(--edux-color-nasa-blue-tint);
        border-color: var(--edux-color-nasa-blue-tint);
        color: var(--edux-color-spacesuit-white);
    }

    /* Success */
    .button--standard.button--success {
        background-color: var(--edux-color-success-green);
        border-color: var(--edux-color-success-green);
        color: var(--edux-color-spacesuit-white);
    }

    .button--standard.button--success:hover:not(.button--disabled) {
        background-color: var(--edux-color-success-green-hover);
        border-color: var(--edux-color-success-green-hover);
        color: var(--edux-color-spacesuit-white);
    }

    .button--standard.button--success:active:not(.button--disabled) {
        background-color: var(--edux-color-success-green-focus);
        border-color: var(--edux-color-success-green-focus);
        color: var(--edux-color-spacesuit-white);
    }

    /* Warning */
    .button--standard.button--warning {
        background-color: var(--edux-color-international-orange);
        border-color: var(--edux-color-international-orange);
        color: var(--edux-color-spacesuit-white);
    }

    .button--standard.button--warning:hover:not(.button--disabled) {
        background-color: var(--edux-color-international-orange-shade);
        border-color: var(--edux-color-international-orange-shade);
        color: var(--edux-color-spacesuit-white);
    }

    .button--standard.button--warning:active:not(.button--disabled) {
        background-color: var(--edux-color-international-orange-tint);
        border-color: var(--edux-color-international-orange-tint);
        color: var(--edux-color-spacesuit-white);
    }

    /* Danger */
    .button--standard.button--danger {
        background-color: var(--edux-color-nasa-red);
        border-color: var(--edux-color-nasa-red);
        color: var(--edux-color-spacesuit-white);
    }

    .button--standard.button--danger:hover:not(.button--disabled) {
        background-color: var(--edux-color-nasa-red-shade);
        border-color: var(--edux-color-nasa-red-shade);
        color: var(--edux-color-spacesuit-white);
    }

    .button--standard.button--danger:active:not(.button--disabled) {
        background-color: var(--edux-color-nasa-red-tint);
        border-color: var(--edux-color-nasa-red-tint);
        color: var(--edux-color-spacesuit-white);
    }

    /*
   * Outline buttons
   */

    .button--outline {
        background: none;
    }

    /* Primary */
    .button--outline.button--primary {
        border-color: var(--edux-color-nasa-blue);
        color: var(--edux-button-outline-text-color);
    }

    .button--outline.button--primary:hover:not(.button--disabled),
    .button--outline.button--default.button--checked:not(.button--disabled) {
        border-color: var(--edux-color-nasa-blue);
        background-color: var(--edux-color-nasa-blue);
        color: var(--edux-color-spacesuit-white);
    }

    .button--outline.button--primary:active:not(.button--disabled) {
        border-color: var(--edux-color-nasa-blue-tint);
        background-color: var(--edux-color-nasa-blue-tint);
        color: var(--edux-color-spacesuit-white);
    }

    /* Default */
    .button--outline.button--default {
        border-color: var(--edux-color-default-gray);
        color: var(--edux-button-outline-text-color);
    }

    .button--outline.button--default:hover:not(.button--disabled),
    .button--outline.button--default.button--checked:not(.button--disabled) {
        border-color: var(--edux-color-default-gray);
        background-color: var(--edux-color-default-gray);
        color: var(--edux-color-spacesuit-white);
    }

    .button--outline.button--default:active:not(.button--disabled) {
        border-color: var(--edux-color-default-gray-tint);
        background-color: var(--edux-color-default-gray-tint);
        color: var(--edux-color-spacesuit-white);
    }

    /* Success */
    .button--outline.button--success {
        border-color: var(--edux-color-success-green);
        color: var(--edux-button-outline-text-color);
    }

    .button--outline.button--success:hover:not(.button--disabled),
    .button--outline.button--success.button--checked:not(.button--disabled) {
        background-color: var(--edux-color-success-green);
        color: var(--edux-color-spacesuit-white);
    }

    .button--outline.button--success:active:not(.button--disabled) {
        border-color: var(--edux-color-success-green-focus);
        background-color: var(--edux-color-success-green-focus);
        color: var(--edux-color-spacesuit-white);
    }

    /* Warning */
    .button--outline.button--warning {
        border-color: var(--edux-color-international-orange);
        color: var(--edux-button-outline-text-color);
    }

    .button--outline.button--warning:hover:not(.button--disabled),
    .button--outline.button--warning.button--checked:not(.button--disabled) {
        background-color: var(--edux-color-international-orange);
        color: var(--edux-color-spacesuit-white);
    }

    .button--outline.button--warning:active:not(.button--disabled) {
        border-color: var(--edux-color-international-orange-tint);
        background-color: var(--edux-color-international-orange-tint);
        color: var(--edux-color-spacesuit-white);
    }

    /* Danger */
    .button--outline.button--danger {
        border-color: var(--edux-color-nasa-red);
        color: var(--edux-button-outline-text-color);
    }

    .button--outline.button--danger:hover:not(.button--disabled),
    .button--outline.button--danger.button--checked:not(.button--disabled) {
        background-color: var(--edux-color-nasa-red);
        color: var(--edux-color-spacesuit-white);
    }

    .button--outline.button--danger:active:not(.button--disabled) {
        border-color: var(--edux-color-nasa-red-tint);
        background-color: var(--edux-color-nasa-red-tint);
        color: var(--edux-color-spacesuit-white);
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
        color: var(--edux-button-text-text-color);
    }

    .button--text:hover:not(.button--disabled) {
        background-color: transparent;
        border-color: transparent;
        color: var(--edux-button-text-text-color-hover);
    }

    .button--text:focus-visible:not(.button--disabled) {
        background-color: transparent;
        border-color: transparent;
        color: var(--edux-color-nasa-blue);
    }

    .button--text:active:not(.button--disabled) {
        background-color: transparent;
        border-color: transparent;
        color: var(--edux-color-nasa-blue-tint);
    }

    /*
   * Page Link buttons
   */

    .button--pagelink {
        background-color: transparent;
        border-color: transparent;
        color: var(--edux-button-page-link-text);
        & slot[name='suffix'] span {
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: var(--edux-color-nasa-red);
            color: var(--edux-color-spacesuit-white);
            padding-left: 0;
            padding-right: 0;
        }
    }

    .button--pagelink:hover:not(.button--disabled) slot[name='suffix'] span {
        background-color: var(--edux-color-nasa-red-shade);
    }

    .button--pagelink.button--small {
        & slot[part='label'] {
            padding-right: 0.3rem;
            font-size: 1rem;
        }
        & slot[name='suffix'] span {
            height: var(--edux-icon-small);
            width: var(--edux-icon-small);
            border-radius: 50%;
        }
    }

    .button--pagelink.button--medium {
        & slot[part='label'] {
            padding-right: 0.4rem;
            font-size: 1.4rem;
        }
        & slot[name='suffix'] span {
            height: var(--edux-icon-medium);
            width: var(--edux-icon-medium);
            border-radius: 50%;
        }
    }

    .button--pagelink.button--large {
        & slot[part='label'] {
            padding-right: 0.5rem;
            font-size: 1.8rem;
        }
        & slot[name='suffix'] span {
            height: var(--edux-icon-large);
            width: var(--edux-icon-large);
            border-radius: 50%;
        }
    }

    /*
   * Size modifiers
   */

    .button--small {
        height: auto;
        min-height: var(--edux-button-height-small);
        font-size: var(--edux-button-font-size-small);
        line-height: calc(
            var(--edux-button-height-small) - var(--edux-button-border-width) * 2
        );
        border-radius: var(--edux-input-border-radius-small);
    }

    .button--medium {
        height: auto;
        min-height: var(--edux-button-height-medium);
        font-size: var(--edux-button-font-size-medium);
        line-height: calc(
            var(--edux-button-height-medium) - var(--edux-button-border-width) * 2
        );
        border-radius: var(--edux-input-border-radius-medium);
    }

    .button--large {
        height: auto;
        min-height: var(--edux-button-height-large);
        font-size: var(--edux-button-font-size-large);
        line-height: calc(
            var(--edux-button-height-large) - var(--edux-button-border-width) * 2
        );
        border-radius: var(--edux-input-border-radius-large);
    }

    /*
   * Circle modifier
   */

    .button--circle {
        padding-left: 0;
        padding-right: 0;
    }

    .button--circle.button--small {
        height: var(--edux-button-height-small);
        width: var(--edux-button-height-small);
        border-radius: 50%;
    }

    .button--circle.button--medium {
        height: var(--edux-button-height-medium);
        width: var(--edux-button-height-medium);
        border-radius: 50%;
    }

    .button--circle.button--large {
        height: var(--edux-button-height-medium);
        width: var(--edux-button-height-large);
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
        padding: 0 var(--edux-spacing-small);
    }

    .button--has-label.button--medium .button__label {
        padding: 0 var(--edux-spacing-medium);
    }

    .button--has-label.button--large .button__label {
        padding: 0 var(--edux-spacing-large);
    }

    .button--has-prefix.button--small {
        padding-inline-start: var(--edux-spacing-x-small);
    }

    .button--has-prefix.button--small .button__label {
        padding-inline-start: var(--edux-spacing-x-small);
    }

    .button--has-prefix.button--medium {
        padding-inline-start: var(--edux-spacing-small);
    }

    .button--has-prefix.button--medium .button__label {
        padding-inline-start: var(--edux-spacing-small);
    }

    .button--has-prefix.button--large {
        padding-inline-start: var(--edux-spacing-small);
    }

    .button--has-prefix.button--large .button__label {
        padding-inline-start: var(--edux-spacing-small);
    }

    .button--has-suffix.button--small,
    .button--caret.button--small {
        padding-inline-end: var(--edux-spacing-x-small);
    }

    .button--has-suffix.button--small .button__label,
    .button--caret.button--small .button__label {
        padding-inline-end: var(--edux-spacing-x-small);
    }

    .button--has-suffix.button--medium,
    .button--caret.button--medium {
        padding-inline-end: var(--edux-spacing-small);
    }

    .button--has-suffix.button--medium .button__label,
    .button--caret.button--medium .button__label {
        padding-inline-end: var(--edux-spacing-small);
    }

    .button--has-suffix.button--large,
    .button--caret.button--large {
        padding-inline-end: var(--edux-spacing-small);
    }

    .button--has-suffix.button--large .button__label,
    .button--caret.button--large .button__label {
        padding-inline-end: var(--edux-spacing-small);
    }

    /* Shape modifier

    * Button radius overrides used to control the edge shape when button is not in a edux-button-group. 
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
            [data-edux-button-group__button--first]:not(
                    [data-edux-button-group__button--last]
                )
        )
        .button {
        border-start-end-radius: 0;
        border-end-end-radius: 0;
    }

    :host([data-edux-button-group__button--inner]) .button {
        border-radius: 0;
    }

    :host(
            [data-edux-button-group__button--last]:not(
                    [data-edux-button-group__button--first]
                )
        )
        .button {
        border-start-start-radius: 0;
        border-end-start-radius: 0;
    }

    /* All except the first */
    :host(
            [data-edux-button-group__button]:not(
                    [data-edux-button-group__button--first]
                )
        ) {
        margin-inline-start: calc(-1 * var(--edux-input-border-width));
    }

    /* Add a visual separator between solid buttons */
    :host(
            [data-edux-button-group__button]:not(
                    [data-edux-button-group__button--first],
                    [data-edux-button-group__button--radio],
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
    :host([data-edux-button-group__button--hover]) {
        z-index: 1;
    }

    /* Focus and checked are always on top */
    :host([data-edux-button-group__button--focus]),
    :host([data-edux-button-group__button][checked]) {
        z-index: 2;
    }
`
