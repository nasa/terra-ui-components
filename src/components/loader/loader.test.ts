import '../../../dist/terra-ui-components.js'
import { expect, fixture, html } from '@open-wc/testing'

describe('<terra-loader>', () => {
    it('should render a loader component', async () => {
        const el = await fixture(html` <terra-loader></terra-loader> `)

        expect(el).to.exist
    })
})

describe('<terra-loader percent="50">', () => {
    it('should render a loader component indicating 50%', async () => {
        const el = await fixture(html` <terra-loader percent="50"></terra-loader> `)

        expect(el).to.exist
        expect(el.querySelector('div.percent')?.innerHTML).to.equal('50%')
    })
})
