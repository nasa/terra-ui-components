import { aTimeout, expect, fixture, html, waitUntil } from '@open-wc/testing'
import sinon from 'sinon'
import '../variable-combobox.js'
import { setViewport } from '@web/test-runner-commands'

function okJson(body: unknown) {
    return Promise.resolve(
        new Response(JSON.stringify(body), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        })
    )
}

describe('<terra-variable-combobox>', () => {
    beforeEach(() => {
        sinon.stub(globalThis, 'fetch').callsFake(() =>
            okJson({
                response: {
                    docs: [
                        {
                            'Collection.ShortName': 'B',
                            'Collection.Version': '01',
                            'Variable.LongName': 'B Long Name',
                            'Variable.Name': 'B',
                            'Variable.Id': 'B_id',
                            'Variable.Units': 'u',
                        },
                        {
                            'Collection.ShortName': 'C',
                            'Collection.Version': '01',
                            'Variable.LongName': 'D Long Name',
                            'Variable.Name': 'D',
                            'Variable.Id': 'D_id',
                            'Variable.Units': 'u',
                        },
                        {
                            'Collection.ShortName': 'A',
                            'Collection.Version': '01',
                            'Variable.LongName': 'A Long Name',
                            'Variable.Name': 'A',
                            'Variable.Id': 'A_id',
                            'Variable.Units': 'u',
                        },
                        {
                            'Collection.ShortName': 'C',
                            'Collection.Version': '01',
                            'Variable.LongName': 'C Long Name',
                            'Variable.Name': 'C',
                            'Variable.Id': 'C_id',
                            'Variable.Units': 'u',
                        },
                    ],
                },
            })
        )
    })

    afterEach(() => {
        sinon.restore()
    })

    it('renders', async () => {
        const el = await fixture(
            html`<terra-variable-combobox></terra-variable-combobox>`
        )
        expect(el).to.exist
    })

    it('sorts variables alphabetically by short name then long name', async () => {
        const el: any = await fixture(
            html`<terra-variable-combobox></terra-variable-combobox>`
        )

        await waitUntil(
            () =>
                (el.shadowRoot?.querySelectorAll('.listbox-option')?.length ?? 0) > 0,
            'variables did not load in time',
            { timeout: 3000 }
        )

        const options = [...el.shadowRoot.querySelectorAll('.listbox-option')]

        expect(options.map(o => o.dataset.name)).to.deep.equal(['A', 'B', 'C', 'D'])
    })

    it('shows the variable long name as the selected tag', async () => {
        const el: any = await fixture(
            html`<terra-variable-combobox
                use-tags
                value="A_id"
            ></terra-variable-combobox>`
        )

        await waitUntil(
            () => (el.shadowRoot?.querySelectorAll('.tag')?.length ?? 0) > 0,
            'variables did not load in time',
            { timeout: 3000 }
        )

        // make sure the default tag is using the variable long name
        expect(
            [...el.shadowRoot.querySelectorAll('.tag')].map(o =>
                o.textContent?.trim()
            )
        ).to.deep.equal(['A Long Name'])

        // get the option for the variable "D" and click it
        const dOption = el.shadowRoot?.querySelector('li[data-name="D"]')
        dOption?.click()

        await aTimeout(200)

        expect(
            [...el.shadowRoot.querySelectorAll('.tag')].map(o =>
                o.textContent?.trim()
            )
        ).to.deep.equal(['D Long Name'])
    })

    it('closes the variable info popup when its anchor scrolls outside the viewport on mobile and can reopen', async () => {
        await setViewport({ width: 390, height: 844 })

        const el: any = await fixture(
            html`<terra-variable-combobox></terra-variable-combobox>`
        )

        // Mobile popups use the info icon as their anchor.
        const anchor = document.createElement('span')
        document.body.appendChild(anchor)

        let anchorRect = new DOMRect(20, 100, 20, 20)
        anchor.getBoundingClientRect = () => anchorRect

        const variableInfo = {
            dataFieldLongName: 'Air Temperature',
            dataFieldShortName: 'Temperature',
            dataFieldUnits: 'K',
            dataProductDescriptionUrl: '#',
            dataProductLongName: 'Test Dataset',
            dataFieldDescriptionUrl: '#',
        }

        const showVariableInfo = () => {
            el.dispatchEvent(
                new CustomEvent('terra-show-variable-info', {
                    detail: {
                        collection: variableInfo,
                        anchor,
                    },
                })
            )
        }

        showVariableInfo()

        await waitUntil(
            () => el.shadowRoot?.querySelector('terra-popup')?.active === true,
            'variable info popup did not open'
        )

        const popup = el.shadowRoot!.querySelector('terra-popup')!

        await waitUntil(
            () => popup.hasAttribute('data-current-placement'),
            'variable info popup did not finish positioning'
        )

        expect(el.menuOpen).to.equal(true)
        expect(popup.active).to.equal(true)

        // Move the anchor completely outside the viewport.
        anchorRect = new DOMRect(20, -40, 20, 20)
        window.dispatchEvent(new Event('scroll'))

        await waitUntil(
            () => el.menuOpen === false && popup.active === false,
            'variable info popup did not close after its anchor scrolled out of view'
        )

        // Move the anchor back into view and reopen the popup.
        anchorRect = new DOMRect(20, 100, 20, 20)
        showVariableInfo()

        await waitUntil(
            () => el.menuOpen === true && popup.active === true,
            'variable info popup did not reopen'
        )

        anchor.remove()
    })

    it('toggles the variable info popup when the info icon is tapped on mobile', async () => {
        await setViewport({ width: 390, height: 844 })

        const el: any = await fixture(
            html`<terra-variable-combobox></terra-variable-combobox>`
        )

        await waitUntil(
            () => (el.shadowRoot?.querySelectorAll('.info-icon')?.length ?? 0) > 0,
            'variable info icons did not render'
        )

        const infoIcon = el.shadowRoot!.querySelector('.info-icon') as HTMLElement

        infoIcon.click()

        await waitUntil(
            () => el.menuOpen === true,
            'variable info popup did not open after tapping the info icon'
        )

        expect(el.shadowRoot.querySelector('terra-popup')?.active).to.equal(true)

        infoIcon.click()

        await waitUntil(
            () => el.menuOpen === false,
            'variable info popup did not close after tapping the same info icon'
        )

        expect(el.shadowRoot.querySelector('terra-popup')?.active).to.equal(false)
    })

    it('keeps the variable info popup open when tapped inside and closes it when tapped outside on mobile', async () => {
        await setViewport({ width: 390, height: 844 })

        const el: any = await fixture(
            html`<terra-variable-combobox></terra-variable-combobox>`
        )

        await waitUntil(
            () => (el.shadowRoot?.querySelectorAll('.info-icon')?.length ?? 0) > 0,
            'variable info icons did not render'
        )

        const infoIcon = el.shadowRoot!.querySelector('.info-icon') as HTMLElement

        infoIcon.click()

        await waitUntil(
            () => el.menuOpen === true,
            'variable info popup did not open'
        )

        const popup = el.shadowRoot!.querySelector('terra-popup')!
        const popupContent = popup.querySelector(
            '.variable-info-popup'
        ) as HTMLElement

        expect(popupContent).to.exist

        popupContent.dispatchEvent(
            new MouseEvent('click', { bubbles: true, composed: true })
        )

        expect(el.menuOpen).to.equal(true)
        expect(popup.active).to.equal(true)

        document.body.dispatchEvent(
            new MouseEvent('click', { bubbles: true, composed: true })
        )

        await waitUntil(
            () => el.menuOpen === false,
            'variable info popup did not close after tapping outside'
        )

        expect(popup.active).to.equal(false)
    })

    it('opens the variable info popup with Enter and closes it with Escape', async () => {
        await setViewport({ width: 1024, height: 844 })

        const el: any = await fixture(
            html`<terra-variable-combobox></terra-variable-combobox>`
        )

        await waitUntil(
            () => el.shadowRoot!.querySelector('.info-icon'),
            'info icon was not rendered'
        )

        const infoIcon = el.shadowRoot!.querySelector('.info-icon')!

        infoIcon.dispatchEvent(
            new KeyboardEvent('keydown', {
                key: 'Enter',
                bubbles: true,
                composed: true,
                cancelable: true,
            })
        )

        await waitUntil(
            () => el.menuOpen,
            'variable info popup did not open with Enter'
        )

        expect(el.shadowRoot!.querySelector('terra-popup')!.active).to.equal(true)

        // Close the popup with Escape.
        el.dispatchEvent(
            new KeyboardEvent('keydown', {
                key: 'Escape',
                bubbles: true,
                composed: true,
                cancelable: true,
            })
        )

        // Verify the popup closed.
        expect(el.menuOpen).to.equal(false)
    })

    it('closes the variable info popup when crossing the mobile breakpoint and reopens with the correct anchor', async () => {
        await setViewport({ width: 1024, height: 844 })

        const el: any = await fixture(
            html`<terra-variable-combobox></terra-variable-combobox>`
        )

        const getPopup = () => el.shadowRoot!.querySelector('terra-popup')

        const anchor = document.createElement('span')
        document.body.appendChild(anchor)

        const variableInfo = {
            dataFieldLongName: 'Air Temperature',
            dataFieldShortName: 'Temperature',
            dataFieldUnits: 'K',
            dataProductDescriptionUrl: '#',
            dataProductLongName: 'Test Dataset',
            dataFieldDescriptionUrl: '#',
        }

        const showVariableInfo = () => {
            el.dispatchEvent(
                new CustomEvent('terra-show-variable-info', {
                    detail: {
                        collection: variableInfo,
                        anchor,
                    },
                })
            )
        }

        // Open on desktop and verify the combobox is the anchor.
        showVariableInfo()

        await waitUntil(
            () => el.menuOpen && getPopup()?.active,
            'variable info popup did not open on desktop'
        )

        expect(getPopup()!.anchor).to.equal(el)

        // Switch to mobile. The popup should close.
        await setViewport({ width: 390, height: 844 })

        await waitUntil(
            () => el.isMobile && !el.menuOpen && !getPopup()?.active,
            'variable info popup did not close when switching to mobile'
        )

        // Reopen and verify the information icon is now the anchor.
        showVariableInfo()

        await waitUntil(
            () => el.menuOpen && getPopup()?.active && getPopup()!.anchor === anchor,
            'variable info popup did not reopen with the information icon as its anchor'
        )

        // Switch back to desktop. The popup should close again.
        await setViewport({ width: 1024, height: 844 })

        await waitUntil(
            () => !el.isMobile && !el.menuOpen && !getPopup()?.active,
            'variable info popup did not close when switching to desktop'
        )

        // Reopen and verify the combobox is once again the anchor.
        showVariableInfo()

        await waitUntil(
            () => el.menuOpen && getPopup()?.active && getPopup()?.anchor === el,
            'variable info popup did not reopen with the combobox as its anchor'
        )

        anchor.remove()
    })
})
