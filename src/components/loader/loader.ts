import EduxLoader from './loader.component.js';

export * from './loader.component.js';
export default EduxLoader;

EduxLoader.define('edux-loader');

declare global {
    interface HTMLElementTagNameMap {
      'edux-loader': EduxLoader;
    }
}
