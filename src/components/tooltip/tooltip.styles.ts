import { css } from 'lit';

export default css`
  :host {
    --max-width: 20rem;
    --hide-delay: 0ms;
    --show-delay: 150ms;

    display: contents;
  }

  .tooltip {
    --arrow-size: var(--gd-tooltip-arrow-size);
    --arrow-color: var(--gd-tooltip-background-color);
  }

  .tooltip::part(popup) {
    z-index: var(--gd-z-index-tooltip);
  }

  .tooltip[placement^='top']::part(popup) {
    transform-origin: bottom;
  }

  .tooltip[placement^='bottom']::part(popup) {
    transform-origin: top;
  }

  .tooltip[placement^='left']::part(popup) {
    transform-origin: right;
  }

  .tooltip[placement^='right']::part(popup) {
    transform-origin: left;
  }

  .tooltip__body {
    display: block;
    width: max-content;
    max-width: var(--max-width);
    border-radius: var(--gd-tooltip-border-radius);
    background-color: var(--gd-tooltip-background-color);
    font-family: var(--gd-tooltip-font-family);
    font-size: var(--gd-tooltip-font-size);
    font-weight: var(--gd-tooltip-font-weight);
    line-height: var(--gd-tooltip-line-height);
    text-align: start;
    white-space: normal;
    color: var(--gd-tooltip-color);
    padding: var(--gd-tooltip-padding);
    pointer-events: none;
    user-select: none;
    -webkit-user-select: none;
  }
`;
