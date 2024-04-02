import SlButton from './button.component.js';

export * from './button.component.js';
export default SlButton;

SlButton.define('gd-button');

declare global {
  interface HTMLElementTagNameMap {
    'gd-button': SlButton;
  }
}
