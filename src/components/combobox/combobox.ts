import EduxCombobox from './combobox.component.js';

export * from './combobox.component.js';
export default EduxCombobox;

EduxCombobox.define('edux-combobox');

declare global {
    interface HTMLElementTagNameMap {
      'edux-combobox': EduxCombobox;
    }
}
