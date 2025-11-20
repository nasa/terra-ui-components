import '../../../dist/terra-ui-components.js'
import { expect, fixture, html } from '@open-wc/testing'

describe('<terra-dropdown>', () => {
    it('should render a component', async () => {
        const el = await fixture(html` <terra-dropdown></terra-dropdown> `)

        expect(el).to.exist
    })
})
