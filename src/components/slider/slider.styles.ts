import { css } from 'lit'

export default css`
    :host {
        display: block;
    }

    .slider__header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: var(--terra-spacing-small, 0.75rem);
    }

    .slider__label {
        display: block;
        font-size: var(--terra-font-size-small);
        font-weight: var(--terra-font-weight-semibold);
        color: var(--terra-slider-label-color);
        margin: 0;
        font-family: var(--terra-font-family--inter);
    }

    .slider__header-right {
        display: flex;
        align-items: center;
        gap: var(--terra-spacing-small, 0.75rem);
    }

    .slider__clear {
        display: inline-block;
        padding: 0;
        background: transparent;
        border: none;
        color: var(--terra-link-color);
        font-size: var(--terra-font-size-small);
        font-weight: var(--terra-font-weight-semibold);
        font-family: var(--terra-font-family--inter);
        cursor: pointer;
        text-decoration: var(--terra-link-text-decoration);
        text-decoration-style: var(--terra-link-text-decoration-style);
        text-underline-offset: var(--terra-link-underline-offset);
    }

    .slider__clear:hover {
        color: var(--terra-link-color-hover);
    }

    .slider__clear:focus {
        outline: 2px solid var(--terra-color-nasa-blue);
        outline-offset: 2px;
        border-radius: var(--terra-border-radius-small);
    }

    .slider__current-range {
        font-size: var(--terra-font-size-small);
        font-weight: var(--terra-font-weight-normal);
        color: var(--terra-slider-range-color);
        font-family: var(--terra-font-family--inter);
    }

    .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;
    }

    .hasPips {
        padding-bottom: 80px;
    }

    .noUi-target[disabled] .noUi-connect {
        background-color: rgb(119, 164, 238);
    }

    /* Functional styling; These styles are required for noUiSlider to function. */
    .noUi-target,
    .noUi-target * {
        -webkit-touch-callout: none;
        -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
        -webkit-user-select: none;
        -ms-touch-action: none;
        touch-action: none;
        -ms-user-select: none;
        -moz-user-select: none;
        user-select: none;
        -moz-box-sizing: border-box;
        box-sizing: border-box;
    }
    .noUi-target {
        position: relative;
    }
    .noUi-base,
    .noUi-connects {
        width: 100%;
        height: 100%;
        position: relative;
        z-index: 1;
    }
    .noUi-connects {
        overflow: hidden;
        z-index: 0;
    }
    .noUi-connect,
    .noUi-origin {
        will-change: transform;
        position: absolute;
        z-index: 1;
        top: 0;
        right: 0;
        height: 100%;
        width: 100%;
        -ms-transform-origin: 0 0;
        -webkit-transform-origin: 0 0;
        -webkit-transform-style: preserve-3d;
        transform-origin: 0 0;
        transform-style: flat;
    }
    .noUi-txt-dir-rtl.noUi-horizontal .noUi-origin {
        border: 1px solid var(--terra-input-border-color);
        left: 0;
        right: auto;
    }
    .noUi-vertical .noUi-origin {
        top: -100%;
        width: 0;
    }
    .noUi-horizontal .noUi-origin {
        height: 0;
    }
    .noUi-handle {
        -webkit-backface-visibility: hidden;
        backface-visibility: hidden;
        position: absolute;
    }
    .noUi-touch-area {
        height: 100%;
        width: 100%;
    }
    .noUi-state-tap .noUi-connect,
    .noUi-state-tap .noUi-origin {
        -webkit-transition: transform 0.3s;
        transition: transform 0.3s;
    }
    .noUi-state-drag * {
        cursor: inherit !important;
    }
    /* Slider size and handle placement */
    .noUi-horizontal {
        height: 4px;
    }
    .noUi-horizontal .noUi-handle {
        width: 20px;
        height: 20px;
        right: -10px;
        top: -8px;
    }
    .noUi-vertical {
        width: 18px;
    }
    .noUi-vertical .noUi-handle {
        width: 28px;
        height: 34px;
        right: -6px;
        bottom: -17px;
    }
    .noUi-txt-dir-rtl.noUi-horizontal .noUi-handle {
        left: -17px;
        right: auto;
    }
    /* Styling */
    .noUi-target {
        background: var(--terra-slider-track-background-color);
        border-radius: 2px;
        border: 1px solid var(--terra-slider-track-border-color);
        box-shadow: none;
    }
    .noUi-connects {
        border-radius: 2px;
    }
    .noUi-connect {
        background: var(--terra-slider-connect-color);
    }
    /* Handles and cursors */
    .noUi-draggable {
        cursor: ew-resize;
    }
    .noUi-vertical .noUi-draggable {
        cursor: ns-resize;
    }
    .noUi-handle {
        background: var(--terra-slider-handle-background-color);
        border: 1px solid var(--terra-slider-handle-border-color);
        border-radius: 99px;
        cursor: default;
        box-shadow:;
    }
    .noUi-active {
        box-shadow:
            inset 0 0 1px #fff,
            inset 0 1px 7px #ddd,
            0 3px 6px -3px #bbb;
    }
    /* Handle stripes */
    .noUi-handle:before,
    .noUi-handle:after {
        content: '';
        display: block;
        position: absolute;
        height: 14px;
        width: 1px;
        left: 14px;
        top: 6px;
    }
    .noUi-handle:after {
        left: 17px;
    }
    .noUi-vertical .noUi-handle:before,
    .noUi-vertical .noUi-handle:after {
        width: 14px;
        height: 1px;
        left: 6px;
        top: 14px;
    }
    .noUi-vertical .noUi-handle:after {
        top: 17px;
    }
    /* Disabled state */
    [disabled] .noUi-connect {
        background: #b8b8b8;
    }
    [disabled].noUi-target,
    [disabled].noUi-handle,
    [disabled] .noUi-handle {
        cursor: not-allowed;
    }
    /* Base */
    .noUi-pips,
    .noUi-pips * {
        -moz-box-sizing: border-box;
        box-sizing: border-box;
    }
    .noUi-pips {
        position: absolute;
        color: #999;
    }
    /* Values */
    .noUi-value {
        position: absolute;
        white-space: nowrap;
        text-align: center;
        font-family: var(--terra-input-font-family);
        font-size: var(--terra-font-size-medium);
    }
    .noUi-value-sub {
        color: #ccc;
        font-size: 10px;
    }
    /* Markings */
    .noUi-marker {
        position: absolute;
        background: #ccc;
    }
    .noUi-marker-sub {
        background: #aaa;
    }
    .noUi-marker-large {
        background: #aaa;
    }
    /* Horizontal layout */
    .noUi-pips-horizontal {
        padding: 10px 0;
        height: 80px;
        top: 100%;
        left: 0;
        width: 100%;
    }
    .noUi-value-horizontal {
        -webkit-transform: translate(-50%, 50%);
        transform: translate(-50%, 50%);
    }
    .noUi-rtl .noUi-value-horizontal {
        -webkit-transform: translate(50%, 50%);
        transform: translate(50%, 50%);
    }
    .noUi-marker-horizontal.noUi-marker {
        margin-left: -1px;
        width: 2px;
        height: 5px;
    }
    .noUi-marker-horizontal.noUi-marker-sub {
        height: 10px;
    }
    .noUi-marker-horizontal.noUi-marker-large {
        height: 15px;
    }
    /* Vertical layout */
    .noUi-pips-vertical {
        padding: 0 10px;
        height: 100%;
        top: 0;
        left: 100%;
    }
    .noUi-value-vertical {
        -webkit-transform: translate(0, -50%);
        transform: translate(0, -50%);
        padding-left: 25px;
    }
    .noUi-rtl .noUi-value-vertical {
        -webkit-transform: translate(0, 50%);
        transform: translate(0, 50%);
    }
    .noUi-marker-vertical.noUi-marker {
        width: 5px;
        height: 2px;
        margin-top: -1px;
    }
    .noUi-marker-vertical.noUi-marker-sub {
        width: 10px;
    }
    .noUi-marker-vertical.noUi-marker-large {
        width: 15px;
    }
    .noUi-tooltip {
        display: block;
        position: absolute;
        font-family: var(--terra-input-font-family);
        font-size: var(--terra-input-font-size);
        color: var(--terra-input-color);
        border: var(--terra-input-border-width) solid var(--terra-input-border-color);
        border-radius: var(--terra-input-border-radius);
        background: var(--terra-input-background-color);
        padding: 5px 10px;
        text-align: center;
        white-space: nowrap;
    }
    .noUi-horizontal .noUi-tooltip {
        -webkit-transform: translate(-50%, 0);
        transform: translate(-50%, 0);
        left: 50%;
        bottom: 120%;
    }
    .noUi-vertical .noUi-tooltip {
        -webkit-transform: translate(0, -50%);
        transform: translate(0, -50%);
        top: 50%;
        right: 120%;
    }
    .noUi-horizontal .noUi-origin > .noUi-tooltip {
        -webkit-transform: translate(50%, 0);
        transform: translate(50%, 0);
        left: auto;
        bottom: 10px;
    }
    .noUi-vertical .noUi-origin > .noUi-tooltip {
        -webkit-transform: translate(0, -18px);
        transform: translate(0, -18px);
        top: auto;
        right: 28px;
    }

    /* Editable tooltip input styling */
    .noUi-tooltip input {
        background: transparent;
        border: none;
        color: inherit;
        font-family: inherit;
        font-size: inherit;
        text-align: center;
        width: 100%;
        outline: none;
        padding: 0;
        margin: 0;
        min-width: 40px;
    }

    .noUi-tooltip input:focus {
        background: rgba(255, 255, 255, 0.2);
        border-radius: 2px;
        outline: 1px solid rgba(255, 255, 255, 0.3);
    }

    .noUi-tooltip input::-webkit-outer-spin-button,
    .noUi-tooltip input::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }

    .noUi-tooltip input[type='number'] {
        -moz-appearance: textfield;
    }

    /* Input fields below slider */
    .slider-inputs {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-top: 12px;
        justify-content: center;
    }

    .slider-inputs input {
        width: 80px;
        padding: 6px 8px;
        border: 1px solid var(--terra-input-border-color, #ccc);
        border-radius: 4px;
        font-size: 14px;
        text-align: center;
        background: var(--terra-input-background-color, #fff);
        color: var(--terra-input-color, #333);
    }

    .slider-inputs input:focus {
        outline: none;
        border-color: var(--terra-color-primary, #007bff);
        box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
    }

    .input-separator {
        font-size: 14px;
        color: var(--terra-color-text-secondary, #666);
        font-weight: 500;
    }
`
