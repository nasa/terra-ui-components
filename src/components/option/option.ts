import SlOption from './option.component.js';

export * from './option.component.js';
export default SlOption;

SlOption.define('gd-option');

declare global {
  interface HTMLElementTagNameMap {
    'gd-option': SlOption;
  }
}
