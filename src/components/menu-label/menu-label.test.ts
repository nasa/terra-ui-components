import '../../../dist/gesdisc-components.js';
import { expect, fixture, html } from '@open-wc/testing';
import type SlMenuLabel from './menu-label.js';

describe('<gd-menu-label>', () => {
  it('passes accessibility test', async () => {
    const el = await fixture<SlMenuLabel>(html` <gd-menu-label>Test</gd-menu-label> `);
    await expect(el).to.be.accessible();
  });
});
