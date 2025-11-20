import '../../../dist/terra-ui-components.js'
import { expect, fixture, html } from '@open-wc/testing'

describe('<terra-radio>', () => {
    it('should render a component', async () => {
        const el = await fixture(html` <terra-radio></terra-radio> `)

        expect(el).to.exist
    })
})
