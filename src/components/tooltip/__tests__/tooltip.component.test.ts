import { expect, fixture, html, waitUntil } from '@open-wc/testing'
import { setViewport } from '@web/test-runner-commands'
import TerraTooltip from '../tooltip.component.js'
import '../tooltip.js'

describe('<terra-tooltip>', () => {
    it('closes when its anchor scrolls outside the viewport on mobile viewports and can reopen', async () => {
        await setViewport({ width: 390, height: 844 })

        const tooltip = await fixture<TerraTooltip>(html`
            <terra-tooltip trigger="manual">
                <button>Anchor</button>
                <span slot="content">Tooltip content</span>
            </terra-tooltip>
        `)

        const anchor = tooltip.querySelector('button')!
        const popup = tooltip.shadowRoot!.querySelector('terra-popup')!

        // Simulate an anchor above the viewport.
        anchor.getBoundingClientRect = () =>
            new DOMRect(20, -40, 20, 20)

        let hideCount = 0
        tooltip.addEventListener('terra-hide', () => {
            hideCount++
        })

        // Open the tooltip and wait for popup positioning.
        await tooltip.show()

        await waitUntil(
            () => popup.hasAttribute('data-current-placement'),
            'tooltip popup did not finish positioning'
        )

        expect(tooltip.open).to.equal(true)
        expect(popup.active).to.equal(true)

        // Listen for the completed hide lifecycle before triggering dismissal.
        const afterHide = new Promise<void>(resolve => {
            tooltip.addEventListener('terra-after-hide', () => resolve(), {
                once: true,
            })
        })

        // Simulate scrolling while the anchor is outside the viewport.
        window.dispatchEvent(new Event('scroll'))

        // Wait for the hide animation and cleanup to finish.
        await afterHide

        // Verify the tooltip emitted exactly one hide event.
        expect(hideCount).to.equal(1)

        // Verify that the tooltip can be reopened after hiding completes.
        await tooltip.show()

        expect(tooltip.open).to.equal(true)
        expect(popup.active).to.equal(true)    
    })
})