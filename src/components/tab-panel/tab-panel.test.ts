import { expect, fixture, html } from '@open-wc/testing'
import { elementUpdated } from '@open-wc/testing-helpers'
import './tab-panel.js'

describe('<terra-tab-panel>', () => {
    describe('Basic Rendering', () => {
        it('should render a component', async () => {
            const el = await fixture(html` <terra-tab-panel></terra-tab-panel> `)
            expect(el).to.exist
        })

        it('should render with base part', async () => {
            const el: any = await fixture(html` <terra-tab-panel></terra-tab-panel> `)
            const base = el.shadowRoot?.querySelector('[part~="base"]')
            expect(base).to.exist
        })

        it('should render content in the default slot', async () => {
            const el: any = await fixture(html`
                <terra-tab-panel>Panel content</terra-tab-panel>
            `)
            expect(el.textContent?.trim()).to.equal('Panel content')
        })
    })

    describe('Properties', () => {
        it('should accept a name property', async () => {
            const el: any = await fixture(html`
                <terra-tab-panel name="general"></terra-tab-panel>
            `)
            expect(el.name).to.equal('general')
        })

        it('should reflect name as an attribute', async () => {
            const el: any = await fixture(html`
                <terra-tab-panel name="general"></terra-tab-panel>
            `)
            expect(el.getAttribute('name')).to.equal('general')
        })

        it('should default name to an empty string', async () => {
            const el: any = await fixture(html` <terra-tab-panel></terra-tab-panel> `)
            expect(el.name).to.equal('')
        })

        it('should default active to false', async () => {
            const el: any = await fixture(html` <terra-tab-panel></terra-tab-panel> `)
            expect(el.active).to.be.false
            expect(el.hasAttribute('active')).to.be.false
        })

        it('should accept active property', async () => {
            const el: any = await fixture(html`
                <terra-tab-panel active></terra-tab-panel>
            `)
            expect(el.active).to.be.true
        })

        it('should reflect active as an attribute', async () => {
            const el: any = await fixture(html`
                <terra-tab-panel active></terra-tab-panel>
            `)
            expect(el.hasAttribute('active')).to.be.true
        })
    })

    describe('Accessibility', () => {
        it('should have role="tabpanel"', async () => {
            const el: any = await fixture(html` <terra-tab-panel></terra-tab-panel> `)
            expect(el.getAttribute('role')).to.equal('tabpanel')
        })

        it('should set aria-hidden to false when active', async () => {
            const el: any = await fixture(html`
                <terra-tab-panel active></terra-tab-panel>
            `)
            expect(el.getAttribute('aria-hidden')).to.equal('false')
        })

        it('should set aria-hidden to true when not active', async () => {
            const el: any = await fixture(html` <terra-tab-panel></terra-tab-panel> `)
            expect(el.getAttribute('aria-hidden')).to.equal('true')
        })

        it('should update aria-hidden when active changes programmatically', async () => {
            const el: any = await fixture(html` <terra-tab-panel></terra-tab-panel> `)
            expect(el.getAttribute('aria-hidden')).to.equal('true')

            el.active = true
            await elementUpdated(el)
            expect(el.getAttribute('aria-hidden')).to.equal('false')

            el.active = false
            await elementUpdated(el)
            expect(el.getAttribute('aria-hidden')).to.equal('true')
        })

        it('should auto-generate an id when none is provided', async () => {
            const el: any = await fixture(html` <terra-tab-panel></terra-tab-panel> `)
            expect(el.id).to.match(/^terra-tab-panel-\d+$/)
        })

        it('should preserve a user-provided id', async () => {
            const el: any = await fixture(html`
                <terra-tab-panel id="my-panel"></terra-tab-panel>
            `)
            expect(el.id).to.equal('my-panel')
        })
    })

    describe('Edge Cases', () => {
        it('should handle empty content', async () => {
            const el: any = await fixture(html` <terra-tab-panel></terra-tab-panel> `)
            expect(el).to.exist
            expect(el.textContent?.trim()).to.equal('')
        })

        it('should handle multiple panels independently', async () => {
            const container = await fixture(html`
                <div>
                    <terra-tab-panel name="one" active></terra-tab-panel>
                    <terra-tab-panel name="two"></terra-tab-panel>
                </div>
            `)
            const panels = container.querySelectorAll('terra-tab-panel')
            expect(panels[0].getAttribute('aria-hidden')).to.equal('false')
            expect(panels[1].getAttribute('aria-hidden')).to.equal('true')
        })
    })
})
