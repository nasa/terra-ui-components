import SlFormatDate from './format-date.component.js';

export * from './format-date.component.js';
export default SlFormatDate;

SlFormatDate.define('gd-format-date');

declare global {
  interface HTMLElementTagNameMap {
    'gd-format-date': SlFormatDate;
  }
}
