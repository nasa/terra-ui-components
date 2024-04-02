import SlPopup from './popup.component.js';

export * from './popup.component.js';
export default SlPopup;

SlPopup.define('gd-popup');

declare global {
  interface HTMLElementTagNameMap {
    'gd-popup': SlPopup;
  }
}
