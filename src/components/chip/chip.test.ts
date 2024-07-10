import '../../../dist/earthdata-ux-components.js'
import { expect, fixture, html } from '@open-wc/testing'
describe('<edux-chip>', () => {
    it('should render a component', async () => {
        const el = await fixture(html` <edux-chip></edux-chip> `)

        expect(el).to.exist
    })
})
describe('<edux-chip content="potato">', () => {
    it('should render a component', async () => {
        const el = await fixture(html` <edux-chip>potato</edux-chip> `)

        expect(el).to.exist
    })
})
