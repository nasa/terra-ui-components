import '../../../dist/earthdata-ux-components.js';
import { expect, fixture, html } from '@open-wc/testing';

describe('<edux-combobox>', () => {
    it('should render a component', async () => {
        const el = await fixture(html` <edux-combobox></edux-combobox> `);

        expect(el).to.exist;
    });
});
