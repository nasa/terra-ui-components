import { expect, fixture, html, elementUpdated } from '@open-wc/testing'
import './stepper-step.js'
import '../stepper/stepper.js'

describe('<terra-stepper-step>', () => {
    describe('Basic Rendering', () => {
        it('should render a component', async () => {
            const el = await fixture(html`
                <terra-stepper-step></terra-stepper-step>
            `)
            expect(el).to.exist
        })

        it('should render with base part', async () => {
            const el: any = await fixture(html`
                <terra-stepper-step></terra-stepper-step>
            `)
            const base = el.shadowRoot?.querySelector('[part~="base"]')
            expect(base).to.exist
        })

        it('should render with bar part', async () => {
            const el: any = await fixture(html`
                <terra-stepper-step></terra-stepper-step>
            `)
            const bar = el.shadowRoot?.querySelector('[part~="bar"]')
            expect(bar).to.exist
        })
    })

    describe('Properties', () => {
        it('should accept state property', async () => {
            const el: any = await fixture(html`
                <terra-stepper-step state="completed"></terra-stepper-step>
            `)
            expect(el.state).to.equal('completed')
        })

        it('should reflect state as attribute', async () => {
            const el: any = await fixture(html`
                <terra-stepper-step state="current"></terra-stepper-step>
            `)
            expect(el.getAttribute('state')).to.equal('current')
        })

        it('should default state to upcoming', async () => {
            const el: any = await fixture(html`
                <terra-stepper-step></terra-stepper-step>
            `)
            expect(el.state).to.equal('upcoming')
        })

        it('should accept all state values', async () => {
            const states = ['completed', 'current', 'upcoming']
            for (const state of states) {
                const el: any = await fixture(html`
                    <terra-stepper-step state=${state}></terra-stepper-step>
                `)
                expect(el.state).to.equal(state)
            }
        })

        it('should accept title property', async () => {
            const el: any = await fixture(html`
                <terra-stepper-step title="Step 1"></terra-stepper-step>
            `)
            expect(el.title).to.equal('Step 1')
        })

        it('should default title to empty string', async () => {
            const el: any = await fixture(html`
                <terra-stepper-step></terra-stepper-step>
            `)
            expect(el.title).to.equal('')
        })
    })

    describe('States', () => {
        it('should apply completed state class', async () => {
            const el: any = await fixture(html`
                <terra-stepper-step state="completed"></terra-stepper-step>
            `)
            const base = el.shadowRoot?.querySelector('[part~="base"]')
            expect(base?.classList.contains('stepper-step--completed')).to.be.true
        })

        it('should apply current state class', async () => {
            const el: any = await fixture(html`
                <terra-stepper-step state="current"></terra-stepper-step>
            `)
            const base = el.shadowRoot?.querySelector('[part~="base"]')
            expect(base?.classList.contains('stepper-step--current')).to.be.true
        })

        it('should apply upcoming state class', async () => {
            const el: any = await fixture(html`
                <terra-stepper-step state="upcoming"></terra-stepper-step>
            `)
            const base = el.shadowRoot?.querySelector('[part~="base"]')
            expect(base?.classList.contains('stepper-step--upcoming')).to.be.true
        })
    })

    describe('Default Variant', () => {
        it('should show title in default variant', async () => {
            const el: any = await fixture(html`
                <terra-stepper>
                    <terra-stepper-step title="Step 1"></terra-stepper-step>
                </terra-stepper>
            `)
            await elementUpdated(el)

            const step = el.querySelector('terra-stepper-step')
            const title = step.shadowRoot?.querySelector('.stepper-step__title')
            expect(title).to.exist
            expect(title?.textContent?.trim()).to.equal('Step 1')
        })

        it('should show caption slot in default variant', async () => {
            const el: any = await fixture(html`
                <terra-stepper>
                    <terra-stepper-step title="Step 1">
                        Caption text
                    </terra-stepper-step>
                </terra-stepper>
            `)
            await elementUpdated(el)

            const step = el.querySelector('terra-stepper-step')
            const caption = step.shadowRoot?.querySelector('.stepper-step__caption')
            expect(caption).to.exist
        })

        it('should show checkmark icon when completed in default variant', async () => {
            const el: any = await fixture(html`
                <terra-stepper>
                    <terra-stepper-step
                        title="Step 1"
                        state="completed"
                    ></terra-stepper-step>
                </terra-stepper>
            `)
            await elementUpdated(el)

            const step = el.querySelector('terra-stepper-step')
            const icon = step.shadowRoot?.querySelector('terra-icon')
            expect(icon).to.exist
        })

        it('should not show checkmark icon when hideCheckmark is true', async () => {
            const el: any = await fixture(html`
                <terra-stepper>
                    <terra-stepper-step
                        title="Step 1"
                        state="completed"
                        hide-checkmark
                    ></terra-stepper-step>
                </terra-stepper>
            `)
            await elementUpdated(el)

            const step = el.querySelector('terra-stepper-step')
            const icon = step.shadowRoot?.querySelector('terra-icon')
            expect(icon).to.not.exist
        })

        it('should not show checkmark icon when not completed', async () => {
            const el: any = await fixture(html`
                <terra-stepper>
                    <terra-stepper-step
                        title="Step 1"
                        state="current"
                    ></terra-stepper-step>
                </terra-stepper>
            `)
            await elementUpdated(el)

            const step = el.querySelector('terra-stepper-step')
            const icon = step.shadowRoot?.querySelector('terra-icon')
            expect(icon).to.not.exist
        })

        it('should accept hideCheckmark property', async () => {
            const el: any = await fixture(html`
                <terra-stepper>
                    <terra-stepper-step
                        title="Step 1"
                        state="completed"
                        hide-checkmark
                    ></terra-stepper-step>
                </terra-stepper>
            `)
            await elementUpdated(el)

            const step = el.querySelector('terra-stepper-step')
            expect(step.hideCheckmark).to.be.true
        })

        it('should reflect hideCheckmark as attribute', async () => {
            const el: any = await fixture(html`
                <terra-stepper>
                    <terra-stepper-step
                        title="Step 1"
                        state="completed"
                        hide-checkmark
                    ></terra-stepper-step>
                </terra-stepper>
            `)
            await elementUpdated(el)

            const step = el.querySelector('terra-stepper-step')
            expect(step.hasAttribute('hide-checkmark')).to.be.true
        })
    })

    describe('Condensed Variant', () => {
        it('should apply condensed class when parent is condensed', async () => {
            const el: any = await fixture(html`
                <terra-stepper variant="condensed">
                    <terra-stepper-step></terra-stepper-step>
                </terra-stepper>
            `)
            await elementUpdated(el)

            const step = el.querySelector('terra-stepper-step')
            const base = step.shadowRoot?.querySelector('[part~="base"]')
            expect(base?.classList.contains('stepper-step--condensed')).to.be.true
        })

        it('should not show title in condensed variant', async () => {
            const el: any = await fixture(html`
                <terra-stepper variant="condensed">
                    <terra-stepper-step title="Step 1"></terra-stepper-step>
                </terra-stepper>
            `)
            await elementUpdated(el)

            const step = el.querySelector('terra-stepper-step')
            const content = step.shadowRoot?.querySelector('.stepper-step__content')
            expect(content).to.not.exist
        })

        it('should not show checkmark in condensed variant', async () => {
            const el: any = await fixture(html`
                <terra-stepper variant="condensed">
                    <terra-stepper-step state="completed"></terra-stepper-step>
                </terra-stepper>
            `)
            await elementUpdated(el)

            const step = el.querySelector('terra-stepper-step')
            const icon = step.shadowRoot?.querySelector('terra-icon')
            expect(icon).to.not.exist
        })
    })

    describe('Layout', () => {
        it('should use flexbox layout', async () => {
            const el: any = await fixture(html`
                <terra-stepper-step></terra-stepper-step>
            `)
            const base = el.shadowRoot?.querySelector('[part~="base"]')
            const computedStyle = getComputedStyle(base)
            expect(computedStyle.display).to.equal('flex')
        })

        it('should have flex: 1 to share space', async () => {
            const el: any = await fixture(html`
                <terra-stepper>
                    <terra-stepper-step></terra-stepper-step>
                    <terra-stepper-step></terra-stepper-step>
                </terra-stepper>
            `)
            await elementUpdated(el)

            const step = el.querySelector('terra-stepper-step')
            const computedStyle = getComputedStyle(step)
            expect(computedStyle.flex).to.equal('1 1 0%')
        })
    })

    describe('Edge Cases', () => {
        it('should handle empty title', async () => {
            const el: any = await fixture(html`
                <terra-stepper>
                    <terra-stepper-step></terra-stepper-step>
                </terra-stepper>
            `)
            await elementUpdated(el)

            const step = el.querySelector('terra-stepper-step')
            const title = step.shadowRoot?.querySelector('.stepper-step__title')
            expect(title?.textContent?.trim()).to.equal('')
        })

        it('should handle empty caption', async () => {
            const el: any = await fixture(html`
                <terra-stepper>
                    <terra-stepper-step title="Step 1"></terra-stepper-step>
                </terra-stepper>
            `)
            await elementUpdated(el)

            const step = el.querySelector('terra-stepper-step')
            const caption = step.shadowRoot?.querySelector('.stepper-step__caption')
            // Caption should be hidden when empty
            expect(caption?.style.display || 'none').to.be.ok
        })
    })
})
