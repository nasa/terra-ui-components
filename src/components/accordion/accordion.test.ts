import '../../../dist/terra-ui-components.js'
import { expect, fixture, html } from '@open-wc/testing'

describe('<terra-accordion>', () => {
    it('should render a component', async () => {
        const el = await fixture(html` <terra-accordion></terra-accordion> `)

        expect(el).to.exist
    })
})
