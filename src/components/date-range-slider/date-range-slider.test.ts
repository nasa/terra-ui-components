import '../../../dist/terra-ui-components.js'
import { expect, fixture, html } from '@open-wc/testing'

describe('<terra-date-range-slider>', () => {
    it('should render a component', async () => {
        const el = await fixture(html`
            <terra-date-range-slider></terra-date-range-slider>
        `)

        expect(el).to.exist
    })
})
