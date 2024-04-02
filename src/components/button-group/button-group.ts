import SlButtonGroup from './button-group.component.js';

export * from './button-group.component.js';
export default SlButtonGroup;

SlButtonGroup.define('gd-button-group');

declare global {
  interface HTMLElementTagNameMap {
    'gd-button-group': SlButtonGroup;
  }
}
