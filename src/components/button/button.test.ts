import { expect, fixture, html } from '@open-wc/testing'
import './button.js'
import type { TerraButton } from './button.component.js'

describe('<terra-button>', () => {
    describe('Basic Rendering', () => {
        it('should render a component', async () => {
            const el = await fixture(html`<terra-button>Click Me</terra-button>`)
            expect(el).to.exist
        })
    })

    describe('setPageLinkIcon', () => {
        it('should resolve relative URLs without throwing TypeError (Issue #77)', async () => {
            const el: TerraButton = await fixture(
                html`<terra-button variant="pagelink" href="/overview"
                    >Overview</terra-button
                >`
            )
            expect(el).to.exist

            expect(() => {
                const icon = el.setPageLinkIcon('/overview')
                expect(icon).to.be.a('string')
            }).to.not.throw()

            expect(() => {
                const icon = el.setPageLinkIcon('#section')
                expect(icon).to.be.a('string')
            }).to.not.throw()

            expect(() => {
                const icon = el.setPageLinkIcon('relative/path/page.html')
                expect(icon).to.be.a('string')
            }).to.not.throw()
        })

        it('should return external icon for different host domains', async () => {
            const el: TerraButton = await fixture(
                html`<terra-button variant="pagelink" href="https://example.com/page"
                    >External</terra-button
                >`
            )
            const icon = el.setPageLinkIcon('https://example.com/page')
            expect(icon).to.equal('outline-arrow-up-right')
        })
    })
})
