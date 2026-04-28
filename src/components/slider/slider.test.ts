import '../../../dist/terra-ui-components.js'
import { expect, fixture, html } from '@open-wc/testing'

describe('<terra-slider>', () => {
    it('should render a component', async () => {
        const el = await fixture(html` <terra-slider></terra-slider> `)

        expect(el).to.exist
    })
})
