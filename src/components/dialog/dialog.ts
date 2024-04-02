import SlDialog from './dialog.component.js';

export * from './dialog.component.js';
export default SlDialog;

SlDialog.define('gd-dialog');

declare global {
  interface HTMLElementTagNameMap {
    'gd-dialog': SlDialog;
  }
}
