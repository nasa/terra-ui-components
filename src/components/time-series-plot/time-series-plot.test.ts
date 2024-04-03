import '../../../dist/gesdisc-components.js'
import { expect, fixture, html } from '@open-wc/testing'

describe('<gd-time-series-plot>', () => {
    it('should render a component', async () => {
        const el = await fixture(html` <gd-time-series-plot></gd-time-series-plot> `)

        expect(el).to.exist
    })
})
