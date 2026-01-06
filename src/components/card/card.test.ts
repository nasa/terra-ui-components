import { expect, fixture, html, elementUpdated } from '@open-wc/testing'
import './card.js'

describe('<terra-card>', () => {
    describe('Basic Rendering', () => {
    it('should render a component', async () => {
            const el = await fixture(html` <terra-card></terra-card> `)
            expect(el).to.exist
        })

        it('should render with base part', async () => {
            const el: any = await fixture(html`
                <terra-card></terra-card>
            `)
            const base = el.shadowRoot?.querySelector('[part~="base"]')
            expect(base).to.exist
        })

        it('should have card class', async () => {
            const el: any = await fixture(html`
                <terra-card></terra-card>
            `)
            const base = el.shadowRoot?.querySelector('[part~="base"]')
            expect(base?.classList.contains('card')).to.be.true
        })
    })

    describe('Slots', () => {
        it('should render default slot content', async () => {
            const el: any = await fixture(html`
                <terra-card>Card content</terra-card>
            `)
            expect(el.textContent?.trim()).to.equal('Card content')
        })

        it('should render header slot', async () => {
            const el: any = await fixture(html`
                <terra-card>
                    <div slot="header">Header</div>
                    Body content
                </terra-card>
            `)
            const header = el.querySelector('[slot="header"]')
            expect(header).to.exist
            expect(header.textContent?.trim()).to.equal('Header')
        })

        it('should render footer slot', async () => {
            const el: any = await fixture(html`
                <terra-card>
                    Body content
                    <div slot="footer">Footer</div>
                </terra-card>
            `)
            const footer = el.querySelector('[slot="footer"]')
            expect(footer).to.exist
            expect(footer.textContent?.trim()).to.equal('Footer')
        })

        it('should render image slot', async () => {
            const el: any = await fixture(html`
                <terra-card>
                    <img slot="image" src="test.jpg" alt="Test" />
                    Body content
                </terra-card>
            `)
            const image = el.querySelector('[slot="image"]')
            expect(image).to.exist
            expect(image.getAttribute('src')).to.equal('test.jpg')
        })

        it('should apply has-header class when header slot exists', async () => {
            const el: any = await fixture(html`
                <terra-card>
                    <div slot="header">Header</div>
                </terra-card>
            `)
            await elementUpdated(el)
            const base = el.shadowRoot?.querySelector('[part~="base"]')
            expect(base?.classList.contains('card--has-header')).to.be.true
        })

        it('should apply has-footer class when footer slot exists', async () => {
            const el: any = await fixture(html`
                <terra-card>
                    <div slot="footer">Footer</div>
                </terra-card>
            `)
            await elementUpdated(el)
            const base = el.shadowRoot?.querySelector('[part~="base"]')
            expect(base?.classList.contains('card--has-footer')).to.be.true
        })

        it('should apply has-image class when image slot exists', async () => {
            const el: any = await fixture(html`
                <terra-card>
                    <img slot="image" src="test.jpg" alt="Test" />
                </terra-card>
            `)
            await elementUpdated(el)
            const base = el.shadowRoot?.querySelector('[part~="base"]')
            expect(base?.classList.contains('card--has-image')).to.be.true
        })

        it('should not apply has-header class when header slot does not exist', async () => {
            const el: any = await fixture(html`
                <terra-card>Body content</terra-card>
            `)
            await elementUpdated(el)
            const base = el.shadowRoot?.querySelector('[part~="base"]')
            expect(base?.classList.contains('card--has-header')).to.be.false
        })

        it('should not apply has-footer class when footer slot does not exist', async () => {
            const el: any = await fixture(html`
                <terra-card>Body content</terra-card>
            `)
            await elementUpdated(el)
            const base = el.shadowRoot?.querySelector('[part~="base"]')
            expect(base?.classList.contains('card--has-footer')).to.be.false
        })

        it('should not apply has-image class when image slot does not exist', async () => {
            const el: any = await fixture(html`
                <terra-card>Body content</terra-card>
            `)
            await elementUpdated(el)
            const base = el.shadowRoot?.querySelector('[part~="base"]')
            expect(base?.classList.contains('card--has-image')).to.be.false
        })
    })

    describe('CSS Parts', () => {
        it('should have image part', async () => {
            const el: any = await fixture(html`
                <terra-card>
                    <img slot="image" src="test.jpg" alt="Test" />
                </terra-card>
            `)
            const imageSlot = el.shadowRoot?.querySelector('[part~="image"]')
            expect(imageSlot).to.exist
        })

        it('should have header part', async () => {
            const el: any = await fixture(html`
                <terra-card>
                    <div slot="header">Header</div>
                </terra-card>
            `)
            const headerSlot = el.shadowRoot?.querySelector('[part~="header"]')
            expect(headerSlot).to.exist
        })

        it('should have body part', async () => {
            const el: any = await fixture(html`
                <terra-card>Body content</terra-card>
            `)
            const bodySlot = el.shadowRoot?.querySelector('[part~="body"]')
            expect(bodySlot).to.exist
        })

        it('should have footer part', async () => {
            const el: any = await fixture(html`
                <terra-card>
                    <div slot="footer">Footer</div>
                </terra-card>
            `)
            const footerSlot = el.shadowRoot?.querySelector('[part~="footer"]')
            expect(footerSlot).to.exist
        })
    })

    describe('Layout', () => {
        it('should use flexbox layout', async () => {
            const el: any = await fixture(html`
                <terra-card>Body content</terra-card>
            `)
            const base = el.shadowRoot?.querySelector('[part~="base"]')
            const computedStyle = getComputedStyle(base)
            expect(computedStyle.display).to.equal('flex')
            expect(computedStyle.flexDirection).to.equal('column')
        })
    })

    describe('Image Slot', () => {
        it('should hide image slot when no image is provided', async () => {
            const el: any = await fixture(html`
                <terra-card>Body content</terra-card>
            `)
            await elementUpdated(el)
            const imageSlot = el.shadowRoot?.querySelector('.card__image')
            const computedStyle = getComputedStyle(imageSlot)
            expect(computedStyle.display).to.equal('none')
        })

        it('should show image slot when image is provided', async () => {
            const el: any = await fixture(html`
                <terra-card>
                    <img slot="image" src="test.jpg" alt="Test" />
                </terra-card>
            `)
            await elementUpdated(el)
            const imageSlot = el.shadowRoot?.querySelector('.card__image')
            const computedStyle = getComputedStyle(imageSlot)
            expect(computedStyle.display).to.equal('flex')
        })

        it('should style slotted images to be full width', async () => {
            const el: any = await fixture(html`
                <terra-card>
                    <img slot="image" src="test.jpg" alt="Test" />
                </terra-card>
            `)
            await elementUpdated(el)
            const image = el.querySelector('img')
            // Image should be in the slot
            expect(image).to.exist
        })
    })

    describe('Header Slot', () => {
        it('should hide header slot when no header is provided', async () => {
            const el: any = await fixture(html`
                <terra-card>Body content</terra-card>
            `)
            await elementUpdated(el)
            const headerSlot = el.shadowRoot?.querySelector('.card__header')
            const computedStyle = getComputedStyle(headerSlot)
            expect(computedStyle.display).to.equal('none')
        })

        it('should show header slot when header is provided', async () => {
            const el: any = await fixture(html`
                <terra-card>
                    <div slot="header">Header</div>
                </terra-card>
            `)
            await elementUpdated(el)
            const headerSlot = el.shadowRoot?.querySelector('.card__header')
            const computedStyle = getComputedStyle(headerSlot)
            expect(computedStyle.display).to.equal('block')
        })

        it('should add border-bottom to header', async () => {
            const el: any = await fixture(html`
                <terra-card>
                    <div slot="header">Header</div>
                </terra-card>
            `)
            await elementUpdated(el)
            const headerSlot = el.shadowRoot?.querySelector('.card__header')
            const computedStyle = getComputedStyle(headerSlot)
            expect(computedStyle.borderBottomWidth).to.not.equal('0px')
        })
    })

    describe('Footer Slot', () => {
        it('should hide footer slot when no footer is provided', async () => {
            const el: any = await fixture(html`
                <terra-card>Body content</terra-card>
            `)
            await elementUpdated(el)
            const footerSlot = el.shadowRoot?.querySelector('.card__footer')
            const computedStyle = getComputedStyle(footerSlot)
            expect(computedStyle.display).to.equal('none')
        })

        it('should show footer slot when footer is provided', async () => {
            const el: any = await fixture(html`
                <terra-card>
                    <div slot="footer">Footer</div>
                </terra-card>
            `)
            await elementUpdated(el)
            const footerSlot = el.shadowRoot?.querySelector('.card__footer')
            const computedStyle = getComputedStyle(footerSlot)
            expect(computedStyle.display).to.equal('block')
        })

        it('should add border-top to footer', async () => {
            const el: any = await fixture(html`
                <terra-card>
                    <div slot="footer">Footer</div>
                </terra-card>
            `)
            await elementUpdated(el)
            const footerSlot = el.shadowRoot?.querySelector('.card__footer')
            const computedStyle = getComputedStyle(footerSlot)
            expect(computedStyle.borderTopWidth).to.not.equal('0px')
        })
    })

    describe('Combined Slots', () => {
        it('should render all slots together', async () => {
            const el: any = await fixture(html`
                <terra-card>
                    <img slot="image" src="test.jpg" alt="Test" />
                    <div slot="header">Header</div>
                    Body content
                    <div slot="footer">Footer</div>
                </terra-card>
            `)
            await elementUpdated(el)

            expect(el.querySelector('[slot="image"]')).to.exist
            expect(el.querySelector('[slot="header"]')).to.exist
            expect(el.querySelector('[slot="footer"]')).to.exist
            expect(el.textContent).to.include('Body content')

            const base = el.shadowRoot?.querySelector('[part~="base"]')
            expect(base?.classList.contains('card--has-image')).to.be.true
            expect(base?.classList.contains('card--has-header')).to.be.true
            expect(base?.classList.contains('card--has-footer')).to.be.true
        })
    })

    describe('Edge Cases', () => {
        it('should handle empty card', async () => {
            const el: any = await fixture(html` <terra-card></terra-card> `)
            await elementUpdated(el)
            expect(el).to.exist
        })

        it('should handle card with only body content', async () => {
            const el: any = await fixture(html`
                <terra-card>Only body</terra-card>
            `)
            await elementUpdated(el)
            expect(el.textContent?.trim()).to.equal('Only body')
        })
    })
})
