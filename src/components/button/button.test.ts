import '../../../dist/gesdisc-components.js';
import { expect, fixture, html } from '@open-wc/testing';

describe('<gd-button>', () => {
    it('should render a component', async () => {
        const el = await fixture(html` <gd-button></gd-button> `);

        expect(el).to.exist;
    });
});
