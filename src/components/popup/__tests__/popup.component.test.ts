
import { aTimeout, expect, fixture, html, waitUntil } from '@open-wc/testing'
import { setViewport } from '@web/test-runner-commands'
import '../popup.js'

async function createPopup() {
    const el = await fixture(html`
        <div>
            <button id="anchor">Anchor</button>
            <terra-popup placement="bottom" arrow>
                Popup content
            </terra-popup>
        </div>
    `)

    const anchor = el.querySelector<HTMLButtonElement>('#anchor')!
    const popup = el.querySelector('terra-popup')!

    // Simulate an anchor that has scrolled above the viewport.
    anchor.getBoundingClientRect = () =>
        new DOMRect(20, -40, 20, 20)

    popup.anchor = anchor
    popup.active = true

    await popup.updateComplete

    // Wait for Floating UI to calculate the initial position.
    await waitUntil(
        () => popup.hasAttribute('data-current-placement'),
        'popup did not finish positioning',
        { timeout: 3000 }
    )

    return { popup, anchor }
}

async function createPopupNearBottom() {
    const el = await fixture(html`
        <div>
            <button id="anchor">Anchor</button>
            <terra-popup placement="bottom" flip arrow>
                Popup content
            </terra-popup>
        </div>
    `)

    const anchor = el.querySelector<HTMLButtonElement>('#anchor')!
    const popup = el.querySelector('terra-popup')!

    // Leave insufficient room below the anchor for the popup.
    anchor.getBoundingClientRect = () =>
        new DOMRect(200, 730, 100, 20)

    popup.anchor = anchor
    popup.active = true

    await popup.updateComplete

    await waitUntil(
        () => popup.getAttribute('data-current-placement') === 'top',
        'popup did not flip from bottom to top',
        { timeout: 3000 }
    )

    return { popup, anchor }
}

async function createPopupWithOversizedContent() {
    const el = await fixture(html`
        <div>
            <button id="anchor">Anchor</button>
            <terra-popup placement="bottom" arrow>
                <div style="width: 1000px; height: 1200px;">
                    Oversized popup content
                </div>
            </terra-popup>
        </div>
    `)

    const anchor = el.querySelector<HTMLButtonElement>('#anchor')!
    const popup = el.querySelector('terra-popup')!

    anchor.getBoundingClientRect = () =>
        new DOMRect(20, 100, 20, 20)

    popup.anchor = anchor
    popup.active = true

    await popup.updateComplete

    await waitUntil(
        () => popup.hasAttribute('data-current-placement'),
        'popup did not finish positioning',
        { timeout: 3000 }
    )

    return { popup, anchor }
}

