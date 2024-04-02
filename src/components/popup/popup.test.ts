import '../../../dist/gesdisc-components.js';
import { expect, fixture, html } from '@open-wc/testing';

describe('<gd-popup>', () => {
  it('should render a component', async () => {
    const el = await fixture(html` <gd-popup></gd-popup> `);

    expect(el).to.exist;
  });
});
