import SlProgressBar from './progress-bar.component.js';

export * from './progress-bar.component.js';
export default SlProgressBar;

SlProgressBar.define('gd-progress-bar');

declare global {
  interface HTMLElementTagNameMap {
    'gd-progress-bar': SlProgressBar;
  }
}
