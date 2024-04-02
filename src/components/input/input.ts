import SlInput from './input.component.js';

export * from './input.component.js';
export default SlInput;

SlInput.define('gd-input');

declare global {
  interface HTMLElementTagNameMap {
    'gd-input': SlInput;
  }
}
