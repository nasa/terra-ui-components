import '../../../dist/terra-ui-components.js'
import { expect, fixture, html } from '@open-wc/testing'

describe('<terra-alert>', () => {
    it('should render a component', async () => {
        const el = await fixture(html` <terra-alert></terra-alert> `)

        expect(el).to.exist
    })
})