describe('<terra-popup>', () => {
    afterEach(async () => {
        // Restore the desktop viewport for the next test.
        await setViewport({ width: 1024, height: 768 })
    })

    it('emits exactly one dismiss event per dismissal on mobile viewports', async () => {
        await setViewport({ width: 390, height: 844 })

        const { popup } = await createPopup()

        let dismissCount = 0

        popup.addEventListener('terra-popup-dismiss', () => {
            dismissCount++
        })

        // Dispatch twice synchronously to catch duplicate listener calls
        // before Lit has processed the active property update.
        window.dispatchEvent(new Event('scroll'))
        window.dispatchEvent(new Event('scroll'))

        expect(dismissCount).to.equal(1)
        expect(popup.active).to.equal(false)
    })

    it('does not dismiss when the viewport is wider than 768px', async () => {
        await setViewport({ width: 1024, height: 768 })

        const { popup } = await createPopup()

        let dismissCount = 0

        popup.addEventListener('terra-popup-dismiss', () => {
            dismissCount++
        })

        window.dispatchEvent(new Event('scroll'))

        expect(dismissCount).to.equal(0)
        expect(popup.active).to.equal(true)
    })

    it('starts dismissing when the viewport changes from desktop to mobile', async () => {
        await setViewport({ width: 1024, height: 768 })

        const { popup } = await createPopup()

        let dismissCount = 0

        popup.addEventListener('terra-popup-dismiss', () => {
            dismissCount++
        })

        expect(popup.active).to.equal(true)

        // Cross the 768px breakpoint while the popup is open.
        await setViewport({ width: 390, height: 844 })

        await waitUntil(
            () => popup.isMobile,
            'popup did not recognize the mobile viewport'
        )

        window.dispatchEvent(new Event('scroll'))

        expect(dismissCount).to.equal(1)
        expect(popup.active).to.equal(false)
    })

    it('stops dismissing when the viewport changes from mobile to desktop', async () => {
        await setViewport({ width: 390, height: 844 })

        const { popup } = await createPopup()

        let dismissCount = 0

        popup.addEventListener('terra-popup-dismiss', () => {
            dismissCount++
        })

        expect(popup.isMobile).to.equal(true)

        await setViewport({ width: 1024, height: 768 })

        await waitUntil(
            () => !popup.isMobile,
            'popup did not recognize the desktop viewport'
        )

        window.dispatchEvent(new Event('scroll'))

        expect(dismissCount).to.equal(0)
        expect(popup.active).to.equal(true)
    })

    it('can be dismissed again after being reopened on mobile viewports', async () => {
        await setViewport({ width: 390, height: 844 })

        const { popup } = await createPopup()

        let dismissCount = 0

        popup.addEventListener('terra-popup-dismiss', () => {
            dismissCount++
        })

        window.dispatchEvent(new Event('scroll'))
        await popup.updateComplete

        expect(dismissCount).to.equal(1)
        expect(popup.active).to.equal(false)

        // Reopen the popup.
        popup.active = true
        await popup.updateComplete

        await waitUntil(
            () => popup.hasAttribute('data-current-placement'),
            'reopened popup did not finish positioning'
        )

        window.dispatchEvent(new Event('scroll'))

        expect(dismissCount).to.equal(2)
        expect(popup.active).to.equal(false)
    })

    
    it('allows oversized content to scroll within the popup on mobile viewports', async () => {
        await setViewport({ width: 390, height: 844 })

        const { popup } = await createPopupWithOversizedContent()

        const content =
            popup.shadowRoot!.querySelector<HTMLElement>('.popup__content')!

        await waitUntil(
            () =>
                content.clientHeight > 0 &&
                content.clientWidth > 0 &&
                content.scrollHeight > content.clientHeight &&
                content.scrollWidth > content.clientWidth,
            'popup content did not become scrollable',
            { timeout: 3000 }
        )

        expect(getComputedStyle(content).overflow).to.equal('auto')

        const arrow =
            popup.shadowRoot!.querySelector<HTMLElement>('.popup__arrow')!

        expect(content.contains(arrow)).to.equal(false)
        expect(arrow.parentElement).to.equal(content.parentElement)
    })
    
    it('positions the arrow correctly when the popup flips from bottom to top', async () => {
        await setViewport({ width: 1024, height: 768 })

        const { popup, anchor } = await createPopupNearBottom()

        const arrow =
            popup.shadowRoot!.querySelector<HTMLElement>('.popup__arrow')!

        // The arrow must be attached to the popup's bottom edge.
        expect(arrow.style.bottom).to.equal(
            'calc(var(--arrow-size-diagonal) * -1)'
        )
        expect(arrow.style.top).to.equal('')

        // The arrow should remain horizontally aligned with the anchor.
        const arrowRect = arrow.getBoundingClientRect()
        const anchorRect = anchor.getBoundingClientRect()

        const arrowCenter = arrowRect.left + arrowRect.width / 2
        const anchorCenter = anchorRect.left + anchorRect.width / 2

        expect(Math.abs(arrowCenter - anchorCenter)).to.be.lessThan(2)
    })

    it('cleans up listeners and positioning when disconnected on mobile viewports', async () => {
        await setViewport({ width: 390, height: 844 })

        const { popup } = await createPopup()

        let dismissCount = 0
        let repositionCount = 0

        popup.addEventListener('terra-popup-dismiss', () => {
            dismissCount++
        })

        popup.addEventListener('terra-reposition', () => {
            repositionCount++
        })

        // Allow initial positioning to finish before measuring subsequent events.
        await aTimeout(100)
        const initialRepositionCount = repositionCount

        // Remove the active popup from the DOM.
        popup.remove()

        // Allow the asynchronous stop() cleanup to finish.
        await aTimeout(100)

        // Neither a scroll nor a viewport change should trigger popup behavior.
        window.dispatchEvent(new Event('scroll'))
        await setViewport({ width: 1024, height: 768 })
        window.dispatchEvent(new Event('scroll'))

        await aTimeout(100)

        expect(dismissCount).to.equal(0)
        expect(repositionCount).to.equal(initialRepositionCount)
        expect(popup.active).to.equal(true)
        expect((popup as any).anchorScrollHandler).to.equal(undefined)
        expect((popup as any).cleanup).to.equal(undefined)
    })    
})
