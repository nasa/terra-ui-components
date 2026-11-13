import { expect, fixture, html } from '@open-wc/testing'
import './badge.js'

describe('<terra-badge>', () => {
    describe('Basic Rendering', () => {
        it('should render a component', async () => {
            const el = await fixture(html` <terra-badge>Badge</terra-badge> `)
            expect(el).to.exist
        })

        it('should render content in default slot', async () => {
            const el: any = await fixture(html`
                <terra-badge>Badge Content</terra-badge>
            `)
            const base = el.shadowRoot?.querySelector('[part~="base"]')
            expect(base).to.exist
            // Content is in the slot, so it's in the light DOM
            expect(el.textContent?.trim()).to.equal('Badge Content')
        })
    })

    describe('Properties', () => {
        it('should accept variant property', async () => {
            const el: any = await fixture(html`
                <terra-badge variant="success">Badge</terra-badge>
            `)
            expect(el.variant).to.equal('success')
        })

        it('should reflect variant as attribute', async () => {
            const el: any = await fixture(html`
                <terra-badge variant="warning">Badge</terra-badge>
            `)
            expect(el.getAttribute('variant')).to.equal('warning')
        })

        it('should default variant to information', async () => {
            const el: any = await fixture(html` <terra-badge>Badge</terra-badge> `)
            expect(el.variant).to.equal('information')
        })

        it('should accept all variant values', async () => {
            const variants = ['primary', 'success', 'neutral', 'warning', 'danger']
            for (const variant of variants) {
                const el: any = await fixture(html`
                    <terra-badge variant=${variant}>Badge</terra-badge>
                `)
                expect(el.variant).to.equal(variant)
            }
        })

        it('should accept pill property', async () => {
            const el: any = await fixture(html`
                <terra-badge pill>Badge</terra-badge>
            `)
            expect(el.pill).to.be.true
        })

        it('should reflect pill as attribute', async () => {
            const el: any = await fixture(html`
                <terra-badge pill>Badge</terra-badge>
            `)
            expect(el.hasAttribute('pill')).to.be.true
        })

        it('should default pill to false', async () => {
            const el: any = await fixture(html` <terra-badge>Badge</terra-badge> `)
            expect(el.pill).to.be.false
        })

        it('should accept pulse property', async () => {
            const el: any = await fixture(html`
                <terra-badge pulse>Badge</terra-badge>
            `)
            expect(el.pulse).to.be.true
        })

        it('should reflect pulse as attribute', async () => {
            const el: any = await fixture(html`
                <terra-badge pulse>Badge</terra-badge>
            `)
            expect(el.hasAttribute('pulse')).to.be.true
        })

        it('should default pulse to false', async () => {
            const el: any = await fixture(html` <terra-badge>Badge</terra-badge> `)
            expect(el.pulse).to.be.false
        })

        it('should accept size property', async () => {
            const el: any = await fixture(html`
                <terra-badge size="small">Badge</terra-badge>
            `)
            expect(el.size).to.equal('small')
        })

        it('should reflect size as attribute', async () => {
            const el: any = await fixture(html`
                <terra-badge size="large">Badge</terra-badge>
            `)
            expect(el.getAttribute('size')).to.equal('large')
        })

        it('should default size to medium', async () => {
            const el: any = await fixture(html` <terra-badge>Badge</terra-badge> `)
            expect(el.size).to.equal('medium')
        })

        it('should accept role property', async () => {
            const el: any = await fixture(html`
                <terra-badge role="presentation">Badge</terra-badge>
            `)
            expect(el.role).to.equal('presentation')
            const base = el.shadowRoot?.querySelector('[part~="base"]')
            expect(base?.getAttribute('role')).to.equal('presentation')
        })

        it('should default role to status', async () => {
            const el: any = await fixture(html` <terra-badge>Badge</terra-badge> `)
            expect(el.role).to.equal('status')
            const base = el.shadowRoot?.querySelector('[part~="base"]')
            expect(base?.getAttribute('role')).to.equal('status')
        })
    })

    describe('Sizes', () => {
        it('should apply medium size class by default', async () => {
            const el: any = await fixture(html` <terra-badge>Badge</terra-badge> `)
            const base = el.shadowRoot?.querySelector('[part~="base"]')
            expect(base?.classList.contains('badge--medium')).to.be.true
        })

        it('should apply small size class', async () => {
            const el: any = await fixture(html`
                <terra-badge size="small">Badge</terra-badge>
            `)
            const base = el.shadowRoot?.querySelector('[part~="base"]')
            expect(base?.classList.contains('badge--small')).to.be.true
        })

        it('should apply large size class', async () => {
            const el: any = await fixture(html`
                <terra-badge size="large">Badge</terra-badge>
            `)
            const base = el.shadowRoot?.querySelector('[part~="base"]')
            expect(base?.classList.contains('badge--large')).to.be.true
        })
    })

    describe('Variants', () => {
        it('should apply information variant class by default', async () => {
            const el: any = await fixture(html` <terra-badge>Badge</terra-badge> `)
            const base = el.shadowRoot?.querySelector('[part~="base"]')
            expect(base?.classList.contains('badge--information')).to.be.true
        })

        it('should apply success variant class', async () => {
            const el: any = await fixture(html`
                <terra-badge variant="success">Badge</terra-badge>
            `)
            const base = el.shadowRoot?.querySelector('[part~="base"]')
            expect(base?.classList.contains('badge--success')).to.be.true
        })

        it('should apply neutral variant class', async () => {
            const el: any = await fixture(html`
                <terra-badge variant="neutral">Badge</terra-badge>
            `)
            const base = el.shadowRoot?.querySelector('[part~="base"]')
            expect(base?.classList.contains('badge--neutral')).to.be.true
        })

        it('should apply warning variant class', async () => {
            const el: any = await fixture(html`
                <terra-badge variant="warning">Badge</terra-badge>
            `)
            const base = el.shadowRoot?.querySelector('[part~="base"]')
            expect(base?.classList.contains('badge--warning')).to.be.true
        })

        it('should apply danger variant class', async () => {
            const el: any = await fixture(html`
                <terra-badge variant="danger">Badge</terra-badge>
            `)
            const base = el.shadowRoot?.querySelector('[part~="base"]')
            expect(base?.classList.contains('badge--danger')).to.be.true
        })
    })

    describe('Pill Style', () => {
        it('should apply pill class when pill is true', async () => {
            const el: any = await fixture(html`
                <terra-badge pill>Badge</terra-badge>
            `)
            const base = el.shadowRoot?.querySelector('[part~="base"]')
            expect(base?.classList.contains('badge--pill')).to.be.true
        })

        it('should not apply pill class when pill is false', async () => {
            const el: any = await fixture(html` <terra-badge>Badge</terra-badge> `)
            const base = el.shadowRoot?.querySelector('[part~="base"]')
            expect(base?.classList.contains('badge--pill')).to.be.false
        })
    })

    describe('Pulse Animation', () => {
        it('should apply pulse class when pulse is true', async () => {
            const el: any = await fixture(html`
                <terra-badge pulse>Badge</terra-badge>
            `)
            const base = el.shadowRoot?.querySelector('[part~="base"]')
            expect(base?.classList.contains('badge--pulse')).to.be.true
        })

        it('should not apply pulse class when pulse is false', async () => {
            const el: any = await fixture(html` <terra-badge>Badge</terra-badge> `)
            const base = el.shadowRoot?.querySelector('[part~="base"]')
            expect(base?.classList.contains('badge--pulse')).to.be.false
        })
    })

    describe('Accessibility', () => {
        it('should have role="status"', async () => {
            const el: any = await fixture(html` <terra-badge>Badge</terra-badge> `)
            const base = el.shadowRoot?.querySelector('[part~="base"]')
            expect(base?.getAttribute('role')).to.equal('status')
        })
    })

    describe('Combined Properties', () => {
        it('should apply multiple classes when multiple properties are set', async () => {
            const el: any = await fixture(html`
                <terra-badge variant="success" pill pulse>Badge</terra-badge>
            `)
            const base = el.shadowRoot?.querySelector('[part~="base"]')
            expect(base?.classList.contains('badge--success')).to.be.true
            expect(base?.classList.contains('badge--pill')).to.be.true
            expect(base?.classList.contains('badge--pulse')).to.be.true
        })
    })

    describe('Edge Cases', () => {
        it('should handle empty content', async () => {
            const el: any = await fixture(html` <terra-badge></terra-badge> `)
            expect(el).to.exist
            const base = el.shadowRoot?.querySelector('[part~="base"]')
            expect(base).to.exist
        })

        it('should handle numeric content', async () => {
            const el: any = await fixture(html` <terra-badge>42</terra-badge> `)
            expect(el.textContent?.trim()).to.equal('42')
        })

        it('should handle long text content', async () => {
            const el: any = await fixture(html`
                <terra-badge>Very Long Badge Text</terra-badge>
            `)
            expect(el.textContent?.trim()).to.equal('Very Long Badge Text')
        })
    })
})
