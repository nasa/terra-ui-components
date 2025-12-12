import '../../../dist/terra-ui-components.js'
import { expect, fixture, html } from '@open-wc/testing'

describe('<terra-badge>', () => {
    it('should render a component', async () => {
        const el = await fixture(html` <terra-badge></terra-badge> `)

        expect(el).to.exist
    })
})
