import { expect, fixture, html, elementUpdated } from '@open-wc/testing'
import './button-group.js'
import '../button/button.js'
import { mouseOverElement, mouseOutElement } from '../../test/utils/mouse.js'

describe('<terra-button-group>', () => {
    describe('Basic Rendering', () => {
        it('should render a component', async () => {
            const el = await fixture(html`
                <terra-button-group></terra-button-group>
            `)
            expect(el).to.exist
        })

        it('should render with base part', async () => {
            const el: any = await fixture(html`
                <terra-button-group></terra-button-group>
            `)
            const base = el.shadowRoot?.querySelector('[part~="base"]')
            expect(base).to.exist
        })

        it('should have button-group class', async () => {
            const el: any = await fixture(html`
                <terra-button-group></terra-button-group>
            `)
            const base = el.shadowRoot?.querySelector('[part~="base"]')
            expect(base?.classList.contains('button-group')).to.be.true
        })
    })

    describe('Properties', () => {
        it('should accept label property', async () => {
            const el: any = await fixture(html`
                <terra-button-group label="Alignment"></terra-button-group>
            `)
            expect(el.label).to.equal('Alignment')
        })

        it('should default label to empty string', async () => {
            const el: any = await fixture(html`
                <terra-button-group></terra-button-group>
            `)
            expect(el.label).to.equal('')
        })

        it('should have disableRole property', async () => {
            const el: any = await fixture(html`
                <terra-button-group></terra-button-group>
            `)
            expect(el.disableRole).to.be.false
        })
    })

    describe('Slot Handling', () => {
        it('should handle slot changes', async () => {
            const el: any = await fixture(html`
                <terra-button-group>
                    <terra-button>Button 1</terra-button>
                    <terra-button>Button 2</terra-button>
                    <terra-button>Button 3</terra-button>
                </terra-button-group>
            `)
            await elementUpdated(el)

            const buttons = el.querySelectorAll('terra-button')
            expect(buttons.length).to.equal(3)

            // Check that data attributes are set
            expect(buttons[0].hasAttribute('data-terra-button-group__button')).to.be
                .true
            expect(buttons[0].hasAttribute('data-terra-button-group__button--first'))
                .to.be.true
            expect(buttons[1].hasAttribute('data-terra-button-group__button--inner'))
                .to.be.true
            expect(buttons[2].hasAttribute('data-terra-button-group__button--last'))
                .to.be.true
        })

        it('should mark first button correctly', async () => {
            const el: any = await fixture(html`
                <terra-button-group>
                    <terra-button>First</terra-button>
                    <terra-button>Second</terra-button>
                </terra-button-group>
            `)
            await elementUpdated(el)

            const firstButton = el.querySelector('terra-button')
            expect(firstButton.hasAttribute('data-terra-button-group__button--first'))
                .to.be.true
            expect(firstButton.hasAttribute('data-terra-button-group__button--last'))
                .to.be.false
        })

        it('should mark last button correctly', async () => {
            const el: any = await fixture(html`
                <terra-button-group>
                    <terra-button>First</terra-button>
                    <terra-button>Last</terra-button>
                </terra-button-group>
            `)
            await elementUpdated(el)

            const buttons = el.querySelectorAll('terra-button')
            const lastButton = buttons[buttons.length - 1]
            expect(lastButton.hasAttribute('data-terra-button-group__button--last'))
                .to.be.true
            expect(lastButton.hasAttribute('data-terra-button-group__button--first'))
                .to.be.false
        })

        it('should mark inner buttons correctly', async () => {
            const el: any = await fixture(html`
                <terra-button-group>
                    <terra-button>First</terra-button>
                    <terra-button>Middle</terra-button>
                    <terra-button>Last</terra-button>
                </terra-button-group>
            `)
            await elementUpdated(el)

            const buttons = el.querySelectorAll('terra-button')
            const middleButton = buttons[1]
            expect(
                middleButton.hasAttribute('data-terra-button-group__button--inner')
            ).to.be.true
            expect(
                middleButton.hasAttribute('data-terra-button-group__button--first')
            ).to.be.false
            expect(middleButton.hasAttribute('data-terra-button-group__button--last'))
                .to.be.false
        })

        it('should handle single button', async () => {
            const el: any = await fixture(html`
                <terra-button-group>
                    <terra-button>Only</terra-button>
                </terra-button-group>
            `)
            await elementUpdated(el)

            const button = el.querySelector('terra-button')
            expect(button.hasAttribute('data-terra-button-group__button--first')).to
                .be.true
            expect(button.hasAttribute('data-terra-button-group__button--last')).to.be
                .true
            expect(button.hasAttribute('data-terra-button-group__button--inner')).to
                .be.false
        })

        it('should update when buttons are added', async () => {
            const el: any = await fixture(html`
                <terra-button-group>
                    <terra-button>First</terra-button>
                </terra-button-group>
            `)
            await elementUpdated(el)

            const newButton = document.createElement('terra-button')
            newButton.textContent = 'Second'
            el.appendChild(newButton)
            await elementUpdated(el)

            const buttons = el.querySelectorAll('terra-button')
            expect(buttons.length).to.equal(2)
            expect(buttons[0].hasAttribute('data-terra-button-group__button--first'))
                .to.be.true
            expect(buttons[1].hasAttribute('data-terra-button-group__button--last'))
                .to.be.true
        })
    })

    describe('Focus Handling', () => {
        it('should add focus attribute on focus', async () => {
            const el: any = await fixture(html`
                <terra-button-group>
                    <terra-button>Button</terra-button>
                </terra-button-group>
            `)
            await elementUpdated(el)

            const button = el.querySelector('terra-button')
            const buttonElement = button.shadowRoot?.querySelector('button')

            buttonElement?.focus()
            await elementUpdated(el)

            expect(button.hasAttribute('data-terra-button-group__button--focus')).to
                .be.true
        })

        it('should remove focus attribute on blur', async () => {
            const el: any = await fixture(html`
                <terra-button-group>
                    <terra-button>Button</terra-button>
                </terra-button-group>
            `)
            await elementUpdated(el)

            const button = el.querySelector('terra-button')
            const buttonElement = button.shadowRoot?.querySelector('button')

            buttonElement?.focus()
            await elementUpdated(el)
            expect(button.hasAttribute('data-terra-button-group__button--focus')).to
                .be.true

            buttonElement?.blur()
            await elementUpdated(el)
            expect(button.hasAttribute('data-terra-button-group__button--focus')).to
                .be.false
        })
    })

    describe('Hover Handling', () => {
        it('should add hover attribute on mouseover', async () => {
            const el: any = await fixture(html`
                <terra-button-group>
                    <terra-button>Button</terra-button>
                </terra-button-group>
            `)
            await elementUpdated(el)

            const button = el.querySelector('terra-button')
            const buttonElement = button.shadowRoot!.querySelector('button')

            await mouseOverElement(buttonElement)

            await elementUpdated(el)

            expect(button.hasAttribute('data-terra-button-group__button--hover')).to
                .be.true
        })

        it('should remove hover attribute on mouseout', async () => {
            const el: any = await fixture(html`
                <terra-button-group>
                    <terra-button>Button</terra-button>
                </terra-button-group>
            `)
            await elementUpdated(el)

            const button = el.querySelector('terra-button')
            const buttonElement = button.shadowRoot?.querySelector('button')

            await mouseOverElement(buttonElement)
            await elementUpdated(el)

            expect(button.hasAttribute('data-terra-button-group__button--hover')).to
                .be.true

            await mouseOutElement(buttonElement)
            await elementUpdated(el)

            expect(button.hasAttribute('data-terra-button-group__button--hover')).to
                .be.false
        })
    })

    describe('Accessibility', () => {
        it('should have role="group" by default', async () => {
            const el: any = await fixture(html`
                <terra-button-group></terra-button-group>
            `)
            const base = el.shadowRoot?.querySelector('[part~="base"]')
            expect(base?.getAttribute('role')).to.equal('group')
        })

        it('should have role="presentation" when disableRole is true', async () => {
            const el: any = await fixture(html`
                <terra-button-group></terra-button-group>
            `)
            el.disableRole = true
            await elementUpdated(el)

            const base = el.shadowRoot?.querySelector('[part~="base"]')
            expect(base?.getAttribute('role')).to.equal('presentation')
        })

        it('should have aria-label when label is provided', async () => {
            const el: any = await fixture(html`
                <terra-button-group label="Alignment"></terra-button-group>
            `)
            const base = el.shadowRoot?.querySelector('[part~="base"]')
            expect(base?.getAttribute('aria-label')).to.equal('Alignment')
        })

        it('should not have aria-label when label is empty', async () => {
            const el: any = await fixture(html`
                <terra-button-group></terra-button-group>
            `)
            const base = el.shadowRoot?.querySelector('[part~="base"]')
            expect(base?.hasAttribute('aria-label')).to.be.false
        })
    })

    describe('Button Detection', () => {
        it('should find button when button is direct child', async () => {
            const el: any = await fixture(html`
                <terra-button-group>
                    <terra-button>Button</terra-button>
                </terra-button-group>
            `)
            await elementUpdated(el)

            const button = el.querySelector('terra-button')
            expect(button.hasAttribute('data-terra-button-group__button')).to.be.true
        })

        it('should find button when button is nested', async () => {
            const el: any = await fixture(html`
                <terra-button-group>
                    <div>
                        <terra-button>Nested</terra-button>
                    </div>
                </terra-button-group>
            `)
            await elementUpdated(el)

            const button = el.querySelector('terra-button')
            expect(button.hasAttribute('data-terra-button-group__button')).to.be.true
        })
    })

    describe('Edge Cases', () => {
        it('should handle empty button group', async () => {
            const el: any = await fixture(html`
                <terra-button-group></terra-button-group>
            `)
            await elementUpdated(el)
            expect(el).to.exist
        })

        it('should handle multiple button groups', async () => {
            const el: any = await fixture(html`
                <div>
                    <terra-button-group>
                        <terra-button>Group 1</terra-button>
                    </terra-button-group>
                    <terra-button-group>
                        <terra-button>Group 2</terra-button>
                    </terra-button-group>
                </div>
            `)
            await elementUpdated(el)

            const groups = el.querySelectorAll('terra-button-group')
            expect(groups.length).to.equal(2)

            const buttons = el.querySelectorAll('terra-button')
            buttons.forEach((button: any) => {
                expect(button.hasAttribute('data-terra-button-group__button')).to.be
                    .true
            })
        })
    })
})
