import '../../../dist/gesdisc-components.js'
import { expect, fixture, html } from '@open-wc/testing'

describe('<edux-spatial-picker>', () => {
    it('should render a component', async () => {
        const el = await fixture(html` <edux-spatial-picker></edux-spatial-picker> `)

        expect(el).to.exist
    })
})
