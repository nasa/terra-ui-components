import SlBadge from './badge.component.js';

export * from './badge.component.js';
export default SlBadge;

SlBadge.define('gd-badge');

declare global {
  interface HTMLElementTagNameMap {
    'gd-badge': SlBadge;
  }
}
