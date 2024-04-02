import SlTab from './tab.component.js';

export * from './tab.component.js';
export default SlTab;

SlTab.define('gd-tab');

declare global {
  interface HTMLElementTagNameMap {
    'gd-tab': SlTab;
  }
}
