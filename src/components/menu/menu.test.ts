import '../../../dist/terra-ui-components.js'
import { expect, fixture, html } from '@open-wc/testing'

describe('<terra-menu>', () => {
    it('should render a component', async () => {
        const el = await fixture(html` <terra-menu></terra-menu> `)

        expect(el).to.exist
    })
})
