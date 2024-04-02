import SlSelect from './select.component.js';

export * from './select.component.js';
export default SlSelect;

SlSelect.define('gd-select');

declare global {
  interface HTMLElementTagNameMap {
    'gd-select': SlSelect;
  }
}
