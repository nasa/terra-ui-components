import SlIconButton from './icon-button.component.js';

export * from './icon-button.component.js';
export default SlIconButton;

SlIconButton.define('gd-icon-button');

declare global {
  interface HTMLElementTagNameMap {
    'gd-icon-button': SlIconButton;
  }
}
