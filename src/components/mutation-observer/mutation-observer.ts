import SlMutationObserver from './mutation-observer.component.js';

export * from './mutation-observer.component.js';
export default SlMutationObserver;

SlMutationObserver.define('gd-mutation-observer');

declare global {
  interface HTMLElementTagNameMap {
    'gd-mutation-observer': SlMutationObserver;
  }
}
