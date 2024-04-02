import SlTreeItem from './tree-item.component.js';

export * from './tree-item.component.js';
export default SlTreeItem;

SlTreeItem.define('gd-tree-item');

declare global {
  interface HTMLElementTagNameMap {
    'gd-tree-item': SlTreeItem;
  }
}
