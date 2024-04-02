import SlSwitch from './switch.component.js';

export * from './switch.component.js';
export default SlSwitch;

SlSwitch.define('gd-switch');

declare global {
  interface HTMLElementTagNameMap {
    'gd-switch': SlSwitch;
  }
}
