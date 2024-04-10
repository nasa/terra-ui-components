import '../../../dist/gesdisc-components.js';
import { expect, fixture, html } from '@open-wc/testing';

describe('<gd-plot>', () => {
  it('should render a component', async () => {
    const el = await fixture(html` <gd-plot></gd-plot> `);

    expect(el).to.exist;
  });
});
