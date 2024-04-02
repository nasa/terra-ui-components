import SlCopyButton from './copy-button.component.js';

export * from './copy-button.component.js';
export default SlCopyButton;

SlCopyButton.define('gd-copy-button');

declare global {
  interface HTMLElementTagNameMap {
    'gd-copy-button': SlCopyButton;
  }
}
