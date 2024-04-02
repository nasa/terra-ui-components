import SlRating from './rating.component.js';

export * from './rating.component.js';
export default SlRating;

SlRating.define('gd-rating');

declare global {
  interface HTMLElementTagNameMap {
    'gd-rating': SlRating;
  }
}
