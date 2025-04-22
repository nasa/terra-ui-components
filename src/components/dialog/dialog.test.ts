import '../../../dist/terra-ui-components.js'
import { expect, fixture, html } from '@open-wc/testing'

describe('<terra-dialog>', () => {
    it('should render a component', async () => {
        const el = await fixture(html` <terra-dialog></terra-dialog> `)

        expect(el).to.exist
    })
})
