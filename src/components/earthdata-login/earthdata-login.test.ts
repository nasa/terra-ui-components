import { expect, fixture, html } from '@open-wc/testing';
import './earthdata-login.js';

describe('<terra-earthdata-login>', () => {
    it('should render a component', async () => {
        const el = await fixture(html` <terra-earthdata-login></terra-earthdata-login> `);

        expect(el).to.exist;
    });
});
