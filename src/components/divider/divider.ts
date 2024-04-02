import SlDivider from './divider.component.js';

export * from './divider.component.js';
export default SlDivider;

SlDivider.define('gd-divider');

declare global {
  interface HTMLElementTagNameMap {
    'gd-divider': SlDivider;
  }
}
