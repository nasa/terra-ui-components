import { elementUpdated, expect, fixture, html } from '@open-wc/testing'
import './dialog.js'

describe('<terra-dialog>', () => {
    describe('Basic Rendering', () => {
        it('should render a component', async () => {
            const el = await fixture(html` <terra-dialog></terra-dialog> `)
            expect(el).to.exist
        })

        it('should render with base part', async () => {
            const el: any = await fixture(html` <terra-dialog></terra-dialog> `)
            const base = el.shadowRoot?.querySelector('[part~="base"]')
            expect(base).to.exist
        })
    })

    describe('Edge Cases', () => {
        it('should handle empty dialog', async () => {
            const el: any = await fixture(html` <terra-dialog></terra-dialog> `)
            await elementUpdated(el)
            expect(el).to.exist
        })
    })
})
