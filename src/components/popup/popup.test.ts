import '../../../dist/terra-ui-components.js'
import { expect, fixture, html } from '@open-wc/testing'

describe('<terra-popup>', () => {
    it('should render a component', async () => {
        const el = await fixture(html` <terra-popup></terra-popup> `)

        expect(el).to.exist
    })
})
