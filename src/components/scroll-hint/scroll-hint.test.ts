import '../../../dist/terra-ui-components.js'
import { expect, fixture, html } from '@open-wc/testing'

describe('<terra-scroll-hint>', () => {
    it('should render a component', async () => {
        const el = await fixture(html` <terra-scroll-hint></terra-scroll-hint> `)

        expect(el).to.exist
    })
})
