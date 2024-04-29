import '../../../dist/gesdisc-components.js'
import { expect, fixture, html } from '@open-wc/testing'

describe('<edux-icon>', () => {
    it('should render a component', async () => {
        const el = await fixture(html` <edux-icon></edux-icon> `)

        expect(el).to.exist
    })
})
