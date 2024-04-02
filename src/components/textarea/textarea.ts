import SlTextarea from './textarea.component.js';

export * from './textarea.component.js';
export default SlTextarea;

SlTextarea.define('gd-textarea');

declare global {
  interface HTMLElementTagNameMap {
    'gd-textarea': SlTextarea;
  }
}
