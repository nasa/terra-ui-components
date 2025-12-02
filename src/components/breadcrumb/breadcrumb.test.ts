import '../../../dist/terra-ui-components.js'
import { expect, fixture, html } from '@open-wc/testing'

describe('<terra-breadcrumb>', () => {
    it('should render a component', async () => {
        const el = await fixture(html` <terra-breadcrumb></terra-breadcrumb> `)

        expect(el).to.exist
    })
})
