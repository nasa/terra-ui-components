import '../../../dist/terra-ui-components.js'
import { expect, fixture, html } from '@open-wc/testing'

describe('<terra-browse-variables>', () => {
    it('should render a loader component', async () => {
        const el = await fixture(html`
            <terra-browse-variables></terra-browse-variables>
        `)

        expect(el).to.exist
    })
})
