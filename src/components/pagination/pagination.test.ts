import '../../../dist/terra-ui-components.js'
import { expect, fixture, html } from '@open-wc/testing'

describe('<terra-pagination>', () => {
    it('should render a component', async () => {
        const el = await fixture(html` <terra-pagination></terra-pagination> `)

        expect(el).to.exist
    })
})
