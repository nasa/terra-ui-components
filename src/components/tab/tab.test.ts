import { expect, fixture, html, oneEvent } from '@open-wc/testing'
import { elementUpdated } from '@open-wc/testing-helpers'
import './tab.js'
import '../icon/icon.js'

describe('<terra-tab>', () => {
    describe('Basic Rendering', () => {
        it('should render a component', async () => {
            const el = await fixture(html`
                <terra-tab panel="general">General</terra-tab>
            `)
            expect(el).to.exist
        })

        it('should render with base part', async () => {
            const el: any = await fixture(html`
                <terra-tab panel="general">General</terra-tab>
            `)
            const base = el.shadowRoot?.querySelector('[part~="base"]')
            expect(base).to.exist
        })

        it('should render label content in the default slot', async () => {
            const el: any = await fixture(html`
                <terra-tab panel="general">General</terra-tab>
            `)
            expect(el.textContent?.trim()).to.equal('General')
        })

        it('should render an icon placed in the default slot', async () => {
            const el: any = await fixture(html`
                <terra-tab panel="home">
                    <terra-icon name="home" library="heroicons"></terra-icon>
                    Home
                </terra-tab>
            `)
            const icon = el.querySelector('terra-icon')
            expect(icon).to.exist
        })
    })

    describe('Properties', () => {
        it('should accept a panel property', async () => {
            const el: any = await fixture(html`
                <terra-tab panel="general">General</terra-tab>
            `)
            expect(el.panel).to.equal('general')
        })

        it('should reflect panel as an attribute', async () => {
            const el: any = await fixture(html`
                <terra-tab panel="general">General</terra-tab>
            `)
            expect(el.getAttribute('panel')).to.equal('general')
        })

        it('should default active to false', async () => {
            const el: any = await fixture(html`
                <terra-tab panel="general"></terra-tab>
            `)
            expect(el.active).to.be.false
        })

        it('should default closable to false', async () => {
            const el: any = await fixture(html`
                <terra-tab panel="general"></terra-tab>
            `)
            expect(el.closable).to.be.false
        })

        it('should default disabled to false', async () => {
            const el: any = await fixture(html`
                <terra-tab panel="general"></terra-tab>
            `)
            expect(el.disabled).to.be.false
        })

        it('should default size to large', async () => {
            const el: any = await fixture(html`
                <terra-tab panel="general"></terra-tab>
            `)
            expect(el.size).to.equal('large')
        })

        it('should reflect active, closable, disabled, and size as attributes', async () => {
            const el: any = await fixture(html`
                <terra-tab
                    panel="general"
                    active
                    closable
                    disabled
                    size="small"
                ></terra-tab>
            `)
            expect(el.hasAttribute('active')).to.be.true
            expect(el.hasAttribute('closable')).to.be.true
            expect(el.hasAttribute('disabled')).to.be.true
            expect(el.getAttribute('size')).to.equal('small')
        })

        it('should apply the size class', async () => {
            const el: any = await fixture(html`
                <terra-tab panel="general" size="small">General</terra-tab>
            `)
            const base = el.shadowRoot?.querySelector('[part~="base"]')
            expect(base?.classList.contains('tab--small')).to.be.true
        })
    })

    describe('Closable', () => {
        it('should not render a close button by default', async () => {
            const el: any = await fixture(html`
                <terra-tab panel="general">General</terra-tab>
            `)
            const closeButton = el.shadowRoot?.querySelector('[part~="close-button"]')
            expect(closeButton).to.not.exist
        })

        it('should render a close button when closable', async () => {
            const el: any = await fixture(html`
                <terra-tab panel="general" closable>General</terra-tab>
            `)
            const closeButton = el.shadowRoot?.querySelector('[part~="close-button"]')
            expect(closeButton).to.exist
        })

        it('should emit terra-close when the close button is clicked', async () => {
            const el: any = await fixture(html`
                <terra-tab panel="general" closable>General</terra-tab>
            `)
            const closeButton = el.shadowRoot?.querySelector(
                '[part~="close-button"]'
            ) as HTMLElement

            const eventPromise = oneEvent(el, 'terra-close')
            closeButton.click()
            const event = await eventPromise

            expect(event).to.exist
        })
    })

    describe('Accessibility', () => {
        it('should have role="tab"', async () => {
            const el: any = await fixture(html`
                <terra-tab panel="general">General</terra-tab>
            `)
            expect(el.getAttribute('role')).to.equal('tab')
        })

        it('should set aria-selected to true when active', async () => {
            const el: any = await fixture(html`
                <terra-tab panel="general" active>General</terra-tab>
            `)
            expect(el.getAttribute('aria-selected')).to.equal('true')
        })

        it('should set aria-selected to false when not active', async () => {
            const el: any = await fixture(html`
                <terra-tab panel="general">General</terra-tab>
            `)
            expect(el.getAttribute('aria-selected')).to.equal('false')
        })

        it('should set aria-disabled based on the disabled property', async () => {
            const el: any = await fixture(html`
                <terra-tab panel="general" disabled>General</terra-tab>
            `)
            expect(el.getAttribute('aria-disabled')).to.equal('true')
        })

        it('should not be focusable when disabled and inactive', async () => {
            const el: any = await fixture(html`
                <terra-tab panel="general" disabled>General</terra-tab>
            `)
            expect(el.tabIndex).to.equal(-1)
        })

        it('should be focusable when active, even if disabled', async () => {
            const el: any = await fixture(html`
                <terra-tab panel="general" disabled active>General</terra-tab>
            `)
            expect(el.tabIndex).to.equal(0)
        })

        it('should restore focusability when disabled is removed', async () => {
            const el: any = await fixture(html`
                <terra-tab panel="general" disabled>General</terra-tab>
            `)
            expect(el.tabIndex).to.equal(-1)

            el.disabled = false
            await elementUpdated(el)
            expect(el.tabIndex).to.equal(0)
        })

        it('should auto-generate an id when none is provided', async () => {
            const el: any = await fixture(html`
                <terra-tab panel="general">General</terra-tab>
            `)
            expect(el.id).to.match(/^terra-tab-\d+$/)
        })

        it('should preserve a user-provided id', async () => {
            const el: any = await fixture(html`
                <terra-tab panel="general" id="my-tab">General</terra-tab>
            `)
            expect(el.id).to.equal('my-tab')
        })
    })
})
