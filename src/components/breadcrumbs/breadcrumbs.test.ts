import { expect, fixture, html } from '@open-wc/testing'
import { elementUpdated } from '@open-wc/testing-helpers'
import './breadcrumbs.js'
import '../breadcrumb/breadcrumb.js'

describe('<terra-breadcrumbs>', () => {
    describe('Basic Rendering', () => {
        it('should render a component', async () => {
            const el = await fixture(html`
                <terra-breadcrumbs>
                    <terra-breadcrumb>Home</terra-breadcrumb>
                </terra-breadcrumbs>
            `)
            expect(el).to.exist
        })

        it('should render breadcrumb items in default slot', async () => {
            const el: any = await fixture(html`
                <terra-breadcrumbs>
                    <terra-breadcrumb>Home</terra-breadcrumb>
                    <terra-breadcrumb>Section</terra-breadcrumb>
                </terra-breadcrumbs>
            `)
            const breadcrumbs = el.querySelectorAll('terra-breadcrumb')
            expect(breadcrumbs.length).to.equal(2)
        })
    })

    describe('Properties', () => {
        it('should accept aria-label property', async () => {
            const el: any = await fixture(html`
                <terra-breadcrumbs aria-label="Navigation">
                    <terra-breadcrumb>Home</terra-breadcrumb>
                </terra-breadcrumbs>
            `)
            expect(el.ariaLabel).to.equal('Navigation')
        })

        it('should default aria-label to "Breadcrumb"', async () => {
            const el: any = await fixture(html`
                <terra-breadcrumbs>
                    <terra-breadcrumb>Home</terra-breadcrumb>
                </terra-breadcrumbs>
            `)
            expect(el.ariaLabel).to.equal('Breadcrumb')
        })

        it('should accept theme property', async () => {
            const el: any = await fixture(html`
                <terra-breadcrumbs theme="dark">
                    <terra-breadcrumb>Home</terra-breadcrumb>
                </terra-breadcrumbs>
            `)
            expect(el.theme).to.equal('dark')
        })

        it('should reflect theme as attribute', async () => {
            const el: any = await fixture(html`
                <terra-breadcrumbs theme="dark">
                    <terra-breadcrumb>Home</terra-breadcrumb>
                </terra-breadcrumbs>
            `)
            expect(el.getAttribute('theme')).to.equal('dark')
        })

        it('should default theme to light', async () => {
            const el: any = await fixture(html`
                <terra-breadcrumbs>
                    <terra-breadcrumb>Home</terra-breadcrumb>
                </terra-breadcrumbs>
            `)
            expect(el.theme).to.equal('light')
        })

        it('should accept both theme values', async () => {
            const themes = ['light', 'dark']
            for (const theme of themes) {
                const el: any = await fixture(html`
                    <terra-breadcrumbs theme=${theme}>
                        <terra-breadcrumb>Home</terra-breadcrumb>
                    </terra-breadcrumbs>
                `)
                expect(el.theme).to.equal(theme)
            }
        })
    })

    describe('Accessibility', () => {
        it('should have nav element with aria-label', async () => {
            const el: any = await fixture(html`
                <terra-breadcrumbs aria-label="Navigation">
                    <terra-breadcrumb>Home</terra-breadcrumb>
                </terra-breadcrumbs>
            `)
            const nav = el.shadowRoot?.querySelector('nav')
            expect(nav).to.exist
            expect(nav?.getAttribute('aria-label')).to.equal('Navigation')
        })

        it('should have default aria-label when not provided', async () => {
            const el: any = await fixture(html`
                <terra-breadcrumbs>
                    <terra-breadcrumb>Home</terra-breadcrumb>
                </terra-breadcrumbs>
            `)
            const nav = el.shadowRoot?.querySelector('nav')
            expect(nav?.getAttribute('aria-label')).to.equal('Breadcrumb')
        })
    })

    describe('Breadcrumb Items', () => {
        it('should render multiple breadcrumb items', async () => {
            const el: any = await fixture(html`
                <terra-breadcrumbs>
                    <terra-breadcrumb href="/">Home</terra-breadcrumb>
                    <terra-breadcrumb href="/section">Section</terra-breadcrumb>
                    <terra-breadcrumb current>Current</terra-breadcrumb>
                </terra-breadcrumbs>
            `)
            const breadcrumbs = el.querySelectorAll('terra-breadcrumb')
            expect(breadcrumbs.length).to.equal(3)
        })

        it('should render breadcrumbs with links and current page', async () => {
            const el: any = await fixture(html`
                <terra-breadcrumbs>
                    <terra-breadcrumb href="/">Home</terra-breadcrumb>
                    <terra-breadcrumb href="/section">Section</terra-breadcrumb>
                    <terra-breadcrumb current>Current</terra-breadcrumb>
                </terra-breadcrumbs>
            `)
            const breadcrumbs = el.querySelectorAll('terra-breadcrumb')
            expect(breadcrumbs[0].href).to.equal('/')
            expect(breadcrumbs[1].href).to.equal('/section')
            expect(breadcrumbs[2].current).to.be.true
            expect(breadcrumbs[2].href).to.be.undefined
        })
    })

    describe('CSS Parts', () => {
        it('should have base and nav parts', async () => {
            const el: any = await fixture(html`
                <terra-breadcrumbs>
                    <terra-breadcrumb>Home</terra-breadcrumb>
                </terra-breadcrumbs>
            `)
            const nav = el.shadowRoot?.querySelector('nav')
            expect(nav).to.exist
            // The nav element has both part="base nav"
            expect(nav?.getAttribute('part')).to.include('base')
            expect(nav?.getAttribute('part')).to.include('nav')
        })
    })

    describe('Edge Cases', () => {
        it('should handle empty breadcrumbs', async () => {
            const el: any = await fixture(html`
                <terra-breadcrumbs></terra-breadcrumbs>
            `)
            expect(el).to.exist
            const nav = el.shadowRoot?.querySelector('nav')
            expect(nav).to.exist
        })

        it('should handle single breadcrumb', async () => {
            const el: any = await fixture(html`
                <terra-breadcrumbs>
                    <terra-breadcrumb current>Home</terra-breadcrumb>
                </terra-breadcrumbs>
            `)
            const breadcrumbs = el.querySelectorAll('terra-breadcrumb')
            expect(breadcrumbs.length).to.equal(1)
        })

        it('should handle many breadcrumbs', async () => {
            const el: any = await fixture(html`
                <terra-breadcrumbs>
                    <terra-breadcrumb href="/1">One</terra-breadcrumb>
                    <terra-breadcrumb href="/2">Two</terra-breadcrumb>
                    <terra-breadcrumb href="/3">Three</terra-breadcrumb>
                    <terra-breadcrumb href="/4">Four</terra-breadcrumb>
                    <terra-breadcrumb href="/5">Five</terra-breadcrumb>
                    <terra-breadcrumb current>Six</terra-breadcrumb>
                </terra-breadcrumbs>
            `)
            const breadcrumbs = el.querySelectorAll('terra-breadcrumb')
            expect(breadcrumbs.length).to.equal(6)
        })
    })
})

