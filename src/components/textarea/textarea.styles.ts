import { css } from 'lit';

export default css`
  :host {
    display: block;
  }

  .textarea {
    display: flex;
    align-items: center;
    position: relative;
    width: 100%;
    font-family: var(--gd-input-font-family);
    font-weight: var(--gd-input-font-weight);
    line-height: var(--gd-line-height-normal);
    letter-spacing: var(--gd-input-letter-spacing);
    vertical-align: middle;
    transition:
      var(--gd-transition-fast) color,
      var(--gd-transition-fast) border,
      var(--gd-transition-fast) box-shadow,
      var(--gd-transition-fast) background-color;
    cursor: text;
  }

  /* Standard textareas */
  .textarea--standard {
    background-color: var(--gd-input-background-color);
    border: solid var(--gd-input-border-width) var(--gd-input-border-color);
  }

  .textarea--standard:hover:not(.textarea--disabled) {
    background-color: var(--gd-input-background-color-hover);
    border-color: var(--gd-input-border-color-hover);
  }
  .textarea--standard:hover:not(.textarea--disabled) .textarea__control {
    color: var(--gd-input-color-hover);
  }

  .textarea--standard.textarea--focused:not(.textarea--disabled) {
    background-color: var(--gd-input-background-color-focus);
    border-color: var(--gd-input-border-color-focus);
    color: var(--gd-input-color-focus);
    box-shadow: 0 0 0 var(--gd-focus-ring-width) var(--gd-input-focus-ring-color);
  }

  .textarea--standard.textarea--focused:not(.textarea--disabled) .textarea__control {
    color: var(--gd-input-color-focus);
  }

  .textarea--standard.textarea--disabled {
    background-color: var(--gd-input-background-color-disabled);
    border-color: var(--gd-input-border-color-disabled);
    opacity: 0.5;
    cursor: not-allowed;
  }

  .textarea--standard.textarea--disabled .textarea__control {
    color: var(--gd-input-color-disabled);
  }

  .textarea--standard.textarea--disabled .textarea__control::placeholder {
    color: var(--gd-input-placeholder-color-disabled);
  }

  /* Filled textareas */
  .textarea--filled {
    border: none;
    background-color: var(--gd-input-filled-background-color);
    color: var(--gd-input-color);
  }

  .textarea--filled:hover:not(.textarea--disabled) {
    background-color: var(--gd-input-filled-background-color-hover);
  }

  .textarea--filled.textarea--focused:not(.textarea--disabled) {
    background-color: var(--gd-input-filled-background-color-focus);
    outline: var(--gd-focus-ring);
    outline-offset: var(--gd-focus-ring-offset);
  }

  .textarea--filled.textarea--disabled {
    background-color: var(--gd-input-filled-background-color-disabled);
    opacity: 0.5;
    cursor: not-allowed;
  }

  .textarea__control {
    flex: 1 1 auto;
    font-family: inherit;
    font-size: inherit;
    font-weight: inherit;
    line-height: 1.4;
    color: var(--gd-input-color);
    border: none;
    background: none;
    box-shadow: none;
    cursor: inherit;
    -webkit-appearance: none;
  }

  .textarea__control::-webkit-search-decoration,
  .textarea__control::-webkit-search-cancel-button,
  .textarea__control::-webkit-search-results-button,
  .textarea__control::-webkit-search-results-decoration {
    -webkit-appearance: none;
  }

  .textarea__control::placeholder {
    color: var(--gd-input-placeholder-color);
    user-select: none;
    -webkit-user-select: none;
  }

  .textarea__control:focus {
    outline: none;
  }

  /*
   * Size modifiers
   */

  .textarea--small {
    border-radius: var(--gd-input-border-radius-small);
    font-size: var(--gd-input-font-size-small);
  }

  .textarea--small .textarea__control {
    padding: 0.5em var(--gd-input-spacing-small);
  }

  .textarea--medium {
    border-radius: var(--gd-input-border-radius-medium);
    font-size: var(--gd-input-font-size-medium);
  }

  .textarea--medium .textarea__control {
    padding: 0.5em var(--gd-input-spacing-medium);
  }

  .textarea--large {
    border-radius: var(--gd-input-border-radius-large);
    font-size: var(--gd-input-font-size-large);
  }

  .textarea--large .textarea__control {
    padding: 0.5em var(--gd-input-spacing-large);
  }

  /*
   * Resize types
   */

  .textarea--resize-none .textarea__control {
    resize: none;
  }

  .textarea--resize-vertical .textarea__control {
    resize: vertical;
  }

  .textarea--resize-auto .textarea__control {
    height: auto;
    resize: none;
    overflow-y: hidden;
  }
`;
