import '../../../dist/terra-ui-components.js'
import { expect, fixture, html } from '@open-wc/testing'

describe('<terra-giovanni-search>', () => {
    it('should render a component', async () => {
        const el = await fixture(html`
            <terra-giovanni-search></terra-giovanni-search>
        `)

        expect(el).to.exist
    })
})
