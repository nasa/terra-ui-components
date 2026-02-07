import { expect, fixture, html } from '@open-wc/testing'
import { elementUpdated, waitUntil } from '@open-wc/testing-helpers'
import { oneEvent } from '@open-wc/testing-helpers'
import './alert.js'

describe('<terra-alert>', () => {
    describe('Basic Rendering', () => {
        it('should render a component', async () => {
            const el = await fixture(html` <terra-alert></terra-alert> `)
            expect(el).to.exist
        })

        it('should render content in default slot', async () => {
            const el: any = await fixture(html`
                <terra-alert open>
                    <p>Alert content</p>
                </terra-alert>
            `)
            const content = el.querySelector('p')
            expect(content).to.exist
            expect(content?.textContent).to.equal('Alert content')
        })

        it('should be hidden by default', async () => {
            const el: any = await fixture(html` <terra-alert>Content</terra-alert> `)
            const base = el.shadowRoot?.querySelector('[part~="base"]')
            expect(base?.hidden).to.be.true
        })

        it('should be visible when open attribute is set', async () => {
            const el: any = await fixture(html`
                <terra-alert open>Content</terra-alert>
            `)
            const base = el.shadowRoot?.querySelector('[part~="base"]')
            expect(base?.hidden).to.be.false
        })
    })

    describe('Properties', () => {
        it('should accept open property', async () => {
            const el: any = await fixture(html` <terra-alert open></terra-alert> `)
            expect(el.open).to.be.true
        })

        it('should reflect open as attribute', async () => {
            const el: any = await fixture(html` <terra-alert open></terra-alert> `)
            expect(el.hasAttribute('open')).to.be.true
        })

        it('should default to closed (open = false)', async () => {
            const el: any = await fixture(html` <terra-alert></terra-alert> `)
            expect(el.open).to.be.false
            expect(el.hasAttribute('open')).to.be.false
        })

        it('should accept closable property', async () => {
            const el: any = await fixture(html`
                <terra-alert closable></terra-alert>
            `)
            expect(el.closable).to.be.true
        })

        it('should reflect closable as attribute', async () => {
            const el: any = await fixture(html`
                <terra-alert closable></terra-alert>
            `)
            expect(el.hasAttribute('closable')).to.be.true
        })

        it('should default closable to false', async () => {
            const el: any = await fixture(html` <terra-alert></terra-alert> `)
            expect(el.closable).to.be.false
        })

        it('should accept variant property', async () => {
            const el: any = await fixture(html`
                <terra-alert variant="success"></terra-alert>
            `)
            expect(el.variant).to.equal('success')
        })

        it('should default variant to primary', async () => {
            const el: any = await fixture(html` <terra-alert></terra-alert> `)
            expect(el.variant).to.equal('primary')
        })

        it('should accept all variant values', async () => {
            const variants = ['primary', 'success', 'neutral', 'warning', 'danger']
            for (const variant of variants) {
                const el: any = await fixture(html`
                    <terra-alert variant=${variant}></terra-alert>
                `)
                expect(el.variant).to.equal(variant)
            }
        })

        it('should accept appearance property', async () => {
            const el: any = await fixture(html`
                <terra-alert appearance="white"></terra-alert>
            `)
            expect(el.appearance).to.equal('white')
        })

        it('should default appearance to filled', async () => {
            const el: any = await fixture(html` <terra-alert></terra-alert> `)
            expect(el.appearance).to.equal('filled')
        })

        it('should accept duration property', async () => {
            const el: any = await fixture(html`
                <terra-alert duration="5000"></terra-alert>
            `)
            expect(el.duration).to.equal(5000)
        })

        it('should default duration to Infinity', async () => {
            const el: any = await fixture(html` <terra-alert></terra-alert> `)
            expect(el.duration).to.equal(Infinity)
        })

        it('should accept countdown property', async () => {
            const el: any = await fixture(html`
                <terra-alert countdown="rtl"></terra-alert>
            `)
            expect(el.countdown).to.equal('rtl')
        })
    })

    describe('Slots', () => {
        it('should render content in default slot', async () => {
            const el: any = await fixture(html`
                <terra-alert open>
                    <div>Default slot content</div>
                </terra-alert>
            `)
            const content = el.querySelector('div')
            expect(content).to.exist
            expect(content?.textContent).to.equal('Default slot content')
        })

        it('should render icon slot', async () => {
            const el: any = await fixture(html`
                <terra-alert open>
                    <span slot="icon">Icon</span>
                    Content
                </terra-alert>
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
                <terra-alert open>Content</terra-alert>
            `)
            const base = el.shadowRoot?.querySelector('[part~="base"]')
            expect(base?.classList.contains('alert--has-icon')).to.be.false
        })
    })

    describe('Open/Close State', () => {
        it('should be closed by default', async () => {
            const el: any = await fixture(html` <terra-alert>Content</terra-alert> `)
            expect(el.open).to.be.false
            const base = el.shadowRoot?.querySelector('[part~="base"]')
            expect(base?.hidden).to.be.true
        })

        it('should be open when open property is true', async () => {
            const el: any = await fixture(html`
                <terra-alert open>Content</terra-alert>
            `)
            expect(el.open).to.be.true
            const base = el.shadowRoot?.querySelector('[part~="base"]')
            expect(base?.hidden).to.be.false
        })

        it('should update visibility when open property changes', async () => {
            const el: any = await fixture(html` <terra-alert>Content</terra-alert> `)
            expect(el.open).to.be.false

            el.open = true
            await elementUpdated(el)

            const base = el.shadowRoot?.querySelector('[part~="base"]')
            expect(base?.hidden).to.be.false
        })
    })

    describe('Methods', () => {
        it('should show alert when show() is called', async () => {
            const el: any = await fixture(html` <terra-alert>Content</terra-alert> `)
            expect(el.open).to.be.false

            const showPromise = el.show()
            await elementUpdated(el)

            expect(el.open).to.be.true
            await showPromise // Wait for after-show event
        })

        it('should hide alert when hide() is called', async () => {
            const el: any = await fixture(html`
                <terra-alert open>Content</terra-alert>
            `)
            expect(el.open).to.be.true

            const hidePromise = el.hide()
            await elementUpdated(el)

            expect(el.open).to.be.false
            await hidePromise // Wait for after-hide event
        })

        it('should return undefined if show() is called when already open', async () => {
            const el: any = await fixture(html`
                <terra-alert open>Content</terra-alert>
            `)
            const result = await el.show()
            expect(result).to.be.undefined
        })

        it('should return undefined if hide() is called when already closed', async () => {
            const el: any = await fixture(html` <terra-alert>Content</terra-alert> `)
            const result = await el.hide()
            expect(result).to.be.undefined
        })
    })

    describe('Events', () => {
        it('should emit terra-show when opened', async () => {
            const el: any = await fixture(html` <terra-alert>Content</terra-alert> `)
            const eventPromise = oneEvent(el, 'terra-show')
            el.open = true
            await elementUpdated(el)
            const event = await eventPromise
            expect(event).to.exist
        })

        it('should emit terra-after-show after opening', async () => {
            const el: any = await fixture(html` <terra-alert>Content</terra-alert> `)
            const eventPromise = oneEvent(el, 'terra-after-show')
            el.open = true
            await elementUpdated(el)
            const event = await eventPromise
            expect(event).to.exist
        })

        it('should emit terra-hide when closed', async () => {
            const el: any = await fixture(html`
                <terra-alert open>Content</terra-alert>
            `)
            const eventPromise = oneEvent(el, 'terra-hide')
            el.open = false
            await elementUpdated(el)
            const event = await eventPromise
            expect(event).to.exist
        })

        it('should emit terra-after-hide after closing', async () => {
            const el: any = await fixture(html`
                <terra-alert open>Content</terra-alert>
            `)
            const eventPromise = oneEvent(el, 'terra-after-hide')
            el.open = false
            await elementUpdated(el)
            const event = await eventPromise
            expect(event).to.exist
        })

        it('should emit events when show() is called', async () => {
            const el: any = await fixture(html` <terra-alert>Content</terra-alert> `)
            const showPromise = oneEvent(el, 'terra-show')
            const afterShowPromise = oneEvent(el, 'terra-after-show')

            el.show()
            await showPromise
            await afterShowPromise

            expect(el.open).to.be.true
        })

        it('should emit events when hide() is called', async () => {
            const el: any = await fixture(html`
                <terra-alert open>Content</terra-alert>
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
                <terra-alert open closable>Content</terra-alert>
            `)
            const closeButton = el.shadowRoot?.querySelector('.alert__close-button')
            expect(closeButton).to.exist
        })

        it('should hide close button when closable is false', async () => {
            const el: any = await fixture(html`
                <terra-alert open>Content</terra-alert>
            `)
            const closeButton = el.shadowRoot?.querySelector('.alert__close-button')
            expect(closeButton).to.not.exist
        })

        it('should close alert when close button is clicked', async () => {
            const el: any = await fixture(html`
                <terra-alert open closable>Content</terra-alert>
            `)
            const closeButton = el.shadowRoot?.querySelector('.alert__close-button')
            expect(el.open).to.be.true

            closeButton?.click()
            await elementUpdated(el)

            expect(el.open).to.be.false
        })
    })

    describe('Variants', () => {
        it('should apply primary variant class', async () => {
            const el: any = await fixture(html`
                <terra-alert variant="primary" open></terra-alert>
            `)
            const base = el.shadowRoot?.querySelector('[part~="base"]')
            expect(base?.classList.contains('alert--primary')).to.be.true
        })

        it('should apply success variant class', async () => {
            const el: any = await fixture(html`
                <terra-alert variant="success" open></terra-alert>
            `)
            const base = el.shadowRoot?.querySelector('[part~="base"]')
            expect(base?.classList.contains('alert--success')).to.be.true
        })

        it('should apply neutral variant class', async () => {
            const el: any = await fixture(html`
                <terra-alert variant="neutral" open></terra-alert>
            `)
            const base = el.shadowRoot?.querySelector('[part~="base"]')
            expect(base?.classList.contains('alert--neutral')).to.be.true
        })

        it('should apply warning variant class', async () => {
            const el: any = await fixture(html`
                <terra-alert variant="warning" open></terra-alert>
            `)
            const base = el.shadowRoot?.querySelector('[part~="base"]')
            expect(base?.classList.contains('alert--warning')).to.be.true
        })

        it('should apply danger variant class', async () => {
            const el: any = await fixture(html`
                <terra-alert variant="danger" open></terra-alert>
            `)
            const base = el.shadowRoot?.querySelector('[part~="base"]')
            expect(base?.classList.contains('alert--danger')).to.be.true
        })
    })

    describe('Appearance', () => {
        it('should apply filled appearance class by default', async () => {
            const el: any = await fixture(html` <terra-alert open></terra-alert> `)
            const base = el.shadowRoot?.querySelector('[part~="base"]')
            expect(base?.classList.contains('alert--filled')).to.be.true
        })

        it('should apply white appearance class', async () => {
            const el: any = await fixture(html`
                <terra-alert appearance="white" open></terra-alert>
            `)
            const base = el.shadowRoot?.querySelector('[part~="base"]')
            expect(base?.classList.contains('alert--white')).to.be.true
        })
    })

    describe('Duration and Auto-Hide', () => {
        it('should not auto-hide when duration is Infinity', async () => {
            const el: any = await fixture(html`
                <terra-alert open duration=${Infinity}>Content</terra-alert>
            `)
            expect(el.duration).to.equal(Infinity)

            // Wait a bit to ensure it doesn't close
            await new Promise(resolve => setTimeout(resolve, 100))
            expect(el.open).to.be.true
        })

        it('should auto-hide after duration expires', async () => {
            const el: any = await fixture(html`
                <terra-alert open duration="100">Content</terra-alert>
            `)
            expect(el.open).to.be.true

            // Wait for duration to expire
            await waitUntil(() => !el.open, 'alert should close after duration', {
                timeout: 200,
            })
        })

        it('should restart timer on mouse enter/leave', async () => {
            const el: any = await fixture(html`
                <terra-alert open duration="300">Content</terra-alert>
            `)
            await elementUpdated(el)
            const base = el.shadowRoot?.querySelector('[part~="base"]')

            // Wait a bit to let timer start
            await new Promise(resolve => setTimeout(resolve, 50))

            // Mouse enter should pause
            base?.dispatchEvent(new MouseEvent('mouseenter'))
            await elementUpdated(el)

            // Wait longer than the original duration - should still be open because paused
            await new Promise(resolve => setTimeout(resolve, 200))
            expect(el.open).to.be.true

            // Mouse leave should resume with remaining time
            base?.dispatchEvent(new MouseEvent('mouseleave'))
            await elementUpdated(el)

            // Should close after remaining duration (should be less than original 300ms)
            await waitUntil(() => !el.open, 'alert should close after mouse leave', {
                timeout: 400,
            })
        })
    })

    describe('Countdown', () => {
        it('should show countdown when countdown property is set', async () => {
            // Set countdown and duration after component is created to avoid timing issues
            const el: any = await fixture(html`
                <terra-alert open countdown="rtl">Content</terra-alert>
            `)
            await elementUpdated(el)
            // Wait for countdown element to be rendered
            await waitUntil(
                () => el.shadowRoot?.querySelector('.alert__countdown') !== null,
                'countdown should be rendered',
                { timeout: 100 }
            )
            // Now set duration which will trigger the animation
            el.duration = 1000
            await elementUpdated(el)
            const countdown = el.shadowRoot?.querySelector('.alert__countdown')
            expect(countdown).to.exist
        })

        it('should hide countdown when countdown property is not set', async () => {
            const el: any = await fixture(html`
                <terra-alert open>Content</terra-alert>
            `)
            await elementUpdated(el)
            const countdown = el.shadowRoot?.querySelector('.alert__countdown')
            expect(countdown).to.not.exist
        })

        it('should apply rtl countdown class', async () => {
            // Set countdown first, then duration to avoid timing issues
            const el: any = await fixture(html`
                <terra-alert open countdown="rtl">Content</terra-alert>
            `)
            await elementUpdated(el)
            // Wait for countdown element to be rendered
            await waitUntil(
                () => el.shadowRoot?.querySelector('.alert__countdown') !== null,
                'countdown should be rendered',
                { timeout: 100 }
            )
            // Now set duration
            el.duration = 1000
            await elementUpdated(el)
            const countdown = el.shadowRoot?.querySelector('.alert__countdown')
            expect(countdown?.classList.contains('alert__countdown--ltr')).to.be.false
        })

        it('should apply ltr countdown class', async () => {
            // Set countdown first, then duration to avoid timing issues
            const el: any = await fixture(html`
                <terra-alert open countdown="ltr">Content</terra-alert>
            `)
            await elementUpdated(el)
            // Wait for countdown element to be rendered
            await waitUntil(
                () => el.shadowRoot?.querySelector('.alert__countdown') !== null,
                'countdown should be rendered',
                { timeout: 100 }
            )
            // Now set duration
            el.duration = 1000
            await elementUpdated(el)
            const countdown = el.shadowRoot?.querySelector('.alert__countdown')
            expect(countdown?.classList.contains('alert__countdown--ltr')).to.be.true
        })
    })

    describe('Accessibility', () => {
        it('should have role="alert"', async () => {
            const el: any = await fixture(html`
                <terra-alert open>Content</terra-alert>
            `)
            const base = el.shadowRoot?.querySelector('[part~="base"]')
            expect(base?.getAttribute('role')).to.equal('alert')
        })

        it('should have aria-hidden="false" when open', async () => {
            const el: any = await fixture(html`
                <terra-alert open>Content</terra-alert>
            `)
            const base = el.shadowRoot?.querySelector('[part~="base"]')
            expect(base?.getAttribute('aria-hidden')).to.equal('false')
        })

        it('should have aria-hidden="true" when closed', async () => {
            const el: any = await fixture(html` <terra-alert>Content</terra-alert> `)
            const base = el.shadowRoot?.querySelector('[part~="base"]')
            expect(base?.getAttribute('aria-hidden')).to.equal('true')
        })

        it('should have aria-live="polite" on message', async () => {
            const el: any = await fixture(html`
                <terra-alert open>Content</terra-alert>
            `)
            const message = el.shadowRoot?.querySelector('[part~="message"]')
            expect(message?.getAttribute('aria-live')).to.equal('polite')
        })
    })

    describe('Edge Cases', () => {
        it('should handle empty content', async () => {
            const el: any = await fixture(html` <terra-alert open></terra-alert> `)
            expect(el).to.exist
            const base = el.shadowRoot?.querySelector('[part~="base"]')
            expect(base).to.exist
        })

        it('should handle rapid open/close toggling', async () => {
            const el: any = await fixture(html` <terra-alert>Content</terra-alert> `)

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

        it('should handle duration change while open', async () => {
            const el: any = await fixture(html`
                <terra-alert open duration="1000">Content</terra-alert>
            `)

            el.duration = 2000
            await elementUpdated(el)

            expect(el.duration).to.equal(2000)
            // Should still be open
            expect(el.open).to.be.true
        })
    })
})
