import '../../../dist/gesdisc-components.js'
import { expect, fixture, html } from '@open-wc/testing'

describe('<edux-button>', () => {
    it('should render a component', async () => {
        const el = await fixture(html` <edux-button></edux-button> `)

        expect(el).to.exist
    })
})
