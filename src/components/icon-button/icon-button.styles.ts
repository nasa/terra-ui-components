import { css } from 'lit';

export default css`
  :host {
    display: inline-block;
    color: var(--gd-color-neutral-600);
  }

  .icon-button {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    background: none;
    border: none;
    border-radius: var(--gd-border-radius-medium);
    font-size: inherit;
    color: inherit;
    padding: var(--gd-spacing-x-small);
    cursor: pointer;
    transition: var(--gd-transition-x-fast) color;
    -webkit-appearance: none;
  }

  .icon-button:hover:not(.icon-button--disabled),
  .icon-button:focus-visible:not(.icon-button--disabled) {
    color: var(--gd-color-primary-600);
  }

  .icon-button:active:not(.icon-button--disabled) {
    color: var(--gd-color-primary-700);
  }

  .icon-button:focus {
    outline: none;
  }

  .icon-button--disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .icon-button:focus-visible {
    outline: var(--gd-focus-ring);
    outline-offset: var(--gd-focus-ring-offset);
  }

  .icon-button__icon {
    pointer-events: none;
  }
`;
