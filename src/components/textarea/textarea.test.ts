import '../../../dist/terra-ui-components.js'
import { expect, fixture, html } from '@open-wc/testing'

describe('<terra-textarea>', () => {
    it('should render a component', async () => {
        const el = await fixture(html` <terra-textarea></terra-textarea> `)

        expect(el).to.exist
    })
})
