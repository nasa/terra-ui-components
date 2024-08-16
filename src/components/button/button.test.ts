import '../../../dist/terra-ui-components.js'
import { expect, fixture, html } from '@open-wc/testing'

describe('<terra-button>', () => {
    it('should render a component', async () => {
        const el = await fixture(html` <terra-button></terra-button> `)

        expect(el).to.exist
    })
})
