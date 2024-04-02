import SlDetails from './details.component.js';

export * from './details.component.js';
export default SlDetails;

SlDetails.define('gd-details');

declare global {
  interface HTMLElementTagNameMap {
    'gd-details': SlDetails;
  }
}
