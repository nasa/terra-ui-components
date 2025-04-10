import '../../../dist/terra-ui-components.js'
import { expect, fixture, html } from '@open-wc/testing'

describe('<terra-login>', () => {
    it('should render a component', async () => {
        const el = await fixture(html` <terra-login></terra-login> `)

        expect(el).to.exist
    })
})
