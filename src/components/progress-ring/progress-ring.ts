import SlProgressRing from './progress-ring.component.js';

export * from './progress-ring.component.js';
export default SlProgressRing;

SlProgressRing.define('gd-progress-ring');

declare global {
  interface HTMLElementTagNameMap {
    'gd-progress-ring': SlProgressRing;
  }
}
