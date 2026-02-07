import { expect, fixture, html, elementUpdated } from '@open-wc/testing'
import './stepper.js'
import '../stepper-step/stepper-step.js'

describe('<terra-stepper>', () => {
    describe('Basic Rendering', () => {
        it('should render a component', async () => {
            const el = await fixture(html` <terra-stepper></terra-stepper> `)
            expect(el).to.exist
        })

        it('should render with base part', async () => {
            const el: any = await fixture(html` <terra-stepper></terra-stepper> `)
            const base = el.shadowRoot?.querySelector('[part~="base"]')
            expect(base).to.exist
        })

        it('should have stepper class', async () => {
            const el: any = await fixture(html` <terra-stepper></terra-stepper> `)
            const base = el.shadowRoot?.querySelector('[part~="base"]')
            expect(base?.classList.contains('stepper')).to.be.true
        })
    })

    describe('Properties', () => {
        it('should accept variant property', async () => {
            const el: any = await fixture(html`
                <terra-stepper variant="condensed"></terra-stepper>
            `)
            expect(el.variant).to.equal('condensed')
        })

        it('should reflect variant as attribute', async () => {
            const el: any = await fixture(html`
                <terra-stepper variant="condensed"></terra-stepper>
            `)
            expect(el.getAttribute('variant')).to.equal('condensed')
        })

        it('should default variant to default', async () => {
            const el: any = await fixture(html` <terra-stepper></terra-stepper> `)
            expect(el.variant).to.equal('default')
        })

        it('should apply default variant class', async () => {
            const el: any = await fixture(html`
                <terra-stepper variant="default"></terra-stepper>
            `)
            const base = el.shadowRoot?.querySelector('[part~="base"]')
            expect(base?.classList.contains('stepper--default')).to.be.true
        })

        it('should apply condensed variant class', async () => {
            const el: any = await fixture(html`
                <terra-stepper variant="condensed"></terra-stepper>
            `)
            const base = el.shadowRoot?.querySelector('[part~="base"]')
            expect(base?.classList.contains('stepper--condensed')).to.be.true
        })
    })

    describe('Slot Handling', () => {
        it('should handle slot changes', async () => {
            const el: any = await fixture(html`
                <terra-stepper>
                    <terra-stepper-step title="Step 1"></terra-stepper-step>
                    <terra-stepper-step title="Step 2"></terra-stepper-step>
                    <terra-stepper-step title="Step 3"></terra-stepper-step>
                </terra-stepper>
            `)
            await elementUpdated(el)

            const steps = el.querySelectorAll('terra-stepper-step')
            expect(steps.length).to.equal(3)

            // Check that data attributes are set
            expect(steps[0].hasAttribute('data-terra-stepper__step')).to.be.true
            expect(steps[0].hasAttribute('data-terra-stepper__step--first')).to.be
                .true
            expect(steps[2].hasAttribute('data-terra-stepper__step--last')).to.be.true
        })

        it('should mark first step correctly', async () => {
            const el: any = await fixture(html`
                <terra-stepper>
                    <terra-stepper-step title="First"></terra-stepper-step>
                    <terra-stepper-step title="Second"></terra-stepper-step>
                </terra-stepper>
            `)
            await elementUpdated(el)

            const firstStep = el.querySelector('terra-stepper-step')
            expect(firstStep.hasAttribute('data-terra-stepper__step--first')).to.be
                .true
            expect(firstStep.hasAttribute('data-terra-stepper__step--last')).to.be
                .false
        })

        it('should mark last step correctly', async () => {
            const el: any = await fixture(html`
                <terra-stepper>
                    <terra-stepper-step title="First"></terra-stepper-step>
                    <terra-stepper-step title="Last"></terra-stepper-step>
                </terra-stepper>
            `)
            await elementUpdated(el)

            const steps = el.querySelectorAll('terra-stepper-step')
            const lastStep = steps[steps.length - 1]
            expect(lastStep.hasAttribute('data-terra-stepper__step--last')).to.be.true
            expect(lastStep.hasAttribute('data-terra-stepper__step--first')).to.be
                .false
        })

        it('should handle single step', async () => {
            const el: any = await fixture(html`
                <terra-stepper>
                    <terra-stepper-step title="Only"></terra-stepper-step>
                </terra-stepper>
            `)
            await elementUpdated(el)

            const step = el.querySelector('terra-stepper-step')
            expect(step.hasAttribute('data-terra-stepper__step--first')).to.be.true
            expect(step.hasAttribute('data-terra-stepper__step--last')).to.be.true
        })

        it('should update when steps are added', async () => {
            const el: any = await fixture(html`
                <terra-stepper>
                    <terra-stepper-step title="First"></terra-stepper-step>
                </terra-stepper>
            `)
            await elementUpdated(el)

            const newStep = document.createElement('terra-stepper-step')
            newStep.setAttribute('title', 'Second')
            el.appendChild(newStep)
            await elementUpdated(el)

            const steps = el.querySelectorAll('terra-stepper-step')
            expect(steps.length).to.equal(2)
            expect(steps[0].hasAttribute('data-terra-stepper__step--first')).to.be
                .true
            expect(steps[1].hasAttribute('data-terra-stepper__step--last')).to.be.true
        })
    })

    describe('Layout', () => {
        it('should use flexbox layout', async () => {
            const el: any = await fixture(html`
                <terra-stepper>
                    <terra-stepper-step title="Step 1"></terra-stepper-step>
                    <terra-stepper-step title="Step 2"></terra-stepper-step>
                </terra-stepper>
            `)
            await elementUpdated(el)

            const base = el.shadowRoot?.querySelector('[part~="base"]')
            const computedStyle = getComputedStyle(base)
            expect(computedStyle.display).to.equal('flex')
        })

        it('should fill 100% width', async () => {
            const el: any = await fixture(html`
                <terra-stepper>
                    <terra-stepper-step title="Step 1"></terra-stepper-step>
                </terra-stepper>
            `)
            await elementUpdated(el)

            const computedStyle = getComputedStyle(el)
            const parentComputedStyle = getComputedStyle(el.parentElement)

            expect(computedStyle.width).to.equal(parentComputedStyle.width)
        })
    })

    describe('Edge Cases', () => {
        it('should handle empty stepper', async () => {
            const el: any = await fixture(html` <terra-stepper></terra-stepper> `)
            await elementUpdated(el)
            expect(el).to.exist
        })
    })
})
