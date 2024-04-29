import '../../../dist/earthdata-ux-components.js'
import { expect, fixture, html } from '@open-wc/testing'

describe('<edux-date-range-slider>', () => {
    it('should render a component', async () => {
        const el = await fixture(html`
            <edux-date-range-slider></edux-date-range-slider>
        `)

        expect(el).to.exist
    })
})
