import SlTabGroup from './tab-group.component.js';

export * from './tab-group.component.js';
export default SlTabGroup;

SlTabGroup.define('gd-tab-group');

declare global {
  interface HTMLElementTagNameMap {
    'gd-tab-group': SlTabGroup;
  }
}
