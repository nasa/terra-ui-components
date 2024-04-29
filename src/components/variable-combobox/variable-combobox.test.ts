import '../../../dist/earthdata-ux-components.js'
import { expect, fixture, html } from '@open-wc/testing'

describe('<edux-variable-combobox>', () => {
    it('should render a component', async () => {
        const el = await fixture(html`
            <edux-variable-combobox></edux-variable-combobox>
        `)

        expect(el).to.exist
    })
})
