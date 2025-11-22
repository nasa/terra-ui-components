import '../../../dist/terra-ui-components.js'
import { expect, fixture, html } from '@open-wc/testing'

describe('<terra-status-indicator>', () => {
    it('should render a component', async () => {
        const el = await fixture(html`
            <terra-status-indicator></terra-status-indicator>
        `)

        expect(el).to.exist
    })
})
