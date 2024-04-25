import GdVariableCombobox from './variable-combobox.component.js';

export * from './variable-combobox.component.js';
export default GdVariableCombobox;

GdVariableCombobox.define('gd-variable-combobox');

declare global {
  interface HTMLElementTagNameMap {
    'gd-variable-combobox': GdVariableCombobox;
  }
}
