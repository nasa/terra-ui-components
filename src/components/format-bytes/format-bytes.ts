import SlFormatBytes from './format-bytes.component.js';

export * from './format-bytes.component.js';
export default SlFormatBytes;

SlFormatBytes.define('gd-format-bytes');

declare global {
  interface HTMLElementTagNameMap {
    'gd-format-bytes': SlFormatBytes;
  }
}
