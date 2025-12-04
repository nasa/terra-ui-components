import '../../../dist/terra-ui-components.js'
import { expect, fixture, html } from '@open-wc/testing'

describe('<terra-site-header>', () => {
    it('should render a component', async () => {
        const el = await fixture(html` <terra-site-header></terra-site-header> `)

        expect(el).to.exist
    })
})
