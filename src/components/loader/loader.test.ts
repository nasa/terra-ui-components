import '../../../dist/earthdata-ux-components.js';
import { expect, fixture, html } from '@open-wc/testing';

describe('<edux-loader>', () => {
    it('should render a loader component', async () => {
        const el = await fixture(html` <edux-loader></edux-loader> `);

        expect(el).to.exist;
    });
});

describe('<edux-loader percent="50">', () => {
    it('should render a loader component indicating 50%', async () => {
        const el = await fixture(html` <edux-loader percent="50"></edux-loader> `);

        expect(el).to.exist;
        expect(el.querySelector('div.percent')?.innerHTML).to.equal('50%')
    });
});
