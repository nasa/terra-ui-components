import '../../../dist/terra-ui-components.js'
import { expect, fixture, html } from '@open-wc/testing'

describe('<terra-plot-toolbar>', () => {
    it('should render a component', async () => {
        const el = await fixture(html` <terra-plot-toolbar></terra-plot-toolbar> `)

        expect(el).to.exist
    })
})
