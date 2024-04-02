import SlTag from './tag.component.js';

export * from './tag.component.js';
export default SlTag;

SlTag.define('gd-tag');

declare global {
  interface HTMLElementTagNameMap {
    'gd-tag': SlTag;
  }
}
