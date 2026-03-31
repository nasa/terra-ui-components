import { expect, fixture, html } from '@open-wc/testing'
import { elementUpdated } from '@open-wc/testing-helpers'
import { oneEvent } from '@open-wc/testing-helpers'
import './banner.js'

describe('<terra-banner>', () => {
    describe('Basic Rendering', () => {
        it('should render a component', async () => {
            const el = await fixture(html` <terra-banner></terra-banner> `)
            expect(el).to.exist
        })

        it('should render content in default slot', async () => {
            const el: any = await fixture(html`
                <terra-banner open>
                    <p>Banner alert content</p>
                </terra-banner>
            `)
            const content = el.querySelector('p')
            expect(content).to.exist
            expect(content?.textContent).to.equal('Banner Alert content')
        })

        it('should be hidden by default', async () => {
            const el: any = await fixture(html` <terra-banner>Content</terra-banner> `)
            const base = el.shadowRoot?.querySelector('[part~="base"]')
            expect(base?.hidden).to.be.true
        })

        it('should be visible when open attribute is set', async () => {
            const el: any = await fixture(html`
                <terra-banner open>Content</terra-banner>
            `)
            const base = el.shadowRoot?.querySelector('[part~="base"]')
            expect(base?.hidden).to.be.false
        })
    })

    describe('Properties', () => {
        it('should accept open property', async () => {
            const el: any = await fixture(html` <terra-banner open></terra-banner> `)
            expect(el.open).to.be.true
        })

        it('should reflect open as attribute', async () => {
            const el: any = await fixture(html` <terra-banner open></terra-banner> `)
            expect(el.hasAttribute('open')).to.be.true
        })

        it('should default to closed (open = false)', async () => {
            const el: any = await fixture(html` <terra-banner></terra-banner> `)
            expect(el.open).to.be.false
            expect(el.hasAttribute('open')).to.be.false
        })

        it('should accept closable property', async () => {
            const el: any = await fixture(html`
                <terra-banner closable></terra-banner>
            `)
            expect(el.closable).to.be.true
        })

        it('should reflect closable as attribute', async () => {
            const el: any = await fixture(html`
                <terra-banner closable></terra-banner>
            `)
            expect(el.hasAttribute('closable')).to.be.true
        })

        it('should default closable to false', async () => {
            const el: any = await fixture(html` <terra-banner></terra-banner> `)
            expect(el.closable).to.be.false
        })

        it('should accept variant property', async () => {
            const el: any = await fixture(html`
                <terra-banner variant="primary"></terra-banner>
            `)
            expect(el.variant).to.equal('primary')
        })

        it('should default variant to primary', async () => {
            const el: any = await fixture(html` <terra-banner></terra-banner> `)
            expect(el.variant).to.equal('primary')
        })

        it('should accept all variant values', async () => {
            const variants = ['primary', 'danger']
            for (const variant of variants) {
                const el: any = await fixture(html`
                    <terra-banner variant=${variant}></terra-banner>
                `)
                expect(el.variant).to.equal(variant)
            }
        })
    })

    describe('Slots', () => {
        it('should render content in default slot', async () => {
            const el: any = await fixture(html`
                <terra-banner open>
                    <div>Default slot content</div>
                </terra-banner>
            `)
            const content = el.querySelector('div')
            expect(content).to.exist
            expect(content?.textContent).to.equal('Default slot content')
        })

        it('should render icon slot', async () => {
            const el: any = await fixture(html`
                <terra-banner open>
                    <span slot="icon">Icon</span>
                    Content
                </terra-banner>
            `)
            const iconSlot = el.querySelector('span[slot="icon"]')
            expect(iconSlot).to.exist
            expect(iconSlot?.textContent).to.equal('Icon')

            // Check that the slot element exists in shadow DOM
            const iconContainer = el.shadowRoot?.querySelector('[part~="icon"]')
            expect(iconContainer).to.exist
            const slotElement = iconContainer?.querySelector('slot[name="icon"]')
            expect(slotElement).to.exist
        })

        it('should hide icon container when no icon slot is provided', async () => {
            const el: any = await fixture(html`
                <terra-banner open>Content</terra-banner>
            `)
            const base = el.shadowRoot?.querySelector('[part~="base"]')
            expect(base?.classList.contains('banner--has-icon')).to.be.false
        })
    })

    describe('Open/Close State', () => {
        it('should be closed by default', async () => {
            const el: any = await fixture(html` <terra-banner>Content</terra-banner> `)
            expect(el.open).to.be.false
            const base = el.shadowRoot?.querySelector('[part~="base"]')
            expect(base?.hidden).to.be.true
        })

        it('should be open when open property is true', async () => {
            const el: any = await fixture(html`
                <terra-banner open>Content</terra-banner>
            `)
            expect(el.open).to.be.true
            const base = el.shadowRoot?.querySelector('[part~="base"]')
            expect(base?.hidden).to.be.false
        })

        it('should update visibility when open property changes', async () => {
            const el: any = await fixture(html` <terra-banner>Content</terra-banner> `)
            expect(el.open).to.be.false

            el.open = true
            await elementUpdated(el)

            const base = el.shadowRoot?.querySelector('[part~="base"]')
            expect(base?.hidden).to.be.false
        })
    })

    describe('Methods', () => {
        it('should show alert when show() is called', async () => {
            const el: any = await fixture(html` <terra-banner>Content</terra-banner> `)
            expect(el.open).to.be.false

            const showPromise = el.show()
            await elementUpdated(el)

            expect(el.open).to.be.true
            await showPromise // Wait for after-show event
        })

        it('should hide alert when hide() is called', async () => {
            const el: any = await fixture(html`
                <terra-banner open>Content</terra-banner>
            `)
            expect(el.open).to.be.true

            const hidePromise = el.hide()
            await elementUpdated(el)

            expect(el.open).to.be.false
            await hidePromise // Wait for after-hide event
        })

        it('should return undefined if show() is called when already open', async () => {
            const el: any = await fixture(html`
                <terra-banner open>Content</terra-banner>
            `)
            const result = await el.show()
            expect(result).to.be.undefined
        })

        it('should return undefined if hide() is called when already closed', async () => {
            const el: any = await fixture(html` <terra-banner>Content</terra-banner> `)
            const result = await el.hide()
            expect(result).to.be.undefined
        })
    })

    describe('Events', () => {
        it('should emit terra-show when opened', async () => {
            const el: any = await fixture(html` <terra-banner>Content</terra-banner> `)
            const eventPromise = oneEvent(el, 'terra-show')
            el.open = true
            await elementUpdated(el)
            const event = await eventPromise
            expect(event).to.exist
        })

        it('should emit terra-after-show after opening', async () => {
            const el: any = await fixture(html` <terra-banner>Content</terra-banner> `)
            const eventPromise = oneEvent(el, 'terra-after-show')
            el.open = true
            await elementUpdated(el)
            const event = await eventPromise
            expect(event).to.exist
        })

        it('should emit terra-hide when closed', async () => {
            const el: any = await fixture(html`
                <terra-banner open>Content</terra-banner>
            `)
            const eventPromise = oneEvent(el, 'terra-hide')
            el.open = false
            await elementUpdated(el)
            const event = await eventPromise
            expect(event).to.exist
        })

        it('should emit terra-after-hide after closing', async () => {
            const el: any = await fixture(html`
                <terra-banner open>Content</terra-banner>
            `)
            const eventPromise = oneEvent(el, 'terra-after-hide')
            el.open = false
            await elementUpdated(el)
            const event = await eventPromise
            expect(event).to.exist
        })

        it('should emit events when show() is called', async () => {
            const el: any = await fixture(html` <terra-banner>Content</terra-banner> `)
            const showPromise = oneEvent(el, 'terra-show')
            const afterShowPromise = oneEvent(el, 'terra-after-show')

            el.show()
            await showPromise
            await afterShowPromise

            expect(el.open).to.be.true
        })

        it('should emit events when hide() is called', async () => {
            const el: any = await fixture(html`
                <terra-banner open>Content</terra-banner>
            `)
            const hidePromise = oneEvent(el, 'terra-hide')
            const afterHidePromise = oneEvent(el, 'terra-after-hide')

            el.hide()
            await hidePromise
            await afterHidePromise

            expect(el.open).to.be.false
        })
    })

    describe('Closable', () => {
        it('should show close button when closable is true', async () => {
            const el: any = await fixture(html`
                <terra-banner open closable>Content</terra-banner>
            `)
            const closeButton = el.shadowRoot?.querySelector('.banner__close')
            expect(closeButton).to.exist
        })

        it('should hide close button when closable is false', async () => {
            const el: any = await fixture(html`
                <terra-banner open>Content</terra-banner>
            `)
            const closeButton = el.shadowRoot?.querySelector('.banner__close')
            expect(closeButton).to.not.exist
        })

        it('should close banner when close button is clicked', async () => {
            const el: any = await fixture(html`
                <terra-banner open closable>Content</terra-banner>
            `)
            const closeButton = el.shadowRoot?.querySelector('.banner__close')
            expect(el.open).to.be.true

            closeButton?.click()
            await elementUpdated(el)

            expect(el.open).to.be.false
        })
    })

    describe('Variants', () => {
        it('should apply primary variant class', async () => {
            const el: any = await fixture(html`
                <terra-banner variant="primary" open></terra-banner>
            `)
            const base = el.shadowRoot?.querySelector('[part~="base"]')
            expect(base?.classList.contains('banner--primary')).to.be.true
        })

        it('should apply danger variant class', async () => {
            const el: any = await fixture(html`
                <terra-banner variant="danger" open></terra-banner>
            `)
            const base = el.shadowRoot?.querySelector('[part~="base"]')
            expect(base?.classList.contains('banner--danger')).to.be.true
        })
    })

    describe('Edge Cases', () => {
        it('should handle empty content', async () => {
            const el: any = await fixture(html` <terra-banner open></terra-banner> `)
            expect(el).to.exist
            const base = el.shadowRoot?.querySelector('[part~="base"]')
            expect(base).to.exist
        })

        it('should handle rapid open/close toggling', async () => {
            const el: any = await fixture(html` <terra-banner>Content</terra-banner> `)

            el.open = true
            await elementUpdated(el)
            expect(el.open).to.be.true

            el.open = false
            await elementUpdated(el)
            expect(el.open).to.be.false

            el.open = true
            await elementUpdated(el)
            expect(el.open).to.be.true
        })
    })
})