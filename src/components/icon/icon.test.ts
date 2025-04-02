import '../../../dist/terra-ui-components.js'
import { expect, fixture, html } from '@open-wc/testing'

describe('<terra-icon>', () => {
    it('should render a component', async () => {
        const el = await fixture(html` <terra-icon></terra-icon> `)

        expect(el).to.exist
    })
})
