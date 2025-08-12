import '../../../dist/terra-ui-components.js'
import { expect, fixture, html } from '@open-wc/testing'

describe('<terra-data-subsetter-history>', () => {
    it('should render a component', async () => {
        const el = await fixture(html`
            <terra-data-subsetter-history></terra-data-subsetter-history>
        `)

        expect(el).to.exist
    })
})
