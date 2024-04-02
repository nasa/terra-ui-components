import SlRadioButton from './radio-button.component.js';

export * from './radio-button.component.js';
export default SlRadioButton;

SlRadioButton.define('gd-radio-button');

declare global {
  interface HTMLElementTagNameMap {
    'gd-radio-button': SlRadioButton;
  }
}
