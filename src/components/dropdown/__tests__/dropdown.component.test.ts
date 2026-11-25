import { expect, fixture, html, oneEvent, waitUntil } from '@open-wc/testing'
import { sendKeys } from '@web/test-runner-commands'
import { clickOnElement } from '../../../internal/test.js'
import '../../button/button.js'
import '../../input/input.js'
import '../../menu/menu.js'
import '../../menu-item/menu-item.js'
import '../dropdown.js'
import type TerraButton from '../../button/button.component.js'
import type TerraInput from '../../input/input.component.js'
import type TerraMenu from '../../menu/menu.component.js'
import type TerraDropdown from '../dropdown.component.js'

type ElementWithAriaElements = Element & {
    ariaLabelledByElements?: readonly Element[] | null
}

describe('<terra-dropdown>', () => {
    describe('Accessible trigger attributes', () => {
        it('sets aria-haspopup="menu" and syncs aria-expanded on a slotted <terra-button>', async () => {
            const el = await fixture<TerraDropdown>(html`
                <terra-dropdown>
                    <terra-button slot="trigger" caret>Options</terra-button>
                    <terra-menu>
                        <terra-menu-item value="one">Item 1</terra-menu-item>
                        <terra-menu-item value="two">Item 2</terra-menu-item>
                    </terra-menu>
                </terra-dropdown>
            `)
            const trigger = el.querySelector<TerraButton>('terra-button')!
            await trigger.updateComplete

            await waitUntil(
                () => trigger.button.getAttribute('aria-expanded') === 'false'
            )
            expect(trigger.button.getAttribute('aria-haspopup')).to.equal('menu')
            // Ignore pre-existing nested-interactive on <terra-button> (host sets role="button" around shadow <button>)
            await expect(el).to.be.accessible({
                ignoredRules: ['nested-interactive'],
            })

            await el.show()
            expect(trigger.button.getAttribute('aria-expanded')).to.equal('true')
            await expect(el).to.be.accessible({
                ignoredRules: ['nested-interactive'],
            })

            await el.hide()
            expect(trigger.button.getAttribute('aria-expanded')).to.equal('false')
        })

        it('sets aria-haspopup="menu" and syncs aria-expanded on a slotted native <button>', async () => {
            const el = await fixture<TerraDropdown>(html`
                <terra-dropdown>
                    <button slot="trigger" type="button">Options</button>
                    <terra-menu>
                        <terra-menu-item>Item 1</terra-menu-item>
                    </terra-menu>
                </terra-dropdown>
            `)
            const button = el.querySelector('button')!

            await waitUntil(() => button.getAttribute('aria-expanded') === 'false')
            expect(button.getAttribute('aria-haspopup')).to.equal('menu')
            await expect(el).to.be.accessible()

            await clickOnElement(button)
            await waitUntil(() => el.open)
            expect(button.getAttribute('aria-expanded')).to.equal('true')

            await clickOnElement(button)
            await waitUntil(() => !el.open)
            expect(button.getAttribute('aria-expanded')).to.equal('false')
        })

        it('resolves the inner tabbable control when the trigger is wrapped in a container', async () => {
            const el = await fixture<TerraDropdown>(html`
                <terra-dropdown>
                    <div slot="trigger">
                        <button type="button">Wrapped Trigger</button>
                    </div>
                    <terra-menu>
                        <terra-menu-item>Item 1</terra-menu-item>
                    </terra-menu>
                </terra-dropdown>
            `)
            const wrapper = el.querySelector('div[slot="trigger"]')!
            const button = wrapper.querySelector('button')!

            await waitUntil(() => button.getAttribute('aria-expanded') === 'false')
            expect(button.getAttribute('aria-haspopup')).to.equal('menu')
            expect(wrapper.hasAttribute('aria-haspopup')).to.be.false
            expect(wrapper.hasAttribute('aria-expanded')).to.be.false
        })

        it('targets the internal <input> for a slotted <terra-input>', async () => {
            const el = await fixture<TerraDropdown>(html`
                <terra-dropdown>
                    <terra-input slot="trigger" label="Start Date"></terra-input>
                    <div>Calendar content</div>
                </terra-dropdown>
            `)
            const inputHost = el.querySelector<TerraInput>('terra-input')!
            await inputHost.updateComplete

            await waitUntil(
                () => inputHost.input.getAttribute('aria-expanded') === 'false'
            )
            expect(inputHost.input.hasAttribute('aria-haspopup')).to.be.false

            await el.show()
            expect(inputHost.input.getAttribute('aria-expanded')).to.equal('true')
        })

        it('omits aria-haspopup="menu" for non-menu disclosure panels and preserves custom aria-haspopup', async () => {
            const el = await fixture<TerraDropdown>(html`
                <terra-dropdown>
                    <button slot="trigger" type="button">Filter</button>
                    <div>Custom filter form</div>
                </terra-dropdown>
            `)
            const button = el.querySelector('button')!

            await waitUntil(() => button.getAttribute('aria-expanded') === 'false')
            expect(button.hasAttribute('aria-haspopup')).to.be.false
            await expect(el).to.be.accessible()

            const custom = await fixture<TerraDropdown>(html`
                <terra-dropdown>
                    <button slot="trigger" type="button" aria-haspopup="dialog">
                        Open Dialog Panel
                    </button>
                    <div>Dialog-like panel</div>
                </terra-dropdown>
            `)
            const customBtn = custom.querySelector('button')!
            await waitUntil(() => customBtn.getAttribute('aria-expanded') === 'false')
            expect(customBtn.getAttribute('aria-haspopup')).to.equal('dialog')
        })

        it('updates aria-haspopup when a <terra-menu> is dynamically slotted or removed', async () => {
            const el = await fixture<TerraDropdown>(html`
                <terra-dropdown>
                    <button slot="trigger" type="button">Dynamic Panel</button>
                </terra-dropdown>
            `)
            const button = el.querySelector('button')!

            await waitUntil(() => button.getAttribute('aria-expanded') === 'false')
            expect(button.hasAttribute('aria-haspopup')).to.be.false

            const menu = document.createElement('terra-menu') as TerraMenu
            menu.innerHTML = '<terra-menu-item>Action</terra-menu-item>'
            el.appendChild(menu)

            await waitUntil(() => button.getAttribute('aria-haspopup') === 'menu')

            menu.remove()
            await waitUntil(() => !button.hasAttribute('aria-haspopup'))
        })

        it('cleans up ARIA attributes when the trigger slot changes or the dropdown disconnects', async () => {
            const el = await fixture<TerraDropdown>(html`
                <terra-dropdown>
                    <button slot="trigger" type="button">First</button>
                    <terra-menu>
                        <terra-menu-item>Item 1</terra-menu-item>
                    </terra-menu>
                </terra-dropdown>
            `)
            const first = el.querySelector('button')!
            await waitUntil(() => first.getAttribute('aria-expanded') === 'false')
            expect(first.getAttribute('aria-haspopup')).to.equal('menu')

            const second = document.createElement('button')
            second.type = 'button'
            second.slot = 'trigger'
            second.textContent = 'Second'
            first.replaceWith(second)

            await waitUntil(() => second.getAttribute('aria-expanded') === 'false')
            expect(second.getAttribute('aria-haspopup')).to.equal('menu')
            expect(first.hasAttribute('aria-expanded')).to.be.false
            expect(first.hasAttribute('aria-haspopup')).to.be.false

            el.remove()
            expect(second.hasAttribute('aria-expanded')).to.be.false
            expect(second.hasAttribute('aria-haspopup')).to.be.false
        })

        it('updates aria-expanded synchronously before terra-show and terra-hide fire', async () => {
            const el = await fixture<TerraDropdown>(html`
                <terra-dropdown>
                    <terra-button slot="trigger">Options</terra-button>
                    <terra-menu>
                        <terra-menu-item>Item 1</terra-menu-item>
                    </terra-menu>
                </terra-dropdown>
            `)
            const trigger = el.querySelector<TerraButton>('terra-button')!
            await trigger.updateComplete
            await waitUntil(
                () => trigger.button.getAttribute('aria-expanded') === 'false'
            )

            let expandedOnShow: string | null = null
            let expandedOnHide: string | null = null
            el.addEventListener('terra-show', () => {
                expandedOnShow = trigger.button.getAttribute('aria-expanded')
            })
            el.addEventListener('terra-hide', () => {
                expandedOnHide = trigger.button.getAttribute('aria-expanded')
            })

            await el.show()
            expect(expandedOnShow).to.equal('true')

            await el.hide()
            expect(expandedOnHide).to.equal('false')
        })

        it('restores ARIA attributes when disconnected and reconnected to the DOM', async () => {
            const container = await fixture<HTMLDivElement>(html`
                <div>
                    <terra-dropdown>
                        <button slot="trigger" type="button">Options</button>
                        <terra-menu>
                            <terra-menu-item>Item 1</terra-menu-item>
                        </terra-menu>
                    </terra-dropdown>
                </div>
            `)
            const el = container.querySelector<TerraDropdown>('terra-dropdown')!
            const button = el.querySelector('button')!

            await waitUntil(() => button.getAttribute('aria-expanded') === 'false')
            expect(button.getAttribute('aria-haspopup')).to.equal('menu')

            el.remove()
            expect(button.hasAttribute('aria-expanded')).to.be.false
            expect(button.hasAttribute('aria-haspopup')).to.be.false

            container.appendChild(el)
            await waitUntil(() => button.getAttribute('aria-expanded') === 'false')
            expect(button.getAttribute('aria-haspopup')).to.equal('menu')
        })

        it('resolves a wrapped <terra-button> trigger after it renders', async () => {
            const el = await fixture<TerraDropdown>(html`
                <terra-dropdown>
                    <div slot="trigger">
                        <terra-button>Wrapped Terra Button</terra-button>
                    </div>
                    <terra-menu>
                        <terra-menu-item>Item 1</terra-menu-item>
                    </terra-menu>
                </terra-dropdown>
            `)
            const wrapper = el.querySelector('div[slot="trigger"]')!
            const trigger = wrapper.querySelector<TerraButton>('terra-button')!
            await trigger.updateComplete

            await waitUntil(
                () => trigger.button.getAttribute('aria-expanded') === 'false'
            )
            expect(trigger.button.getAttribute('aria-haspopup')).to.equal('menu')
            expect(wrapper.hasAttribute('aria-expanded')).to.be.false
        })

        it('keeps a disabled native <button> trigger as the target even with a focusable child', async () => {
            const el = await fixture<TerraDropdown>(html`
                <terra-dropdown>
                    <button slot="trigger" type="button" disabled>
                        Filter
                        <span tabindex="0">Clear</span>
                    </button>
                    <terra-menu>
                        <terra-menu-item>Item 1</terra-menu-item>
                    </terra-menu>
                </terra-dropdown>
            `)
            const outerButton = el.querySelector('button')!
            const innerFocusable = outerButton.querySelector('span')!

            await waitUntil(
                () => outerButton.getAttribute('aria-expanded') === 'false'
            )
            expect(outerButton.getAttribute('aria-haspopup')).to.equal('menu')
            expect(innerFocusable.hasAttribute('aria-expanded')).to.be.false
            expect(innerFocusable.hasAttribute('aria-haspopup')).to.be.false
        })

        it('links unlabeled <terra-menu> via ariaLabelledByElements, updates on swap, and cleans up on disconnect', async () => {
            if (!('ariaLabelledByElements' in Element.prototype)) {
                return
            }

            const buttonDropdown = await fixture<TerraDropdown>(html`
                <terra-dropdown>
                    <terra-button slot="trigger">Options</terra-button>
                    <terra-menu>
                        <terra-menu-item>Item 1</terra-menu-item>
                    </terra-menu>
                </terra-dropdown>
            `)
            const terraButton =
                buttonDropdown.querySelector<TerraButton>('terra-button')!
            const buttonMenu = buttonDropdown.querySelector<
                TerraMenu & ElementWithAriaElements
            >('terra-menu')!
            await terraButton.updateComplete
            await waitUntil(
                () => buttonMenu.ariaLabelledByElements?.[0] === terraButton
            )

            const wrappedDropdown = await fixture<TerraDropdown>(html`
                <terra-dropdown>
                    <div slot="trigger">
                        <button type="button">Wrapped</button>
                        <span>badge</span>
                    </div>
                    <terra-menu>
                        <terra-menu-item>Item 1</terra-menu-item>
                    </terra-menu>
                </terra-dropdown>
            `)
            const wrapper = wrappedDropdown.querySelector('div[slot="trigger"]')!
            const innerButton = wrapper.querySelector('button')!
            const wrappedMenu = wrappedDropdown.querySelector<
                TerraMenu & ElementWithAriaElements
            >('terra-menu')!
            await waitUntil(
                () => wrappedMenu.ariaLabelledByElements?.[0] === innerButton
            )

            const replacement = document.createElement('button')
            replacement.type = 'button'
            replacement.slot = 'trigger'
            replacement.textContent = 'Replacement'
            wrapper.replaceWith(replacement)

            await waitUntil(
                () => replacement.getAttribute('aria-expanded') === 'false'
            )
            expect(wrappedMenu.ariaLabelledByElements).to.deep.equal([replacement])

            wrappedDropdown.remove()
            expect(wrappedMenu.ariaLabelledByElements).to.be.null
        })

        it('preserves consumer-provided aria-label and ariaLabelledByElements on <terra-menu>', async () => {
            if (!('ariaLabelledByElements' in Element.prototype)) {
                return
            }

            const labeledDropdown = await fixture<TerraDropdown>(html`
                <terra-dropdown>
                    <button slot="trigger" type="button">Options</button>
                    <terra-menu aria-label="Custom Actions">
                        <terra-menu-item>Item 1</terra-menu-item>
                    </terra-menu>
                </terra-dropdown>
            `)
            const labeledButton = labeledDropdown.querySelector('button')!
            const labeledMenu = labeledDropdown.querySelector<
                TerraMenu & ElementWithAriaElements
            >('terra-menu')!
            await waitUntil(
                () => labeledButton.getAttribute('aria-expanded') === 'false'
            )
            expect(labeledMenu.ariaLabelledByElements).to.be.null

            const customLabel = document.createElement('span')
            customLabel.textContent = 'External Heading'
            const jsLabeledDropdown = await fixture<TerraDropdown>(html`
                <div>
                    ${customLabel}
                    <terra-dropdown>
                        <button slot="trigger" type="button">Options</button>
                        <terra-menu .ariaLabelledByElements=${[customLabel]}>
                            <terra-menu-item>Item 1</terra-menu-item>
                        </terra-menu>
                    </terra-dropdown>
                </div>
            `)
            const jsButton = jsLabeledDropdown.querySelector('button')!
            const jsMenu = jsLabeledDropdown.querySelector<
                TerraMenu & ElementWithAriaElements
            >('terra-menu')!
            await waitUntil(() => jsButton.getAttribute('aria-expanded') === 'false')
            expect(jsMenu.ariaLabelledByElements).to.deep.equal([customLabel])
        })
    })

    describe('Interactions and events', () => {
        it('emits show/after-show and hide/after-hide events around show() and hide()', async () => {
            const el = await fixture<TerraDropdown>(html`
                <terra-dropdown>
                    <terra-button slot="trigger">Actions</terra-button>
                    <terra-menu>
                        <terra-menu-item>Edit</terra-menu-item>
                    </terra-menu>
                </terra-dropdown>
            `)

            const showPromise = oneEvent(el, 'terra-show')
            const afterShowPromise = oneEvent(el, 'terra-after-show')
            await el.show()
            await showPromise
            await afterShowPromise
            expect(el.open).to.be.true

            const hidePromise = oneEvent(el, 'terra-hide')
            const afterHidePromise = oneEvent(el, 'terra-after-hide')
            await el.hide()
            await hidePromise
            await afterHidePromise
            expect(el.open).to.be.false
        })

        it('opens on ArrowDown, focuses the first menu item, and closes on Escape', async () => {
            const el = await fixture<TerraDropdown>(html`
                <terra-dropdown>
                    <terra-button slot="trigger">Actions</terra-button>
                    <terra-menu>
                        <terra-menu-item value="edit">Edit</terra-menu-item>
                        <terra-menu-item value="delete">Delete</terra-menu-item>
                    </terra-menu>
                </terra-dropdown>
            `)
            const trigger = el.querySelector<TerraButton>('terra-button')!
            const firstItem = el.querySelector('terra-menu-item')!
            await trigger.updateComplete

            trigger.button.focus()
            await sendKeys({ press: 'ArrowDown' })

            await waitUntil(() => el.open)
            await waitUntil(() => document.activeElement === firstItem)
            expect(trigger.button.getAttribute('aria-expanded')).to.equal('true')

            await sendKeys({ press: 'Escape' })
            await waitUntil(() => !el.open)
            expect(trigger.button.getAttribute('aria-expanded')).to.equal('false')
        })

        it('returns focus to the inner control for a wrapped trigger on Escape', async () => {
            const el = await fixture<TerraDropdown>(html`
                <terra-dropdown>
                    <div slot="trigger">
                        <button type="button">Wrapped Actions</button>
                    </div>
                    <terra-menu>
                        <terra-menu-item value="edit">Edit</terra-menu-item>
                    </terra-menu>
                </terra-dropdown>
            `)
            const button = el.querySelector('button')!
            const firstItem = el.querySelector('terra-menu-item')!
            await waitUntil(() => button.getAttribute('aria-expanded') === 'false')

            button.focus()
            await sendKeys({ press: 'ArrowDown' })
            await waitUntil(() => el.open && document.activeElement === firstItem)

            await sendKeys({ press: 'Escape' })
            await waitUntil(() => !el.open)
            expect(document.activeElement).to.equal(button)
        })

        it('closes on menu item selection unless stay-open-on-select is set', async () => {
            const el = await fixture<TerraDropdown>(html`
                <terra-dropdown>
                    <terra-button slot="trigger">Actions</terra-button>
                    <terra-menu>
                        <terra-menu-item value="edit">Edit</terra-menu-item>
                    </terra-menu>
                </terra-dropdown>
            `)
            const item = el.querySelector('terra-menu-item')!

            await el.show()
            const afterHidePromise = oneEvent(el, 'terra-after-hide')
            await clickOnElement(item)
            await afterHidePromise
            expect(el.open).to.be.false

            el.stayOpenOnSelect = true
            await el.show()
            await clickOnElement(item)
            expect(el.open).to.be.true
        })

        it('prevents opening when disabled', async () => {
            const el = await fixture<TerraDropdown>(html`
                <terra-dropdown disabled>
                    <terra-button slot="trigger" disabled>Disabled</terra-button>
                    <terra-menu>
                        <terra-menu-item>Edit</terra-menu-item>
                    </terra-menu>
                </terra-dropdown>
            `)

            el.open = true
            await el.updateComplete
            expect(el.open).to.be.false
        })
    })
})
