import { expect, fixture, html } from '@open-wc/testing'
import sinon from 'sinon'
import '../button.js'
import type TerraButton from '../button.component.js'
import '../../dialog/dialog.js'
import type TerraDialog from '../../dialog/dialog.component.js'

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

    describe('forDialog', () => {
        afterEach(() => {
            sinon.restore()
        })

        it('removes the exact document event listeners on disconnect', async () => {
            const addSpy = sinon.spy(document, 'addEventListener')
            const removeSpy = sinon.spy(document, 'removeEventListener')

            const el = await fixture<TerraButton>(
                html`<terra-button for-dialog="test-dialog">Open</terra-button>`
            )

            const addedShowHandlers = addSpy.args
                .filter(([type]) => type === 'terra-dialog-show')
                .map(([, listener]) => listener)
            const addedHideHandlers = addSpy.args
                .filter(([type]) => type === 'terra-dialog-hide')
                .map(([, listener]) => listener)

            expect(addedShowHandlers.length).to.be.greaterThan(0)
            expect(addedHideHandlers.length).to.be.greaterThan(0)
            expect(new Set(addedShowHandlers).size).to.equal(1)
            expect(new Set(addedHideHandlers).size).to.equal(1)

            el.remove()

            expect(
                removeSpy.calledWithExactly('terra-dialog-show', addedShowHandlers[0])
            ).to.be.true
            expect(
                removeSpy.calledWithExactly('terra-dialog-hide', addedHideHandlers[0])
            ).to.be.true
        })

        it('updates aria-expanded on matching dialog events and stops listening after disconnect', async () => {
            const container = await fixture<HTMLDivElement>(html`
                <div>
                    <terra-button for-dialog="test-dialog">Open</terra-button>
                    <terra-dialog id="test-dialog">Body</terra-dialog>
                    <terra-dialog id="other-dialog">Other</terra-dialog>
                </div>
            `)
            const button = container.querySelector('terra-button')!
            const dialog = container.querySelector('#test-dialog') as TerraDialog
            const otherDialog = container.querySelector(
                '#other-dialog'
            ) as TerraDialog
            const innerButton = button.shadowRoot!.querySelector('button')!

            expect(innerButton.getAttribute('aria-expanded')).to.equal('false')

            otherDialog.open = true
            otherDialog.dispatchEvent(
                new CustomEvent('terra-dialog-show', {
                    bubbles: true,
                    composed: true,
                })
            )
            await button.updateComplete
            expect(innerButton.getAttribute('aria-expanded')).to.equal('false')

            dialog.open = true
            dialog.dispatchEvent(
                new CustomEvent('terra-dialog-show', {
                    bubbles: true,
                    composed: true,
                })
            )
            await button.updateComplete
            expect(innerButton.getAttribute('aria-expanded')).to.equal('true')

            button.remove()

            dialog.open = false
            dialog.dispatchEvent(
                new CustomEvent('terra-dialog-hide', {
                    bubbles: true,
                    composed: true,
                })
            )
            await button.updateComplete
            expect(innerButton.getAttribute('aria-expanded')).to.equal('true')
        })

        it('attaches and detaches listeners when forDialog changes dynamically', async () => {
            const removeSpy = sinon.spy(document, 'removeEventListener')
            const el = await fixture<TerraButton>(
                html`<terra-button>Open</terra-button>`
            )
            const dialog = await fixture<TerraDialog>(
                html`<terra-dialog id="dynamic-dialog">Body</terra-dialog>`
            )
            const innerButton = el.shadowRoot!.querySelector('button')!

            el.forDialog = 'dynamic-dialog'
            await el.updateComplete

            dialog.open = true
            dialog.dispatchEvent(
                new CustomEvent('terra-dialog-show', {
                    bubbles: true,
                    composed: true,
                })
            )
            await el.updateComplete
            expect(innerButton.getAttribute('aria-expanded')).to.equal('true')

            el.forDialog = 'other-dialog'
            await el.updateComplete
            expect(innerButton.getAttribute('aria-expanded')).to.equal('false')

            el.forDialog = undefined
            await el.updateComplete
            expect(innerButton.hasAttribute('aria-expanded')).to.be.false
            expect(removeSpy.calledWith('terra-dialog-show', sinon.match.func)).to.be
                .true
            expect(removeSpy.calledWith('terra-dialog-hide', sinon.match.func)).to.be
                .true
        })
    })
})
