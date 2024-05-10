import GdMap from './map.component.js';

export * from './map.component.js';
export default GdMap;

GdMap.define('gd-map');

declare global {
    interface HTMLElementTagNameMap {
      'gd-map': GdMap;
    }
}
