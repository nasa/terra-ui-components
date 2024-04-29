import '../../../dist/gesdisc-components.js';
import { expect, fixture, html } from '@open-wc/testing';

describe('<gd-icon>', () => {
    it('should render a component', async () => {
        const el = await fixture(html` <gd-icon></gd-icon> `);

        expect(el).to.exist;
    });
});
