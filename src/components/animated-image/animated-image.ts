import SlAnimatedImage from './animated-image.component.js';

export * from './animated-image.component.js';
export default SlAnimatedImage;

SlAnimatedImage.define('gd-animated-image');

declare global {
  interface HTMLElementTagNameMap {
    'gd-animated-image': SlAnimatedImage;
  }
}
