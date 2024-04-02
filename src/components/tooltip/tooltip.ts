import SlTooltip from './tooltip.component.js';

export * from './tooltip.component.js';
export default SlTooltip;

SlTooltip.define('gd-tooltip');

declare global {
  interface HTMLElementTagNameMap {
    'gd-tooltip': SlTooltip;
  }
}
