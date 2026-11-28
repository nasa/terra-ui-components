import { expect, fixture, html, waitUntil } from '@open-wc/testing'
import { setViewport } from '@web/test-runner-commands'
import TerraDropdown from '../dropdown.component.js'
import '../dropdown.js'

describe('<terra-dropdown>', () => {
    it('closes when its trigger scrolls outside the viewport on mobile and can reopen', async () => {
        await setViewport({ width: 390, height: 844 })

        const dropdown = await fixture<TerraDropdown>(html`
            <terra-dropdown>
                <button slot="trigger">Open</button>
                <div>Dropdown content</div>
            </terra-dropdown>
        `)

        const trigger = dropdown.querySelector<HTMLButtonElement>('[slot="trigger"]')!
        const popup = dropdown.shadowRoot!.querySelector('terra-popup')!

        trigger.getBoundingClientRect = () => new DOMRect(20, -40, 20, 20)

        let hideCount = 0
        dropdown.addEventListener('terra-hide', () => {
            hideCount++
        })

        await dropdown.show()

        await waitUntil(
            () => popup.hasAttribute('data-current-placement'),
            'dropdown popup did not finish positioning'
        )

        expect(dropdown.open).to.equal(true)
        expect(popup.active).to.equal(true)

        const afterHide = new Promise<void>(resolve => {
            dropdown.addEventListener('terra-after-hide', () => resolve(), {
                once: true,
            })
        })

        window.dispatchEvent(new Event('scroll'))

        await afterHide

        expect(dropdown.open).to.equal(false)
        expect(hideCount).to.equal(1)
        expect(popup.active).to.equal(false)

        await dropdown.show()

        expect(dropdown.open).to.equal(true)
        expect(popup.active).to.equal(true)
    })
})
