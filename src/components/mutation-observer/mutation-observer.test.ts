import '../../../dist/gesdisc-components.js';
import { expect, fixture, html } from '@open-wc/testing';

describe('<gd-mutation-observer>', () => {
  it('should render a component', async () => {
    const el = await fixture(html` <gd-mutation-observer></gd-mutation-observer> `);

    expect(el).to.exist;
  });
});
