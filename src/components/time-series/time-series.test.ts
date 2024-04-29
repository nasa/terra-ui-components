import '../../../dist/gesdisc-components.js'
import { expect, fixture, html } from '@open-wc/testing'

describe('<edux-time-series>', () => {
    it('should render a component', async () => {
        const el = await fixture(html` <edux-time-series></edux-time-series> `)

        expect(el).to.exist
    })
})
