import '../../../dist/gesdisc-components.js'
import { expect, fixture, html } from '@open-wc/testing'

describe('<edux-map>', () => {
    it('should render a component', async () => {
        const el = await fixture(html` <edux-map></edux-map> `)

        expect(el).to.exist
    })
})
