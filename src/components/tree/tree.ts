import SlTree from './tree.component.js';

export * from './tree.component.js';
export default SlTree;

SlTree.define('gd-tree');

declare global {
  interface HTMLElementTagNameMap {
    'gd-tree': SlTree;
  }
}
