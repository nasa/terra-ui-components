import SlInclude from './include.component.js';

export * from './include.component.js';
export default SlInclude;

SlInclude.define('gd-include');

declare global {
  interface HTMLElementTagNameMap {
    'gd-include': SlInclude;
  }
}
