import { expect, fixture, html, waitUntil } from '@open-wc/testing'
import { setViewport } from '@web/test-runner-commands'
import TerraSelect from '../select.component.js'

import '../select.js'

describe('<terra-select>', () => {
    it('closes when its anchor scrolls outside the viewport on mobile and can reopen', async () => {
        await setViewport({ width: 390, height: 844 })

        const select = await fixture<TerraSelect>(html`
            <terra-select>
                <terra-option value="one">Option One</terra-option>
                <terra-option value="two">Option Two</terra-option>
            </terra-select>
        `)

        const popup = select.shadowRoot!.querySelector('terra-popup')!
        const combobox = select.shadowRoot!.querySelector(
            '.select__combobox'
        ) as HTMLElement

        combobox.getBoundingClientRect = () =>
            new DOMRect(20, -40, 200, 40)

        let hideCount = 0
        select.addEventListener('terra-hide', () => {
            hideCount++
        })

        await select.show()

        await waitUntil(
            () => popup.hasAttribute('data-current-placement'),
            'select popup did not finish positioning'
        )

        expect(select.open).to.equal(true)
        expect(popup.active).to.equal(true)

        const afterHide = new Promise<void>(resolve => {
            select.addEventListener(
                'terra-after-hide',
                () => resolve(),
                { once: true }
            )
        })

        window.dispatchEvent(new Event('scroll'))

        await afterHide

        expect(select.open).to.equal(false)
        expect(hideCount).to.equal(1)
        expect(popup.active).to.equal(false)

        await select.show()

        expect(select.open).to.equal(true)
        expect(popup.active).to.equal(true)
    })
})