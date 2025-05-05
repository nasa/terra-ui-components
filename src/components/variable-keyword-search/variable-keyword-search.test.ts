import '../../../dist/terra-ui-components.js'
import { expect, fixture, html } from '@open-wc/testing'

describe('<terra-variable-keyword-search>', () => {
    it('should render a component', async () => {
        const el = await fixture(html`
            <terra-variable-keyword-search></terra-variable-keyword-search>
        `)

        expect(el).to.exist
    })
})
