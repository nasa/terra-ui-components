import SlImageComparer from './image-comparer.component.js';

export * from './image-comparer.component.js';
export default SlImageComparer;

SlImageComparer.define('gd-image-comparer');

declare global {
  interface HTMLElementTagNameMap {
    'gd-image-comparer': SlImageComparer;
  }
}
