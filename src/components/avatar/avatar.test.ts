import { expect, fixture, html } from '@open-wc/testing'
import { elementUpdated } from '@open-wc/testing-helpers'
import { oneEvent } from '@open-wc/testing-helpers'
import './avatar.js'

describe('<terra-avatar>', () => {
    describe('Basic Rendering', () => {
        it('should render a component', async () => {
            const el = await fixture(html` <terra-avatar></terra-avatar> `)
            expect(el).to.exist
        })

        it('should render default icon when no image or initials', async () => {
            const el: any = await fixture(html` <terra-avatar></terra-avatar> `)
            const icon = el.shadowRoot?.querySelector('[part~="icon"]')
            expect(icon).to.exist
            const terraIcon = icon?.querySelector('terra-icon')
            expect(terraIcon).to.exist
        })
    })

    describe('Properties', () => {
        it('should accept image property', async () => {
            const el: any = await fixture(html`
                <terra-avatar image="https://example.com/avatar.jpg"></terra-avatar>
            `)
            expect(el.image).to.equal('https://example.com/avatar.jpg')
        })

        it('should default image to empty string', async () => {
            const el: any = await fixture(html` <terra-avatar></terra-avatar> `)
            expect(el.image).to.equal('')
        })

        it('should accept label property', async () => {
            const el: any = await fixture(html`
                <terra-avatar label="User avatar"></terra-avatar>
            `)
            expect(el.label).to.equal('User avatar')
        })

        it('should default label to empty string', async () => {
            const el: any = await fixture(html` <terra-avatar></terra-avatar> `)
            expect(el.label).to.equal('')
        })

        it('should accept initials property', async () => {
            const el: any = await fixture(html`
                <terra-avatar initials="JD"></terra-avatar>
            `)
            expect(el.initials).to.equal('JD')
        })

        it('should default initials to empty string', async () => {
            const el: any = await fixture(html` <terra-avatar></terra-avatar> `)
            expect(el.initials).to.equal('')
        })

        it('should accept loading property', async () => {
            const el: any = await fixture(html`
                <terra-avatar loading="lazy"></terra-avatar>
            `)
            expect(el.loading).to.equal('lazy')
        })

        it('should default loading to eager', async () => {
            const el: any = await fixture(html` <terra-avatar></terra-avatar> `)
            expect(el.loading).to.equal('eager')
        })

        it('should accept shape property', async () => {
            const el: any = await fixture(html`
                <terra-avatar shape="square"></terra-avatar>
            `)
            expect(el.shape).to.equal('square')
        })

        it('should reflect shape as attribute', async () => {
            const el: any = await fixture(html`
                <terra-avatar shape="rounded"></terra-avatar>
            `)
            expect(el.getAttribute('shape')).to.equal('rounded')
        })

        it('should default shape to circle', async () => {
            const el: any = await fixture(html` <terra-avatar></terra-avatar> `)
            expect(el.shape).to.equal('circle')
        })

        it('should accept all shape values', async () => {
            const shapes = ['circle', 'square', 'rounded']
            for (const shape of shapes) {
                const el: any = await fixture(html`
                    <terra-avatar shape=${shape}></terra-avatar>
                `)
                expect(el.shape).to.equal(shape)
            }
        })
    })

    describe('Image Display', () => {
        it('should show image when image property is set', async () => {
            const el: any = await fixture(html`
                <terra-avatar image="https://example.com/avatar.jpg"></terra-avatar>
            `)
            const image = el.shadowRoot?.querySelector('[part~="image"]')
            expect(image).to.exist
            expect(image?.tagName).to.equal('IMG')
            expect(image?.src).to.include('example.com/avatar.jpg')
        })

        it('should hide image when image property is empty', async () => {
            const el: any = await fixture(html` <terra-avatar></terra-avatar> `)
            const image = el.shadowRoot?.querySelector('[part~="image"]')
            expect(image).to.not.exist
        })

        it('should set loading attribute on image', async () => {
            const el: any = await fixture(html`
                <terra-avatar
                    image="https://example.com/avatar.jpg"
                    loading="lazy"
                ></terra-avatar>
            `)
            const image = el.shadowRoot?.querySelector('[part~="image"]')
            expect(image?.getAttribute('loading')).to.equal('lazy')
        })

        it('should set alt attribute to empty string on image', async () => {
            const el: any = await fixture(html`
                <terra-avatar image="https://example.com/avatar.jpg"></terra-avatar>
            `)
            const image = el.shadowRoot?.querySelector('[part~="image"]')
            expect(image?.getAttribute('alt')).to.equal('')
        })
    })

    describe('Initials Display', () => {
        it('should show initials when initials property is set and no image', async () => {
            const el: any = await fixture(html`
                <terra-avatar initials="JD"></terra-avatar>
            `)
            const initials = el.shadowRoot?.querySelector('[part~="initials"]')
            expect(initials).to.exist
            expect(initials?.textContent?.trim()).to.equal('JD')
        })

        it('should hide initials when image is set', async () => {
            const el: any = await fixture(html`
                <terra-avatar
                    image="https://example.com/avatar.jpg"
                    initials="JD"
                ></terra-avatar>
            `)
            const initials = el.shadowRoot?.querySelector('[part~="initials"]')
            expect(initials).to.not.exist
        })

        it('should show initials when image fails to load', async () => {
            const el: any = await fixture(html`
                <terra-avatar
                    image="https://invalid-url-that-will-fail.com/image.jpg"
                    initials="JD"
                ></terra-avatar>
            `)
            await elementUpdated(el)

            // Trigger image error
            const image = el.shadowRoot?.querySelector('[part~="image"]')
            if (image) {
                image.dispatchEvent(new Event('error'))
                await elementUpdated(el)

                // Should show initials after image error
                const initials = el.shadowRoot?.querySelector('[part~="initials"]')
                expect(initials).to.exist
                expect(initials?.textContent?.trim()).to.equal('JD')
            }
        })
    })

    describe('Icon Display', () => {
        it('should show default icon when no image or initials', async () => {
            const el: any = await fixture(html` <terra-avatar></terra-avatar> `)
            const icon = el.shadowRoot?.querySelector('[part~="icon"]')
            expect(icon).to.exist
            const terraIcon = icon?.querySelector('terra-icon')
            expect(terraIcon).to.exist
            expect(terraIcon?.name).to.equal('solid-user')
        })

        it('should hide icon when image is set', async () => {
            const el: any = await fixture(html`
                <terra-avatar image="https://example.com/avatar.jpg"></terra-avatar>
            `)
            const icon = el.shadowRoot?.querySelector('[part~="icon"]')
            expect(icon).to.not.exist
        })

        it('should hide icon when initials are set', async () => {
            const el: any = await fixture(html`
                <terra-avatar initials="JD"></terra-avatar>
            `)
            const icon = el.shadowRoot?.querySelector('[part~="icon"]')
            expect(icon).to.not.exist
        })
    })

    describe('Slots', () => {
        it('should render custom icon in icon slot', async () => {
            const el: any = await fixture(html`
                <terra-avatar>
                    <span slot="icon">Custom Icon</span>
                </terra-avatar>
            `)
            const iconSlot = el.querySelector('span[slot="icon"]')
            expect(iconSlot).to.exist
            expect(iconSlot?.textContent).to.equal('Custom Icon')

            // Check that the slot element exists in shadow DOM
            const iconContainer = el.shadowRoot?.querySelector('[part~="icon"]')
            expect(iconContainer).to.exist
            const slotElement = iconContainer?.querySelector('slot[name="icon"]')
            expect(slotElement).to.exist

            // Check assigned nodes
            const assignedNodes = slotElement?.assignedNodes()
            expect(assignedNodes?.length).to.be.greaterThan(0)
        })

        it('should use default icon when icon slot is not provided', async () => {
            const el: any = await fixture(html` <terra-avatar></terra-avatar> `)
            const iconContainer = el.shadowRoot?.querySelector('[part~="icon"]')
            const terraIcon = iconContainer?.querySelector('terra-icon')
            expect(terraIcon).to.exist
        })
    })

    describe('Priority (Image > Initials > Icon)', () => {
        it('should show image when image, initials, and icon are all provided', async () => {
            const el: any = await fixture(html`
                <terra-avatar image="https://example.com/avatar.jpg" initials="JD">
                    <span slot="icon">Icon</span>
                </terra-avatar>
            `)
            const image = el.shadowRoot?.querySelector('[part~="image"]')
            const initials = el.shadowRoot?.querySelector('[part~="initials"]')
            const icon = el.shadowRoot?.querySelector('[part~="icon"]')

            expect(image).to.exist
            expect(initials).to.not.exist
            expect(icon).to.not.exist
        })

        it('should show initials when initials and icon are provided but no image', async () => {
            const el: any = await fixture(html`
                <terra-avatar initials="JD">
                    <span slot="icon">Icon</span>
                </terra-avatar>
            `)
            const image = el.shadowRoot?.querySelector('[part~="image"]')
            const initials = el.shadowRoot?.querySelector('[part~="initials"]')
            const icon = el.shadowRoot?.querySelector('[part~="icon"]')

            expect(image).to.not.exist
            expect(initials).to.exist
            expect(icon).to.not.exist
        })

        it('should show icon when only icon is provided', async () => {
            const el: any = await fixture(html`
                <terra-avatar>
                    <span slot="icon">Icon</span>
                </terra-avatar>
            `)
            const image = el.shadowRoot?.querySelector('[part~="image"]')
            const initials = el.shadowRoot?.querySelector('[part~="initials"]')
            const icon = el.shadowRoot?.querySelector('[part~="icon"]')

            expect(image).to.not.exist
            expect(initials).to.not.exist
            expect(icon).to.exist
        })
    })

    describe('Shapes', () => {
        it('should apply circle shape class by default', async () => {
            const el: any = await fixture(html` <terra-avatar></terra-avatar> `)
            const base = el.shadowRoot?.querySelector('[part~="base"]')
            expect(base?.classList.contains('avatar--circle')).to.be.true
        })

        it('should apply square shape class', async () => {
            const el: any = await fixture(html`
                <terra-avatar shape="square"></terra-avatar>
            `)
            const base = el.shadowRoot?.querySelector('[part~="base"]')
            expect(base?.classList.contains('avatar--square')).to.be.true
        })

        it('should apply rounded shape class', async () => {
            const el: any = await fixture(html`
                <terra-avatar shape="rounded"></terra-avatar>
            `)
            const base = el.shadowRoot?.querySelector('[part~="base"]')
            expect(base?.classList.contains('avatar--rounded')).to.be.true
        })
    })

    describe('Image Error Handling', () => {
        it('should emit terra-error when image fails to load', async () => {
            const el: any = await fixture(html`
                <terra-avatar
                    image="https://invalid-url.com/image.jpg"
                ></terra-avatar>
            `)
            await elementUpdated(el)

            const image = el.shadowRoot?.querySelector('[part~="image"]')
            if (image) {
                const eventPromise = oneEvent(el, 'terra-error')
                image.dispatchEvent(new Event('error'))
                const event = await eventPromise
                expect(event).to.exist
            }
        })

        it('should hide image and show fallback when image fails to load', async () => {
            const el: any = await fixture(html`
                <terra-avatar
                    image="https://invalid-url.com/image.jpg"
                    initials="JD"
                ></terra-avatar>
            `)
            await elementUpdated(el)

            const image = el.shadowRoot?.querySelector('[part~="image"]')
            if (image) {
                image.dispatchEvent(new Event('error'))
                await elementUpdated(el)

                // Image should be hidden
                const imageAfterError =
                    el.shadowRoot?.querySelector('[part~="image"]')
                expect(imageAfterError).to.not.exist

                // Should show initials as fallback
                const initials = el.shadowRoot?.querySelector('[part~="initials"]')
                expect(initials).to.exist
            }
        })

        it('should reset error state when new image is provided', async () => {
            const el: any = await fixture(html`
                <terra-avatar
                    image="https://invalid-url.com/image.jpg"
                ></terra-avatar>
            `)
            await elementUpdated(el)

            // Trigger error
            const image = el.shadowRoot?.querySelector('[part~="image"]')
            if (image) {
                image.dispatchEvent(new Event('error'))
                await elementUpdated(el)

                // Set new image - should reset error
                el.image = 'https://example.com/new-avatar.jpg'
                await elementUpdated(el)

                // Should show image again
                const newImage = el.shadowRoot?.querySelector('[part~="image"]')
                expect(newImage).to.exist
            }
        })
    })

    describe('Accessibility', () => {
        it('should have role="img"', async () => {
            const el: any = await fixture(html` <terra-avatar></terra-avatar> `)
            const base = el.shadowRoot?.querySelector('[part~="base"]')
            expect(base?.getAttribute('role')).to.equal('img')
        })

        it('should have aria-label when label is provided', async () => {
            const el: any = await fixture(html`
                <terra-avatar label="User avatar"></terra-avatar>
            `)
            const base = el.shadowRoot?.querySelector('[part~="base"]')
            expect(base?.getAttribute('aria-label')).to.equal('User avatar')
        })

        it('should have empty aria-label when label is not provided', async () => {
            const el: any = await fixture(html` <terra-avatar></terra-avatar> `)
            const base = el.shadowRoot?.querySelector('[part~="base"]')
            expect(base?.getAttribute('aria-label')).to.equal('')
        })

        it('should have aria-hidden="true" on icon container', async () => {
            const el: any = await fixture(html` <terra-avatar></terra-avatar> `)
            const icon = el.shadowRoot?.querySelector('[part~="icon"]')
            expect(icon?.getAttribute('aria-hidden')).to.equal('true')
        })
    })

    describe('Edge Cases', () => {
        it('should handle empty image string', async () => {
            const el: any = await fixture(html`
                <terra-avatar image=""></terra-avatar>
            `)
            const image = el.shadowRoot?.querySelector('[part~="image"]')
            expect(image).to.not.exist
        })

        it('should handle empty initials string', async () => {
            const el: any = await fixture(html`
                <terra-avatar initials=""></terra-avatar>
            `)
            const initials = el.shadowRoot?.querySelector('[part~="initials"]')
            expect(initials).to.not.exist
            // Should show icon instead
            const icon = el.shadowRoot?.querySelector('[part~="icon"]')
            expect(icon).to.exist
        })

        it('should handle long initials string', async () => {
            const el: any = await fixture(html`
                <terra-avatar initials="ABCDEFG"></terra-avatar>
            `)
            const initials = el.shadowRoot?.querySelector('[part~="initials"]')
            expect(initials).to.exist
            expect(initials?.textContent?.trim()).to.equal('ABCDEFG')
        })

        it('should handle image change from valid to invalid', async () => {
            const el: any = await fixture(html`
                <terra-avatar
                    image="https://example.com/avatar.jpg"
                    initials="JD"
                ></terra-avatar>
            `)
            await elementUpdated(el)

            // Change to invalid image
            el.image = 'https://invalid-url.com/image.jpg'
            await elementUpdated(el)

            // Trigger error
            const image = el.shadowRoot?.querySelector('[part~="image"]')
            if (image) {
                image.dispatchEvent(new Event('error'))
                await elementUpdated(el)

                // Should show initials
                const initials = el.shadowRoot?.querySelector('[part~="initials"]')
                expect(initials).to.exist
            }
        })

        it('should handle image change from invalid to valid', async () => {
            const el: any = await fixture(html`
                <terra-avatar
                    image="https://invalid-url.com/image.jpg"
                    initials="JD"
                ></terra-avatar>
            `)
            await elementUpdated(el)

            // Trigger error first
            const image = el.shadowRoot?.querySelector('[part~="image"]')
            if (image) {
                image.dispatchEvent(new Event('error'))
                await elementUpdated(el)

                // Change to valid image
                el.image = 'https://example.com/avatar.jpg'
                await elementUpdated(el)

                // Should show image again
                const newImage = el.shadowRoot?.querySelector('[part~="image"]')
                expect(newImage).to.exist
            }
        })
    })
})
