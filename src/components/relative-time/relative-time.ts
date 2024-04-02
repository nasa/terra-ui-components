import SlRelativeTime from './relative-time.component.js';

export * from './relative-time.component.js';
export default SlRelativeTime;

SlRelativeTime.define('gd-relative-time');

declare global {
  interface HTMLElementTagNameMap {
    'gd-relative-time': SlRelativeTime;
  }
}
