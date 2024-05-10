import GdSpatialPicker from './spatial-picker.component.js';

export * from './spatial-picker.component.js';
export default GdSpatialPicker;

GdSpatialPicker.define('gd-spatial-picker');

declare global {
  interface HTMLElementTagNameMap {
    'gd-spatial-picker': GdSpatialPicker;
  }
}
