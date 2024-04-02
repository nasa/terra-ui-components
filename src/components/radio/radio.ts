import SlRadio from './radio.component.js';

export * from './radio.component.js';
export default SlRadio;

SlRadio.define('gd-radio');

declare global {
  interface HTMLElementTagNameMap {
    'gd-radio': SlRadio;
  }
}
