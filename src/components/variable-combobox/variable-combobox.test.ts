import '../../../dist/gesdisc-components.js';
import { expect, fixture, html } from '@open-wc/testing';

describe('<gd-variable-combobox>', () => {
  it('should render a component', async () => {
    const el = await fixture(html` <gd-variable-combobox></gd-variable-combobox> `);

    expect(el).to.exist;
  });
});
