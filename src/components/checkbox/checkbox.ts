import SlCheckbox from './checkbox.component.js';

export * from './checkbox.component.js';
export default SlCheckbox;

SlCheckbox.define('gd-checkbox');

declare global {
  interface HTMLElementTagNameMap {
    'gd-checkbox': SlCheckbox;
  }
}
