import SlCarouselItem from './carousel-item.component.js';

export * from './carousel-item.component.js';
export default SlCarouselItem;

SlCarouselItem.define('gd-carousel-item');

declare global {
  interface HTMLElementTagNameMap {
    'gd-carousel-item': SlCarouselItem;
  }
}
