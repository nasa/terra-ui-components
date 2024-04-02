import SlMenu from './menu.component.js';

export * from './menu.component.js';
export default SlMenu;

SlMenu.define('gd-menu');

declare global {
  interface HTMLElementTagNameMap {
    'gd-menu': SlMenu;
  }
}
