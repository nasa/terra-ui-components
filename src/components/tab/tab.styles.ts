import { css } from 'lit';

export default css`
  :host {
    display: inline-block;
  }

  .tab {
    display: inline-flex;
    align-items: center;
    font-family: var(--gd-font-sans);
    font-size: var(--gd-font-size-small);
    font-weight: var(--gd-font-weight-semibold);
    border-radius: var(--gd-border-radius-medium);
    color: var(--gd-color-neutral-600);
    padding: var(--gd-spacing-medium) var(--gd-spacing-large);
    white-space: nowrap;
    user-select: none;
    -webkit-user-select: none;
    cursor: pointer;
    transition:
      var(--transition-speed) box-shadow,
      var(--transition-speed) color;
  }

  .tab:hover:not(.tab--disabled) {
    color: var(--gd-color-primary-600);
  }

  .tab:focus {
    outline: none;
  }

  .tab:focus-visible:not(.tab--disabled) {
    color: var(--gd-color-primary-600);
  }

  .tab:focus-visible {
    outline: var(--gd-focus-ring);
    outline-offset: calc(-1 * var(--gd-focus-ring-width) - var(--gd-focus-ring-offset));
  }

  .tab.tab--active:not(.tab--disabled) {
    color: var(--gd-color-primary-600);
  }

  .tab.tab--closable {
    padding-inline-end: var(--gd-spacing-small);
  }

  .tab.tab--disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .tab__close-button {
    font-size: var(--gd-font-size-small);
    margin-inline-start: var(--gd-spacing-small);
  }

  .tab__close-button::part(base) {
    padding: var(--gd-spacing-3x-small);
  }

  @media (forced-colors: active) {
    .tab.tab--active:not(.tab--disabled) {
      outline: solid 1px transparent;
      outline-offset: -3px;
    }
  }
`;
