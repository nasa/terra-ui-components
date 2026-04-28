import { css } from 'lit'

export default css`
    :host {
        display: block;
    }

    /** The popup */
    .select {
        flex: 1 1 auto;
        display: inline-flex;
        width: 100%;
        position: relative;
        vertical-align: middle;
    }

    .select::part(popup) {
        z-index: var(--terra-z-index-dropdown);
    }

    .select[data-current-placement^='top']::part(popup) {
        transform-origin: bottom;
    }

    .select[data-current-placement^='bottom']::part(popup) {
        transform-origin: top;
    }

    /* Combobox */
    .select__combobox {
        flex: 1;
        display: flex;
        width: 100%;
        min-width: 0;
        position: relative;
        align-items: center;
        justify-content: start;
        font-family: var(--terra-input-font-family);
        font-weight: var(--terra-input-font-weight);
        letter-spacing: var(--terra-input-letter-spacing);
        vertical-align: middle;
        overflow: hidden;
        cursor: pointer;
        transition:
            var(--terra-transition-fast) color,
            var(--terra-transition-fast) border,
            var(--terra-transition-fast) box-shadow,
            var(--terra-transition-fast) background-color;
    }

    .select__display-input {
        position: relative;
        width: 100%;
        font: inherit;
        border: none;
        background: none;
        color: var(--terra-input-color);
        cursor: inherit;
        overflow: hidden;
        padding: 0;
        margin: 0;
        -webkit-appearance: none;
    }

    .select__display-input::placeholder {
        color: var(--terra-input-placeholder-color);
    }

    .select:not(.select--disabled):hover .select__display-input {
        color: var(--terra-input-color-hover);
    }

    .select__display-input:focus {
        outline: none;
    }

    /* Visually hide the display input when multiple is enabled */
    .select--multiple:not(.select--placeholder-visible) .select__display-input {
        position: absolute;
        z-index: -1;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        opacity: 0;
    }

    .select__value-input {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        padding: 0;
        margin: 0;
        opacity: 0;
        z-index: -1;
    }

    .select__tags {
        display: flex;
        flex: 1;
        align-items: center;
        flex-wrap: wrap;
        margin-inline-start: var(--terra-spacing-2x-small);
    }

    .select__tags::slotted(terra-tag) {
        cursor: pointer !important;
    }

    .select--disabled .select__tags,
    .select--disabled .select__tags::slotted(terra-tag) {
        cursor: not-allowed !important;
    }

    /* Standard selects */
    .select--standard .select__combobox {
        background-color: var(--terra-input-background-color);
        border: solid var(--terra-input-border-width) var(--terra-input-border-color);
    }

    .select--standard.select--disabled .select__combobox {
        background-color: var(--terra-input-background-color-disabled);
        border-color: var(--terra-input-border-color-disabled);
        color: var(--terra-input-color-disabled);
        opacity: 0.5;
        cursor: not-allowed;
        outline: none;
    }

    .select--standard:not(.select--disabled).select--open .select__combobox,
    .select--standard:not(.select--disabled).select--focused .select__combobox {
        background-color: var(--terra-input-background-color-focus);
        border-color: var(--terra-color-nasa-blue);
        box-shadow: 0 0 0 var(--terra-focus-ring-width)
            var(--terra-input-focus-ring-color);
    }

    /* Filled selects */
    .select--filled .select__combobox {
        border: none;
        background-color: var(--terra-input-filled-background-color);
        color: var(--terra-input-color);
    }

    .select--filled:hover:not(.select--disabled) .select__combobox {
        background-color: var(--terra-input-filled-background-color-hover);
    }

    .select--filled.select--disabled .select__combobox {
        background-color: var(--terra-input-filled-background-color-disabled);
        opacity: 0.5;
        cursor: not-allowed;
    }

    .select--filled:not(.select--disabled).select--open .select__combobox,
    .select--filled:not(.select--disabled).select--focused .select__combobox {
        background-color: var(--terra-input-filled-background-color-focus);
        outline: var(--terra-focus-ring-style) var(--terra-focus-ring-width)
            var(--terra-focus-ring-color);
    }

    /* Sizes */
    .select--small .select__combobox {
        border-radius: var(--terra-input-border-radius-small);
        font-size: var(--terra-input-font-size-small);
        min-height: var(--terra-input-height-small);
        padding-block: 0;
        padding-inline: var(--terra-input-spacing-small);
    }

    .select--small .select__clear {
        margin-inline-start: var(--terra-input-spacing-small);
    }

    .select--small .select__prefix::slotted(*) {
        margin-inline-end: var(--terra-input-spacing-small);
    }

    .select--small.select--multiple:not(.select--placeholder-visible)
        .select__prefix::slotted(*) {
        margin-inline-start: var(--terra-input-spacing-small);
    }

    .select--small.select--multiple:not(.select--placeholder-visible)
        .select__combobox {
        padding-block: 2px;
        padding-inline-start: 0;
    }

    .select--small .select__tags {
        gap: 2px;
    }

    .select--medium .select__combobox {
        border-radius: var(--terra-input-border-radius-medium);
        font-size: var(--terra-input-font-size-medium);
        min-height: var(--terra-input-height-medium);
        padding-block: 0;
        padding-inline: var(--terra-input-spacing-medium);
    }

    .select--medium .select__clear {
        margin-inline-start: var(--terra-input-spacing-medium);
    }

    .select--medium .select__prefix::slotted(*) {
        margin-inline-end: var(--terra-input-spacing-medium);
    }

    .select--medium.select--multiple:not(.select--placeholder-visible)
        .select__prefix::slotted(*) {
        margin-inline-start: var(--terra-input-spacing-medium);
    }

    .select--medium.select--multiple:not(.select--placeholder-visible)
        .select__combobox {
        padding-inline-start: 0;
        padding-block: 3px;
    }

    .select--medium .select__tags {
        gap: 3px;
    }

    .select--large .select__combobox {
        border-radius: var(--terra-input-border-radius-large);
        font-size: var(--terra-input-font-size-large);
        min-height: var(--terra-input-height-large);
        padding-block: 0;
        padding-inline: var(--terra-input-spacing-large);
    }

    .select--large .select__clear {
        margin-inline-start: var(--terra-input-spacing-large);
    }

    .select--large .select__prefix::slotted(*) {
        margin-inline-end: var(--terra-input-spacing-large);
    }

    .select--large.select--multiple:not(.select--placeholder-visible)
        .select__prefix::slotted(*) {
        margin-inline-start: var(--terra-input-spacing-large);
    }

    .select--large.select--multiple:not(.select--placeholder-visible)
        .select__combobox {
        padding-inline-start: 0;
        padding-block: 4px;
    }

    .select--large .select__tags {
        gap: 4px;
    }

    /* Pills */
    .select--pill.select--small .select__combobox {
        border-radius: var(--terra-input-height-small);
    }

    .select--pill.select--medium .select__combobox {
        border-radius: var(--terra-input-height-medium);
    }

    .select--pill.select--large .select__combobox {
        border-radius: var(--terra-input-height-large);
    }

    /* Prefix and Suffix */
    .select__prefix,
    .select__suffix {
        flex: 0;
        display: inline-flex;
        align-items: center;
        color: var(--terra-input-placeholder-color);
    }

    .select__suffix::slotted(*) {
        margin-inline-start: var(--terra-spacing-small);
    }

    /* Clear button */
    .select__clear {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-size: inherit;
        color: var(--terra-input-icon-color);
        border: none;
        background: none;
        padding: 0;
        transition: var(--terra-transition-fast) color;
        cursor: pointer;
    }

    .select__clear:hover {
        color: var(--terra-input-icon-color-hover);
    }

    .select__clear:focus {
        outline: none;
    }

    /* Expand icon */
    .select__expand-icon {
        flex: 0 0 auto;
        display: flex;
        align-items: center;
        transition: var(--terra-transition-medium) rotate ease;
        rotate: 0;
        margin-inline-start: var(--terra-spacing-small);
    }

    .select--open .select__expand-icon {
        rotate: -180deg;
    }

    /* Listbox */
    .select__listbox {
        display: block;
        position: relative;
        font-family: var(--terra-font-family--inter);
        font-size: var(--terra-font-size-medium);
        font-weight: var(--terra-font-weight-normal);
        box-shadow: var(--terra-shadow-large);
        background: var(--terra-panel-background-color);
        border: solid var(--terra-panel-border-width) var(--terra-panel-border-color);
        border-radius: var(--terra-border-radius-medium);
        padding-block: var(--terra-spacing-x-small);
        padding-inline: 0;
        overflow: auto;
        overscroll-behavior: none;

        /* Make sure it adheres to the popup's auto size */
        max-width: var(--auto-size-available-width);
        max-height: var(--auto-size-available-height);
    }

    .select__listbox ::slotted(terra-divider) {
        --spacing: var(--terra-spacing-x-small);
    }

    .select__listbox ::slotted(small) {
        display: block;
        font-size: var(--terra-font-size-small);
        font-weight: var(--terra-font-weight-semibold);
        color: var(--terra-color-carbon-50);
        padding-block: var(--terra-spacing-2x-small);
        padding-inline: var(--terra-spacing-x-large);
    }
`
