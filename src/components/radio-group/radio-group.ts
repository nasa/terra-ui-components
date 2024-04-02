import SlRadioGroup from './radio-group.component.js';

export * from './radio-group.component.js';
export default SlRadioGroup;

SlRadioGroup.define('gd-radio-group');

declare global {
  interface HTMLElementTagNameMap {
    'gd-radio-group': SlRadioGroup;
  }
}
