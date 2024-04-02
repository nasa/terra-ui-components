import SlAlert from './alert.component.js';

export * from './alert.component.js';
export default SlAlert;

SlAlert.define('gd-alert');

declare global {
  interface HTMLElementTagNameMap {
    'gd-alert': SlAlert;
  }
}
