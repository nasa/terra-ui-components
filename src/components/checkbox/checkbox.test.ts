import '../../../dist/terra-ui-components.js'
import { expect, fixture, html } from '@open-wc/testing'

describe('<terra-checkbox>', () => {
    it('should render a component', async () => {
        const el = await fixture(html` <terra-checkbox></terra-checkbox> `)

        expect(el).to.exist
    })
})
