import '../../../dist/terra-ui-components.js'
import { expect, fixture, html } from '@open-wc/testing'

describe('<terra-tag>', () => {
    it('should render a component', async () => {
        const el = await fixture(html` <terra-tag></terra-tag> `)

        expect(el).to.exist
    })
})
