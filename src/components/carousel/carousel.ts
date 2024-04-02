import SlCarousel from './carousel.component.js';

export * from './carousel.component.js';
export default SlCarousel;

SlCarousel.define('gd-carousel');

declare global {
  interface HTMLElementTagNameMap {
    'gd-carousel': SlCarousel;
  }
}
