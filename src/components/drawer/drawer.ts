import SlDrawer from './drawer.component.js';

export * from './drawer.component.js';
export default SlDrawer;

SlDrawer.define('gd-drawer');

declare global {
  interface HTMLElementTagNameMap {
    'gd-drawer': SlDrawer;
  }
}
