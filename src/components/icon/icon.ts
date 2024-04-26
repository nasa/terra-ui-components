import GdIcon from './icon.component.js';

export * from './icon.component.js';
export default GdIcon;

GdIcon.define('gd-icon');

declare global {
    interface HTMLElementTagNameMap {
      'gd-icon': GdIcon;
    }
}
