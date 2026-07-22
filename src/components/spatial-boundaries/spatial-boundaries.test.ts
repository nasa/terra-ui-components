import { expect, fixture, html } from '@open-wc/testing'
import './spatial-boundaries.js'

describe('<terra-spatial-boundaries>', () => {
    it('should render a component', async () => {
        const el = await fixture(html`<terra-spatial-boundaries></terra-spatial-boundaries>`)

        expect(el).to.exist
    })
})
