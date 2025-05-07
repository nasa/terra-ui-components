import '../../../dist/terra-ui-components.js'
import { expect, fixture, html } from '@open-wc/testing'

describe('<terra-skeleton>', () => {
    it('should render a component', async () => {
        const el = await fixture(html` <terra-skeleton></terra-skeleton> `)

        expect(el).to.exist
    })
})
