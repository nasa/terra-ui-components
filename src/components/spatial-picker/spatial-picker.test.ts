import '../../../dist/gesdisc-components.js'
import { expect, fixture, html } from '@open-wc/testing'

describe('<terra-spatial-picker>', () => {
    it('should render a component', async () => {
        const el = await fixture(html`
            <terra-spatial-picker></terra-spatial-picker>
        `)

        expect(el).to.exist
    })
})
