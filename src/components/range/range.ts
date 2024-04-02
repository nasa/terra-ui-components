import SlRange from './range.component.js';

export * from './range.component.js';
export default SlRange;

SlRange.define('gd-range');

declare global {
  interface HTMLElementTagNameMap {
    'gd-range': SlRange;
  }
}
