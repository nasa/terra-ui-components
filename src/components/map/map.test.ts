import '../../../dist/gesdisc-components.js'
import { expect, fixture, html } from '@open-wc/testing'

describe('<terra-map>', () => {
    it('should render a component', async () => {
        const el = await fixture(html` <terra-map></terra-map> `)

        expect(el).to.exist
    })
})
