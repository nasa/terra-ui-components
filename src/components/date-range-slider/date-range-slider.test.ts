import '../../../dist/gesdisc-components.js';
import { expect, fixture, html } from '@open-wc/testing';

describe('<gd-date-range-slider>', () => {
    it('should render a component', async () => {
        const el = await fixture(html` <gd-date-range-slider></gd-date-range-slider> `);

        expect(el).to.exist;
    });
});
