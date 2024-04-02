import SlMenuLabel from './menu-label.component.js';

export * from './menu-label.component.js';
export default SlMenuLabel;

SlMenuLabel.define('gd-menu-label');

declare global {
  interface HTMLElementTagNameMap {
    'gd-menu-label': SlMenuLabel;
  }
}
