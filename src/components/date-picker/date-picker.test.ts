import { expect, fixture, html } from '@open-wc/testing'
import './date-picker.js'

describe('<terra-date-picker>', () => {
    it('should render a component', async () => {
        const el = await fixture(html` <terra-date-picker></terra-date-picker> `)

        expect(el).to.exist
    })
})
