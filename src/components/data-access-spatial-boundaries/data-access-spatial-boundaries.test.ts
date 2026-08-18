import { expect, fixture, html } from '@open-wc/testing'
import './data-access-spatial-boundaries.js'

describe('<terra-data-access-spatial-boundaries>', () => {
    it('should render a component', async () => {
        const el = await fixture(html`<terra-data-access-spatial-boundaries></terra-data-access-spatial-boundaries>`)

        expect(el).to.exist
    })
})
