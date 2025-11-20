import '../../../dist/terra-ui-components.js'
import { expect, fixture, html } from '@open-wc/testing'

describe('<terra-select>', () => {
    it('should render a component', async () => {
        const el = await fixture(html` <terra-select></terra-select> `)

        expect(el).to.exist
    })
})
