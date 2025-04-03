import '../../../dist/terra-ui-components.js'
import { expect, fixture, html } from '@open-wc/testing'

describe('<terra-variable-combobox>', () => {
    it('should render a component', async () => {
        const el = await fixture(html`
            <terra-variable-combobox></terra-variable-combobox>
        `)

        expect(el).to.exist
    })
})
