import { css } from 'lit';

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
    background-color: var(--gd-panel-background-color);
    border: solid var(--gd-panel-border-width) var(--gd-panel-border-color);
    border-top-width: calc(var(--gd-panel-border-width) * 3);
    border-radius: var(--gd-border-radius-medium);
    font-family: var(--gd-font-sans);
    font-size: var(--gd-font-size-small);
    font-weight: var(--gd-font-weight-normal);
    line-height: 1.6;
    color: var(--gd-color-neutral-700);
    margin: inherit;
  }

  .alert:not(.alert--has-icon) .alert__icon,
  .alert:not(.alert--closable) .alert__close-button {
    display: none;
  }

  .alert__icon {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    font-size: var(--gd-font-size-large);
    padding-inline-start: var(--gd-spacing-large);
  }

  .alert--primary {
    border-top-color: var(--gd-color-primary-600);
  }

  .alert--primary .alert__icon {
    color: var(--gd-color-primary-600);
  }

  .alert--success {
    border-top-color: var(--gd-color-success-600);
  }

  .alert--success .alert__icon {
    color: var(--gd-color-success-600);
  }

  .alert--neutral {
    border-top-color: var(--gd-color-neutral-600);
  }

  .alert--neutral .alert__icon {
    color: var(--gd-color-neutral-600);
  }

  .alert--warning {
    border-top-color: var(--gd-color-warning-600);
  }

  .alert--warning .alert__icon {
    color: var(--gd-color-warning-600);
  }

  .alert--danger {
    border-top-color: var(--gd-color-danger-600);
  }

  .alert--danger .alert__icon {
    color: var(--gd-color-danger-600);
  }

  .alert__message {
    flex: 1 1 auto;
    display: block;
    padding: var(--gd-spacing-large);
    overflow: hidden;
  }

  .alert__close-button {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    font-size: var(--gd-font-size-medium);
    padding-inline-end: var(--gd-spacing-medium);
  }
`;
