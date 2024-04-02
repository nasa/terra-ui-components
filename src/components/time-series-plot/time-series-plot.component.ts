import { html } from 'lit';
import { property } from 'lit/decorators.js';
//import { LocalizeController } from '../../utilities/localize.js';
import { watch } from '../../internal/watch.js';
import componentStyles from '../../styles/component.styles.js';
import GDElement from '../../internal/gd-element.js';
import Plotly from 'plotly.js-dist/plotly.js';
import styles from './time-series-plot.styles.js';
import type { CSSResultGroup } from 'lit';

/**
 * @summary Short summary of the component's intended use.
 * @documentation https://disc.gsfc.nasa.gov/components/time-series-plot
 * @status experimental
 * @since 2.0
 *
 * @dependency gd-example
 *
 * @csspart base - The component's base wrapper.
 *
 * @cssproperty --example - An example CSS custom property.
 */
export default class GdTimeSeriesPlot extends GDElement {
  static styles: CSSResultGroup = [componentStyles, styles];

  //private readonly localize = new LocalizeController(this);

  private element: HTMLElement | null;

  /** An example attribute. */
  @property() data: any[] = [];

  @watch('data')
  handleDateChange() {
    console.log('data is now ', this.data);
  }

  connectedCallback() {
    super.connectedCallback();

    this.element = this.renderRoot.querySelector('div');
  }

  updatePlotWithData() {
    const trace1 = {
      type: 'scatter',
      mode: 'lines',
      name: 'AAPL High',
      x: this.unpack(this.data ?? [], 'Date'),
      y: this.unpack(this.data ?? [], 'AAPL.High'),
      line: { color: '#17BECF' }
    };

    const trace2 = {
      type: 'scatter',
      mode: 'lines',
      name: 'AAPL Low',
      x: this.unpack(this.data ?? [], 'Date'),
      y: this.unpack(this.data ?? [], 'AAPL.Low'),
      line: { color: '#7F7F7F' }
    };

    const layout = {
      title: 'Basic Time Series',
      margin: { t: 0 }
    };

    Plotly.newPlot(this.element, [trace1, trace2], layout);
  }

  unpack(rows: any[], key: string) {
    return rows.map(row => {
      return row[key];
    });
  }

  render() {
    return html` <div></div> `;
  }
}
