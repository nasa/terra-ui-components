import SlVisuallyHidden from './visually-hidden.component.js';

export * from './visually-hidden.component.js';
export default SlVisuallyHidden;

SlVisuallyHidden.define('gd-visually-hidden');

declare global {
  interface HTMLElementTagNameMap {
    'gd-visually-hidden': SlVisuallyHidden;
  }
}
