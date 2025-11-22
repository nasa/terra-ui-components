import '../../../dist/terra-ui-components.js'
import { expect, fixture, html } from '@open-wc/testing'

describe('<terra-file-upload>', () => {
    it('should render a component', async () => {
        const el = await fixture(html` <terra-file-upload></terra-file-upload> `)

        expect(el).to.exist
    })
})
