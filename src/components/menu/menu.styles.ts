import { css } from 'lit';

export default css`
  :host {
    display: block;
    position: relative;
    background: var(--gd-panel-background-color);
    border: solid var(--gd-panel-border-width) var(--gd-panel-border-color);
    border-radius: var(--gd-border-radius-medium);
    padding: var(--gd-spacing-x-small) 0;
    overflow: auto;
    overscroll-behavior: none;
  }

  ::slotted(gd-divider) {
    --spacing: var(--gd-spacing-x-small);
  }
`;
