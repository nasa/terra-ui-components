import { css } from 'lit';
export default css`
  :host {
    display: block;
  }

  .menu-label {
    display: inline-block;
    font-family: var(--gd-font-sans);
    font-size: var(--gd-font-size-small);
    font-weight: var(--gd-font-weight-semibold);
    line-height: var(--gd-line-height-normal);
    letter-spacing: var(--gd-letter-spacing-normal);
    color: var(--gd-color-neutral-500);
    padding: var(--gd-spacing-2x-small) var(--gd-spacing-x-large);
    user-select: none;
    -webkit-user-select: none;
  }
`;
