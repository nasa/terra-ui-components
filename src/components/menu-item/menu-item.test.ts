import '../../../dist/terra-ui-components.js'
import { expect, fixture, html } from '@open-wc/testing'

describe('<terra-menu-item>', () => {
    it('should render a component', async () => {
        const el = await fixture(html` <terra-menu-item></terra-menu-item> `)

        expect(el).to.exist
    })
})
