import '../../../dist/terra-ui-components.js'
import { expect, fixture, html } from '@open-wc/testing'

describe('<terra-avatar>', () => {
    it('should render a component', async () => {
        const el = await fixture(html` <terra-avatar></terra-avatar> `)

        expect(el).to.exist
    })
})
