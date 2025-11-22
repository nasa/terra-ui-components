import '../../../dist/terra-ui-components.js'
import { expect, fixture, html } from '@open-wc/testing'

describe('<terra-tab>', () => {
    it('should render a component', async () => {
        const el = await fixture(html` <terra-tab></terra-tab> `)

        expect(el).to.exist
    })
})
