import '../../../dist/gesdisc-components.js';
import { expect, fixture, html } from '@open-wc/testing';

describe('<gd-spatial-picker>', () => {
  it('should render a component', async () => {
    const el = await fixture(html` <gd-spatial-picker></gd-spatial-picker> `);

    expect(el).to.exist;
  });
});
