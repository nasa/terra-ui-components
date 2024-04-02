import SlCard from './card.component.js';

export * from './card.component.js';
export default SlCard;

SlCard.define('gd-card');

declare global {
  interface HTMLElementTagNameMap {
    'gd-card': SlCard;
  }
}
