import SlSkeleton from './skeleton.component.js';

export * from './skeleton.component.js';
export default SlSkeleton;

SlSkeleton.define('gd-skeleton');

declare global {
  interface HTMLElementTagNameMap {
    'gd-skeleton': SlSkeleton;
  }
}
