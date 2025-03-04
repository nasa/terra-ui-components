import { expect, fixture, html } from '@open-wc/testing'
import '../../../dist/terra-ui-components.js'

describe('<terra-browse-variables>', () => {
    it('should render a component', async () => {
        const el = await fixture(html`
            <terra-browse-variables></terra-browse-variables>
        `)

        expect(el).to.exist
    })
})
