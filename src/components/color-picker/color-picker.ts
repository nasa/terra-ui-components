import SlColorPicker from './color-picker.component.js';

export * from './color-picker.component.js';
export default SlColorPicker;

SlColorPicker.define('gd-color-picker');

declare global {
  interface HTMLElementTagNameMap {
    'gd-color-picker': SlColorPicker;
  }
}
