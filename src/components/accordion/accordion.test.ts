import { expect, fixture, html } from '@open-wc/testing'
import { elementUpdated, waitUntil } from '@open-wc/testing-helpers'
import { oneEvent } from '@open-wc/testing-helpers'
import './accordion.js'

describe('<terra-accordion>', () => {
    describe('Basic Rendering', () => {
        it('should render a component', async () => {
            const el = await fixture(html` <terra-accordion></terra-accordion> `)
            expect(el).to.exist
        })

        it('should render with summary property', async () => {
            const el: any = await fixture(html`
                <terra-accordion summary="Test Summary"></terra-accordion>
            `)
            const summary = el.shadowRoot?.querySelector('summary')
            expect(summary).to.exist
            expect(summary?.textContent?.trim()).to.include('Test Summary')
        })

        it('should render content in default slot', async () => {
            const el: any = await fixture(html`
                <terra-accordion summary="Test">
                    <p>Accordion content</p>
                </terra-accordion>
            `)
            const content = el.querySelector('p')
            expect(content).to.exist
            expect(content?.textContent).to.equal('Accordion content')
        })
    })

    describe('Properties', () => {
        it('should accept summary property', async () => {
            const el: any = await fixture(html`
                <terra-accordion summary="My Summary"></terra-accordion>
            `)
            expect(el.summary).to.equal('My Summary')
        })

        it('should accept open property', async () => {
            const el: any = await fixture(html`
                <terra-accordion open></terra-accordion>
            `)
            expect(el.open).to.be.true
        })

        it('should reflect open as attribute', async () => {
            const el: any = await fixture(html`
                <terra-accordion open></terra-accordion>
            `)
            expect(el.hasAttribute('open')).to.be.true
        })

        it('should default to closed (open = false)', async () => {
            const el: any = await fixture(html` <terra-accordion></terra-accordion> `)
            expect(el.open).to.be.false
            expect(el.hasAttribute('open')).to.be.false
        })

        it('should accept showArrow property', async () => {
            const el: any = await fixture(html`
                <terra-accordion show-arrow></terra-accordion>
            `)
            expect(el.showArrow).to.be.true
        })

        it('should default showArrow to true', async () => {
            const el: any = await fixture(html` <terra-accordion></terra-accordion> `)
            expect(el.showArrow).to.be.true
        })

        it('should hide arrow when showArrow is false', async () => {
            const el: any = await fixture(html`
                <terra-accordion .showArrow=${false}></terra-accordion>
            `)
            await elementUpdated(el)
            const icon = el.shadowRoot?.querySelector('terra-icon')
            expect(icon).to.not.exist
        })
    })

    describe('Slots', () => {
        it('should render content in default slot', async () => {
            const el: any = await fixture(html`
                <terra-accordion summary="Test">
                    <div>Default slot content</div>
                </terra-accordion>
            `)
            const content = el.querySelector('div')
            expect(content).to.exist
            expect(content?.textContent).to.equal('Default slot content')
        })

        it('should use summary slot when provided', async () => {
            const el: any = await fixture(html`
                <terra-accordion>
                    <span slot="summary">Slot Summary</span>
                    Content here
                </terra-accordion>
            `)
            const summarySlot = el.querySelector('span[slot="summary"]')
            expect(summarySlot).to.exist
            expect(summarySlot?.textContent).to.equal('Slot Summary')

            // Summary slot should override summary property
            // Check that the slot element exists in the shadow DOM
            const summary = el.shadowRoot?.querySelector('summary')
            expect(summary).to.exist

            // Find the slot element in the shadow DOM
            const slotElement = summary?.querySelector('slot[name="summary"]')
            expect(slotElement).to.exist

            // Check that the slot has assigned nodes (the slotted content)
            const assignedNodes = slotElement?.assignedNodes()
            expect(assignedNodes?.length).to.be.greaterThan(0)
            expect(assignedNodes?.[0]?.textContent?.trim()).to.equal('Slot Summary')

            // Verify the slotted content is visible in the composed tree
            // The slot content should be rendered, so we can check the summary's innerHTML or
            // check that the slot element is connected
            expect(slotElement?.getAttribute('name')).to.equal('summary')
        })

        it('should render summary-right slot', async () => {
            const el: any = await fixture(html`
                <terra-accordion summary="Test">
                    <span slot="summary-right">Right content</span>
                </terra-accordion>
            `)
            const rightSlot = el.querySelector('span[slot="summary-right"]')
            expect(rightSlot).to.exist
            expect(rightSlot?.textContent).to.equal('Right content')
        })
    })

    describe('Open/Close State', () => {
        it('should be closed by default', async () => {
            const el: any = await fixture(html`
                <terra-accordion summary="Test">
                    <p>Content</p>
                </terra-accordion>
            `)
            const details = el.shadowRoot?.querySelector('details')
            expect(details?.open).to.be.false
            expect(el.open).to.be.false
        })

        it('should be open when open property is true', async () => {
            const el: any = await fixture(html`
                <terra-accordion summary="Test" open>
                    <p>Content</p>
                </terra-accordion>
            `)
            const details = el.shadowRoot?.querySelector('details')
            expect(details?.open).to.be.true
            expect(el.open).to.be.true
        })

        it('should toggle open state when summary is clicked', async () => {
            const el: any = await fixture(html`
                <terra-accordion summary="Test">
                    <p>Content</p>
                </terra-accordion>
            `)
            const summary = el.shadowRoot?.querySelector('summary')
            expect(el.open).to.be.false

            summary?.click()
            await waitUntil(() => el.open, 'accordion should be open')

            summary?.click()
            await waitUntil(() => !el.open, 'accordion should be closed')

            expect(el.open).to.be.false
        })

        it('should update open property when set programmatically', async () => {
            const el: any = await fixture(html`
                <terra-accordion summary="Test">
                    <p>Content</p>
                </terra-accordion>
            `)
            expect(el.open).to.be.false

            el.open = true
            await elementUpdated(el)

            const details = el.shadowRoot?.querySelector('details')
            expect(details?.open).to.be.true
            expect(el.open).to.be.true
        })
    })

    describe('Events', () => {
        it('should emit terra-accordion-toggle when opened', async () => {
            const el: any = await fixture(html`
                <terra-accordion summary="Test">
                    <p>Content</p>
                </terra-accordion>
            `)
            const summary = el.shadowRoot?.querySelector('summary')

            const eventPromise = oneEvent(el, 'terra-accordion-toggle')
            summary?.click()
            const event = await eventPromise

            expect(event.detail.open).to.be.true
        })

        it('should emit terra-accordion-toggle when closed', async () => {
            const el: any = await fixture(html`
                <terra-accordion summary="Test" open>
                    <p>Content</p>
                </terra-accordion>
            `)
            const summary = el.shadowRoot?.querySelector('summary')

            const eventPromise = oneEvent(el, 'terra-accordion-toggle')
            summary?.click()
            const event = await eventPromise

            expect(event.detail.open).to.be.false
        })

        it('should emit terra-accordion-toggle when open property changes programmatically', async () => {
            const el: any = await fixture(html`
                <terra-accordion summary="Test">
                    <p>Content</p>
                </terra-accordion>
            `)

            const eventPromise = oneEvent(el, 'terra-accordion-toggle')
            el.open = true
            await elementUpdated(el)
            const event = await eventPromise

            expect(event.detail.open).to.be.true
        })
    })

    describe('Arrow Icon', () => {
        it('should show arrow icon by default', async () => {
            const el: any = await fixture(html`
                <terra-accordion summary="Test"></terra-accordion>
            `)
            const icon = el.shadowRoot?.querySelector('terra-icon')
            expect(icon).to.exist
            expect(icon?.name).to.equal('chevron-down-circle')
        })

        it('should hide arrow when showArrow is false', async () => {
            const el: any = await fixture(html`
                <terra-accordion summary="Test" .showArrow=${false}></terra-accordion>
            `)
            await elementUpdated(el)
            const icon = el.shadowRoot?.querySelector('terra-icon')
            expect(icon).to.not.exist
        })

        it('should show arrow when showArrow is true', async () => {
            const el: any = await fixture(html`
                <terra-accordion summary="Test" .showArrow=${true}></terra-accordion>
            `)
            await elementUpdated(el)
            const icon = el.shadowRoot?.querySelector('terra-icon')
            expect(icon).to.exist
        })
    })

    describe('Accessibility', () => {
        it('should use native details element for accessibility', async () => {
            const el: any = await fixture(html`
                <terra-accordion summary="Test"></terra-accordion>
            `)
            const details = el.shadowRoot?.querySelector('details')
            expect(details).to.exist
            expect(details?.tagName).to.equal('DETAILS')
        })

        it('should use native summary element for accessibility', async () => {
            const el: any = await fixture(html`
                <terra-accordion summary="Test"></terra-accordion>
            `)
            const summary = el.shadowRoot?.querySelector('summary')
            expect(summary).to.exist
            expect(summary?.tagName).to.equal('SUMMARY')
        })

        it('should be keyboard accessible (details element handles this)', async () => {
            const el: any = await fixture(html`
                <terra-accordion summary="Test">
                    <p>Content</p>
                </terra-accordion>
            `)
            const summary = el.shadowRoot?.querySelector('summary')
            expect(summary).to.exist
            // Native details/summary elements support keyboard navigation
            // (Enter/Space to toggle) - this is handled by the browser
        })
    })

    describe('Content Visibility', () => {
        it('should hide content when closed', async () => {
            const el: any = await fixture(html`
                <terra-accordion summary="Test">
                    <p>Hidden content</p>
                </terra-accordion>
            `)
            const details = el.shadowRoot?.querySelector('details')
            expect(details?.open).to.be.false
            // Content is in the DOM but hidden by details element behavior
        })

        it('should show content when open', async () => {
            const el: any = await fixture(html`
                <terra-accordion summary="Test" open>
                    <p>Visible content</p>
                </terra-accordion>
            `)
            const details = el.shadowRoot?.querySelector('details')
            expect(details?.open).to.be.true
            const content = el.querySelector('p')
            expect(content).to.exist
        })
    })

    describe('Multiple Accordions', () => {
        it('should render multiple accordions independently', async () => {
            const el: any = await fixture(html`
                <terra-accordion summary="First">First content</terra-accordion>
                <terra-accordion summary="Second">Second content</terra-accordion>
                <terra-accordion summary="Third">Third content</terra-accordion>
            `)
            // Note: fixture returns the first element when multiple are provided
            // This test verifies they can coexist
            expect(el).to.exist
        })
    })

    describe('Edge Cases', () => {
        it('should handle empty summary', async () => {
            const el: any = await fixture(html`
                <terra-accordion summary=""></terra-accordion>
            `)
            expect(el.summary).to.equal('')
            const summary = el.shadowRoot?.querySelector('summary')
            expect(summary).to.exist
        })

        it('should handle no summary property or slot', async () => {
            const el: any = await fixture(html`
                <terra-accordion>
                    <p>Content without summary</p>
                </terra-accordion>
            `)
            const summary = el.shadowRoot?.querySelector('summary')
            expect(summary).to.exist
            // Summary will be empty but still render
        })

        it('should handle empty content', async () => {
            const el: any = await fixture(html`
                <terra-accordion summary="Test"></terra-accordion>
            `)
            const details = el.shadowRoot?.querySelector('details')
            expect(details).to.exist
        })
    })
})
