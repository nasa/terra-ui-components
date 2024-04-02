import { css } from 'lit';

export default css`
  :host {
    display: block;
    user-select: none;
    -webkit-user-select: none;
  }

  :host(:focus) {
    outline: none;
  }

  .option {
    position: relative;
    display: flex;
    align-items: center;
    font-family: var(--gd-font-sans);
    font-size: var(--gd-font-size-medium);
    font-weight: var(--gd-font-weight-normal);
    line-height: var(--gd-line-height-normal);
    letter-spacing: var(--gd-letter-spacing-normal);
    color: var(--gd-color-neutral-700);
    padding: var(--gd-spacing-x-small) var(--gd-spacing-medium) var(--gd-spacing-x-small) var(--gd-spacing-x-small);
    transition: var(--gd-transition-fast) fill;
    cursor: pointer;
  }

  .option--hover:not(.option--current):not(.option--disabled) {
    background-color: var(--gd-color-neutral-100);
    color: var(--gd-color-neutral-1000);
  }

  .option--current,
  .option--current.option--disabled {
    background-color: var(--gd-color-primary-600);
    color: var(--gd-color-neutral-0);
    opacity: 1;
  }

  .option--disabled {
    outline: none;
    opacity: 0.5;
    cursor: not-allowed;
  }

  .option__label {
    flex: 1 1 auto;
    display: inline-block;
    line-height: var(--gd-line-height-dense);
  }

  .option .option__check {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    justify-content: center;
    visibility: hidden;
    padding-inline-end: var(--gd-spacing-2x-small);
  }

  .option--selected .option__check {
    visibility: visible;
  }

  .option__prefix,
  .option__suffix {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
  }

  .option__prefix::slotted(*) {
    margin-inline-end: var(--gd-spacing-x-small);
  }

  .option__suffix::slotted(*) {
    margin-inline-start: var(--gd-spacing-x-small);
  }

  @media (forced-colors: active) {
    :host(:hover:not([aria-disabled='true'])) .option {
      outline: dashed 1px SelectedItem;
      outline-offset: -1px;
    }
  }
`;
