import { expect, fixture, html } from '@open-wc/testing'
import '../button.js'
import type TerraButton from '../button.component.js'

describe('<terra-button>', () => {
    describe('Basic Rendering', () => {
        it('should render a component', async () => {
            const el = await fixture(html`<terra-button>Click Me</terra-button>`)
            expect(el).to.exist
        })
    })

    describe('setPageLinkIcon', () => {
        it('should return internal icon for relative, same-origin, and unparseable URLs', async () => {
            const el: TerraButton = await fixture(
                html`<terra-button variant="pagelink" href="/overview"
                    >Overview</terra-button
                >`
            )
            const icon = el.shadowRoot?.querySelector('terra-icon')
            expect(icon?.getAttribute('name')).to.equal('outline-arrow-right')

            expect(el.setPageLinkIcon('/overview')).to.equal('outline-arrow-right')
            expect(el.setPageLinkIcon('#section')).to.equal('outline-arrow-right')
            expect(el.setPageLinkIcon('relative/path/page.html')).to.equal(
                'outline-arrow-right'
            )
            expect(el.setPageLinkIcon('')).to.equal('outline-arrow-right')
            expect(el.setPageLinkIcon('http://[invalid')).to.equal(
                'outline-arrow-right'
            )
            expect(el.setPageLinkIcon(globalThis.location.href)).to.equal(
                'outline-arrow-right'
            )
        })

        it('should return external icon for different host domains', async () => {
            const el: TerraButton = await fixture(
                html`<terra-button
                    variant="pagelink"
                    href="https://example.com/page"
                    >External</terra-button
                >`
            )
            const icon = el.shadowRoot?.querySelector('terra-icon')
            expect(icon?.getAttribute('name')).to.equal('outline-arrow-up-right')

            expect(el.setPageLinkIcon('https://example.com/page')).to.equal(
                'outline-arrow-up-right'
            )
            expect(el.setPageLinkIcon('//example.com/page')).to.equal(
                'outline-arrow-up-right'
            )
        })
    })
})
