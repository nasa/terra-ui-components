import GdPlot from './plot.component.js';

export * from './plot.component.js';
export default GdPlot;

GdPlot.define('gd-plot');

declare global {
  interface HTMLElementTagNameMap {
    'gd-plot': GdPlot;
  }
}
