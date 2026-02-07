import { expect, fixture, html } from '@open-wc/testing'
import { elementUpdated } from '@open-wc/testing-helpers'
import './breadcrumb.js'

describe('<terra-breadcrumb>', () => {
    describe('Basic Rendering', () => {
        it('should render a component', async () => {
            const el = await fixture(html`
                <terra-breadcrumb>Home</terra-breadcrumb>
            `)
            expect(el).to.exist
        })

        it('should render content in default slot', async () => {
            const el: any = await fixture(html`
                <terra-breadcrumb>Breadcrumb Content</terra-breadcrumb>
            `)
            expect(el.textContent?.trim()).to.equal('Breadcrumb Content')
        })
    })

    describe('Properties', () => {
        it('should accept href property', async () => {
            const el: any = await fixture(html`
                <terra-breadcrumb href="/home">Home</terra-breadcrumb>
            `)
            expect(el.href).to.equal('/home')
        })

        it('should default href to undefined', async () => {
            const el: any = await fixture(html`
                <terra-breadcrumb>Home</terra-breadcrumb>
            `)
            expect(el.href).to.be.undefined
        })

        it('should accept current property', async () => {
            const el: any = await fixture(html`
                <terra-breadcrumb current>Current</terra-breadcrumb>
            `)
            expect(el.current).to.be.true
        })

        it('should reflect current as attribute', async () => {
            const el: any = await fixture(html`
                <terra-breadcrumb current>Current</terra-breadcrumb>
            `)
            expect(el.hasAttribute('current')).to.be.true
        })

        it('should default current to false', async () => {
            const el: any = await fixture(html`
                <terra-breadcrumb>Home</terra-breadcrumb>
            `)
            expect(el.current).to.be.false
        })
    })

    describe('Link vs Label Rendering', () => {
        it('should render as link when href is provided', async () => {
            const el: any = await fixture(html`
                <terra-breadcrumb href="/home">Home</terra-breadcrumb>
            `)
            const link = el.shadowRoot?.querySelector('[part~="link"]')
            expect(link).to.exist
            expect(link?.tagName).to.equal('A')
            expect(link?.getAttribute('href')).to.equal('/home')
        })

        it('should render as label when href is not provided', async () => {
            const el: any = await fixture(html`
                <terra-breadcrumb>Home</terra-breadcrumb>
            `)
            const label = el.shadowRoot?.querySelector('[part~="label"]')
            expect(label).to.exist
            expect(label?.tagName).to.equal('SPAN')
            const link = el.shadowRoot?.querySelector('[part~="link"]')
            expect(link).to.not.exist
        })

        it('should apply link class when href is provided', async () => {
            const el: any = await fixture(html`
                <terra-breadcrumb href="/home">Home</terra-breadcrumb>
            `)
            const base = el.shadowRoot?.querySelector('[part~="base"]')
            expect(base?.classList.contains('breadcrumb--link')).to.be.true
        })

        it('should not apply link class when href is not provided', async () => {
            const el: any = await fixture(html`
                <terra-breadcrumb>Home</terra-breadcrumb>
            `)
            const base = el.shadowRoot?.querySelector('[part~="base"]')
            expect(base?.classList.contains('breadcrumb--link')).to.be.false
        })
    })

    describe('Current State', () => {
        it('should apply current class when current is true', async () => {
            const el: any = await fixture(html`
                <terra-breadcrumb current>Current</terra-breadcrumb>
            `)
            const base = el.shadowRoot?.querySelector('[part~="base"]')
            expect(base?.classList.contains('breadcrumb--current')).to.be.true
        })

        it('should not apply current class when current is false', async () => {
            const el: any = await fixture(html`
                <terra-breadcrumb>Home</terra-breadcrumb>
            `)
            const base = el.shadowRoot?.querySelector('[part~="base"]')
            expect(base?.classList.contains('breadcrumb--current')).to.be.false
        })
    })

    describe('Accessibility', () => {
        it('should have aria-current="page" on link when current is true', async () => {
            const el: any = await fixture(html`
                <terra-breadcrumb href="/current" current>Current</terra-breadcrumb>
            `)
            const link = el.shadowRoot?.querySelector('[part~="link"]')
            expect(link?.getAttribute('aria-current')).to.equal('page')
        })

        it('should not have aria-current on link when current is false', async () => {
            const el: any = await fixture(html`
                <terra-breadcrumb href="/home">Home</terra-breadcrumb>
            `)
            const link = el.shadowRoot?.querySelector('[part~="link"]')
            // When aria-current is undefined, Lit sets it to empty string
            const ariaCurrent = link?.getAttribute('aria-current')
            expect(ariaCurrent === null || ariaCurrent === '').to.be.true
        })

        it('should have aria-current="page" on label when current is true', async () => {
            const el: any = await fixture(html`
                <terra-breadcrumb current>Current</terra-breadcrumb>
            `)
            const label = el.shadowRoot?.querySelector('[part~="label"]')
            expect(label?.getAttribute('aria-current')).to.equal('page')
        })

        it('should not have aria-current on label when current is false', async () => {
            const el: any = await fixture(html`
                <terra-breadcrumb>Home</terra-breadcrumb>
            `)
            const label = el.shadowRoot?.querySelector('[part~="label"]')
            // When aria-current is undefined, Lit sets it to empty string
            const ariaCurrent = label?.getAttribute('aria-current')
            expect(ariaCurrent === null || ariaCurrent === '').to.be.true
        })
    })

    describe('Combined States', () => {
        it('should render as link with current when both href and current are set', async () => {
            const el: any = await fixture(html`
                <terra-breadcrumb href="/current" current>Current</terra-breadcrumb>
            `)
            const link = el.shadowRoot?.querySelector('[part~="link"]')
            expect(link).to.exist
            expect(link?.getAttribute('aria-current')).to.equal('page')
            const base = el.shadowRoot?.querySelector('[part~="base"]')
            expect(base?.classList.contains('breadcrumb--current')).to.be.true
            expect(base?.classList.contains('breadcrumb--link')).to.be.true
        })

        it('should render as label with current when current is set but no href', async () => {
            const el: any = await fixture(html`
                <terra-breadcrumb current>Current</terra-breadcrumb>
            `)
            const label = el.shadowRoot?.querySelector('[part~="label"]')
            expect(label).to.exist
            expect(label?.getAttribute('aria-current')).to.equal('page')
            const base = el.shadowRoot?.querySelector('[part~="base"]')
            expect(base?.classList.contains('breadcrumb--current')).to.be.true
        })
    })

    describe('Edge Cases', () => {
        it('should handle empty href string', async () => {
            const el: any = await fixture(html`
                <terra-breadcrumb href="">Home</terra-breadcrumb>
            `)
            // Empty string should be treated as falsy, so should render as label
            const label = el.shadowRoot?.querySelector('[part~="label"]')
            expect(label).to.exist
        })

        it('should handle empty content', async () => {
            const el: any = await fixture(html`
                <terra-breadcrumb></terra-breadcrumb>
            `)
            expect(el).to.exist
            const base = el.shadowRoot?.querySelector('[part~="base"]')
            expect(base).to.exist
        })

        it('should handle href change from undefined to defined', async () => {
            const el: any = await fixture(html`
                <terra-breadcrumb>Home</terra-breadcrumb>
            `)
            let label = el.shadowRoot?.querySelector('[part~="label"]')
            expect(label).to.exist

            el.href = '/home'
            await elementUpdated(el)

            const link = el.shadowRoot?.querySelector('[part~="link"]')
            expect(link).to.exist
            label = el.shadowRoot?.querySelector('[part~="label"]')
            expect(label).to.not.exist
        })

        it('should handle href change from defined to undefined', async () => {
            const el: any = await fixture(html`
                <terra-breadcrumb href="/home">Home</terra-breadcrumb>
            `)
            let link = el.shadowRoot?.querySelector('[part~="link"]')
            expect(link).to.exist

            el.href = undefined
            await elementUpdated(el)

            const label = el.shadowRoot?.querySelector('[part~="label"]')
            expect(label).to.exist
            link = el.shadowRoot?.querySelector('[part~="link"]')
            expect(link).to.not.exist
        })
    })
})
