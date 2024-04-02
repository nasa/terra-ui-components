import SlFormatNumber from './format-number.component.js';

export * from './format-number.component.js';
export default SlFormatNumber;

SlFormatNumber.define('gd-format-number');

declare global {
  interface HTMLElementTagNameMap {
    'gd-format-number': SlFormatNumber;
  }
}
