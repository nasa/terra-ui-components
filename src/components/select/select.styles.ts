import { css } from 'lit';

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
    z-index: var(--gd-z-index-dropdown);
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
    font-family: var(--gd-input-font-family);
    font-weight: var(--gd-input-font-weight);
    letter-spacing: var(--gd-input-letter-spacing);
    vertical-align: middle;
    overflow: hidden;
    cursor: pointer;
    transition:
      var(--gd-transition-fast) color,
      var(--gd-transition-fast) border,
      var(--gd-transition-fast) box-shadow,
      var(--gd-transition-fast) background-color;
  }

  .select__display-input {
    position: relative;
    width: 100%;
    font: inherit;
    border: none;
    background: none;
    color: var(--gd-input-color);
    cursor: inherit;
    overflow: hidden;
    padding: 0;
    margin: 0;
    -webkit-appearance: none;
  }

  .select__display-input::placeholder {
    color: var(--gd-input-placeholder-color);
  }

  .select:not(.select--disabled):hover .select__display-input {
    color: var(--gd-input-color-hover);
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
    margin-inline-start: var(--gd-spacing-2x-small);
  }

  .select__tags::slotted(gd-tag) {
    cursor: pointer !important;
  }

  .select--disabled .select__tags,
  .select--disabled .select__tags::slotted(gd-tag) {
    cursor: not-allowed !important;
  }

  /* Standard selects */
  .select--standard .select__combobox {
    background-color: var(--gd-input-background-color);
    border: solid var(--gd-input-border-width) var(--gd-input-border-color);
  }

  .select--standard.select--disabled .select__combobox {
    background-color: var(--gd-input-background-color-disabled);
    border-color: var(--gd-input-border-color-disabled);
    color: var(--gd-input-color-disabled);
    opacity: 0.5;
    cursor: not-allowed;
    outline: none;
  }

  .select--standard:not(.select--disabled).select--open .select__combobox,
  .select--standard:not(.select--disabled).select--focused .select__combobox {
    background-color: var(--gd-input-background-color-focus);
    border-color: var(--gd-input-border-color-focus);
    box-shadow: 0 0 0 var(--gd-focus-ring-width) var(--gd-input-focus-ring-color);
  }

  /* Filled selects */
  .select--filled .select__combobox {
    border: none;
    background-color: var(--gd-input-filled-background-color);
    color: var(--gd-input-color);
  }

  .select--filled:hover:not(.select--disabled) .select__combobox {
    background-color: var(--gd-input-filled-background-color-hover);
  }

  .select--filled.select--disabled .select__combobox {
    background-color: var(--gd-input-filled-background-color-disabled);
    opacity: 0.5;
    cursor: not-allowed;
  }

  .select--filled:not(.select--disabled).select--open .select__combobox,
  .select--filled:not(.select--disabled).select--focused .select__combobox {
    background-color: var(--gd-input-filled-background-color-focus);
    outline: var(--gd-focus-ring);
  }

  /* Sizes */
  .select--small .select__combobox {
    border-radius: var(--gd-input-border-radius-small);
    font-size: var(--gd-input-font-size-small);
    min-height: var(--gd-input-height-small);
    padding-block: 0;
    padding-inline: var(--gd-input-spacing-small);
  }

  .select--small .select__clear {
    margin-inline-start: var(--gd-input-spacing-small);
  }

  .select--small .select__prefix::slotted(*) {
    margin-inline-end: var(--gd-input-spacing-small);
  }

  .select--small.select--multiple:not(.select--placeholder-visible) .select__combobox {
    padding-block: 2px;
    padding-inline-start: 0;
  }

  .select--small .select__tags {
    gap: 2px;
  }

  .select--medium .select__combobox {
    border-radius: var(--gd-input-border-radius-medium);
    font-size: var(--gd-input-font-size-medium);
    min-height: var(--gd-input-height-medium);
    padding-block: 0;
    padding-inline: var(--gd-input-spacing-medium);
  }

  .select--medium .select__clear {
    margin-inline-start: var(--gd-input-spacing-medium);
  }

  .select--medium .select__prefix::slotted(*) {
    margin-inline-end: var(--gd-input-spacing-medium);
  }

  .select--medium.select--multiple:not(.select--placeholder-visible) .select__combobox {
    padding-inline-start: 0;
    padding-block: 3px;
  }

  .select--medium .select__tags {
    gap: 3px;
  }

  .select--large .select__combobox {
    border-radius: var(--gd-input-border-radius-large);
    font-size: var(--gd-input-font-size-large);
    min-height: var(--gd-input-height-large);
    padding-block: 0;
    padding-inline: var(--gd-input-spacing-large);
  }

  .select--large .select__clear {
    margin-inline-start: var(--gd-input-spacing-large);
  }

  .select--large .select__prefix::slotted(*) {
    margin-inline-end: var(--gd-input-spacing-large);
  }

  .select--large.select--multiple:not(.select--placeholder-visible) .select__combobox {
    padding-inline-start: 0;
    padding-block: 4px;
  }

  .select--large .select__tags {
    gap: 4px;
  }

  /* Pills */
  .select--pill.select--small .select__combobox {
    border-radius: var(--gd-input-height-small);
  }

  .select--pill.select--medium .select__combobox {
    border-radius: var(--gd-input-height-medium);
  }

  .select--pill.select--large .select__combobox {
    border-radius: var(--gd-input-height-large);
  }

  /* Prefix */
  .select__prefix {
    flex: 0;
    display: inline-flex;
    align-items: center;
    color: var(--gd-input-placeholder-color);
  }

  /* Clear button */
  .select__clear {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: inherit;
    color: var(--gd-input-icon-color);
    border: none;
    background: none;
    padding: 0;
    transition: var(--gd-transition-fast) color;
    cursor: pointer;
  }

  .select__clear:hover {
    color: var(--gd-input-icon-color-hover);
  }

  .select__clear:focus {
    outline: none;
  }

  /* Expand icon */
  .select__expand-icon {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    transition: var(--gd-transition-medium) rotate ease;
    rotate: 0;
    margin-inline-start: var(--gd-spacing-small);
  }

  .select--open .select__expand-icon {
    rotate: -180deg;
  }

  /* Listbox */
  .select__listbox {
    display: block;
    position: relative;
    font-family: var(--gd-font-sans);
    font-size: var(--gd-font-size-medium);
    font-weight: var(--gd-font-weight-normal);
    box-shadow: var(--gd-shadow-large);
    background: var(--gd-panel-background-color);
    border: solid var(--gd-panel-border-width) var(--gd-panel-border-color);
    border-radius: var(--gd-border-radius-medium);
    padding-block: var(--gd-spacing-x-small);
    padding-inline: 0;
    overflow: auto;
    overscroll-behavior: none;

    /* Make sure it adheres to the popup's auto size */
    max-width: var(--auto-size-available-width);
    max-height: var(--auto-size-available-height);
  }

  .select__listbox ::slotted(gd-divider) {
    --spacing: var(--gd-spacing-x-small);
  }

  .select__listbox ::slotted(small) {
    font-size: var(--gd-font-size-small);
    font-weight: var(--gd-font-weight-semibold);
    color: var(--gd-color-neutral-500);
    padding-block: var(--gd-spacing-x-small);
    padding-inline: var(--gd-spacing-x-large);
  }
`;
