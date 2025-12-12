import '../../../dist/terra-ui-components.js'
import { expect, fixture, html } from '@open-wc/testing'

describe('<terra-tooltip>', () => {
    it('should render a component', async () => {
        const el = await fixture(html` <terra-tooltip></terra-tooltip> `)

        expect(el).to.exist
    })
})
