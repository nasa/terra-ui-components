import '../../../dist/terra-ui-components.js'
import { expect, fixture, html } from '@open-wc/testing'

describe('<terra-breadcrumbs>', () => {
    it('should render a component', async () => {
        const el = await fixture(html` <terra-breadcrumbs></terra-breadcrumbs> `)

        expect(el).to.exist
    })
})
