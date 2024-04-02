import { css } from 'lit';

export default css`
  :host {
    display: inline-block;
  }

  .tag {
    display: flex;
    align-items: center;
    border: solid 1px;
    line-height: 1;
    white-space: nowrap;
    user-select: none;
    -webkit-user-select: none;
  }

  .tag__remove::part(base) {
    color: inherit;
    padding: 0;
  }

  /*
   * Variant modifiers
   */

  .tag--primary {
    background-color: var(--gd-color-primary-50);
    border-color: var(--gd-color-primary-200);
    color: var(--gd-color-primary-800);
  }

  .tag--primary:active > gd-icon-button {
    color: var(--gd-color-primary-600);
  }

  .tag--success {
    background-color: var(--gd-color-success-50);
    border-color: var(--gd-color-success-200);
    color: var(--gd-color-success-800);
  }

  .tag--success:active > gd-icon-button {
    color: var(--gd-color-success-600);
  }

  .tag--neutral {
    background-color: var(--gd-color-neutral-50);
    border-color: var(--gd-color-neutral-200);
    color: var(--gd-color-neutral-800);
  }

  .tag--neutral:active > gd-icon-button {
    color: var(--gd-color-neutral-600);
  }

  .tag--warning {
    background-color: var(--gd-color-warning-50);
    border-color: var(--gd-color-warning-200);
    color: var(--gd-color-warning-800);
  }

  .tag--warning:active > gd-icon-button {
    color: var(--gd-color-warning-600);
  }

  .tag--danger {
    background-color: var(--gd-color-danger-50);
    border-color: var(--gd-color-danger-200);
    color: var(--gd-color-danger-800);
  }

  .tag--danger:active > gd-icon-button {
    color: var(--gd-color-danger-600);
  }

  /*
   * Size modifiers
   */

  .tag--small {
    font-size: var(--gd-button-font-size-small);
    height: calc(var(--gd-input-height-small) * 0.8);
    line-height: calc(var(--gd-input-height-small) - var(--gd-input-border-width) * 2);
    border-radius: var(--gd-input-border-radius-small);
    padding: 0 var(--gd-spacing-x-small);
  }

  .tag--medium {
    font-size: var(--gd-button-font-size-medium);
    height: calc(var(--gd-input-height-medium) * 0.8);
    line-height: calc(var(--gd-input-height-medium) - var(--gd-input-border-width) * 2);
    border-radius: var(--gd-input-border-radius-medium);
    padding: 0 var(--gd-spacing-small);
  }

  .tag--large {
    font-size: var(--gd-button-font-size-large);
    height: calc(var(--gd-input-height-large) * 0.8);
    line-height: calc(var(--gd-input-height-large) - var(--gd-input-border-width) * 2);
    border-radius: var(--gd-input-border-radius-large);
    padding: 0 var(--gd-spacing-medium);
  }

  .tag__remove {
    margin-inline-start: var(--gd-spacing-x-small);
  }

  /*
   * Pill modifier
   */

  .tag--pill {
    border-radius: var(--gd-border-radius-pill);
  }
`;
