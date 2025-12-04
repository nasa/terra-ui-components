import '../../../dist/terra-ui-components.js'
import { expect, fixture, html } from '@open-wc/testing'

describe('<terra-site-navigation>', () => {
    it('should render a component', async () => {
        const el = await fixture(html`
            <terra-site-navigation></terra-site-navigation>
        `)

        expect(el).to.exist
    })
})
