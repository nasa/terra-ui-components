import '../../../dist/terra-ui-components.js'
import { expect, fixture, html } from '@open-wc/testing'
describe('<terra-chip>', () => {
    it('should render a component', async () => {
        const el = await fixture(html` <terra-chip></terra-chip> `)

        expect(el).to.exist
    })
})
describe('<terra-chip content="potato">', () => {
    it('should render a component', async () => {
        const el = await fixture(html` <terra-chip>potato</terra-chip> `)

        expect(el).to.exist
    })
})
