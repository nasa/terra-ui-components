import SlDropdown from './dropdown.component.js';

export * from './dropdown.component.js';
export default SlDropdown;

SlDropdown.define('gd-dropdown');

declare global {
  interface HTMLElementTagNameMap {
    'gd-dropdown': SlDropdown;
  }
}
