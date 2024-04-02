import GdTimeSeriesPlot from './time-series-plot.component.js';

export * from './time-series-plot.component.js';
export default GdTimeSeriesPlot;

GdTimeSeriesPlot.define('gd-time-series-plot');

declare global {
  interface HTMLElementTagNameMap {
    'gd-time-series-plot': GdTimeSeriesPlot;
  }
}
