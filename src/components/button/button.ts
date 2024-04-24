import GdButton from './button.component.js';

export * from './button.component.js';
export default GdButton;

GdButton.define('gd-button');

declare global {
    interface HTMLElementTagNameMap {
      'gd-button': GdButton;
    }
}
