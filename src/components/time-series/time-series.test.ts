import '../../../dist/terra-ui-components.js'
import { expect, fixture, html } from '@open-wc/testing'

describe('<terra-time-series>', () => {
    it('should render a component', async () => {
        const el = await fixture(html` <terra-time-series></terra-time-series> `)

        expect(el).to.exist
    })
})
