import '../../../dist/terra-ui-components.js';
import { expect, fixture, html } from '@open-wc/testing';

describe('<terra-giovanni-browse>', () => {
    it('should render a component', async () => {
        const el = await fixture(html` <terra-giovanni-browse></terra-giovanni-browse> `);

        expect(el).to.exist;
    });
});
