import SlIcon from './icon.component.js';

export * from './icon.component.js';
export default SlIcon;

SlIcon.define('gd-icon');

declare global {
  interface HTMLElementTagNameMap {
    'gd-icon': SlIcon;
  }
}
