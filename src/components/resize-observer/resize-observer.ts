import SlResizeObserver from './resize-observer.component.js';

export * from './resize-observer.component.js';
export default SlResizeObserver;

SlResizeObserver.define('gd-resize-observer');

declare global {
  interface HTMLElementTagNameMap {
    'gd-resize-observer': SlResizeObserver;
  }
}
