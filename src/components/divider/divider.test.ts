import { expect, fixture, html } from '@open-wc/testing'
import './divider.js'

describe('<terra-divider>', () => {
    describe('Basic Rendering', () => {
        it('should render a component', async () => {
            const el = await fixture(html` <terra-divider></terra-divider> `)
            expect(el).to.exist
        })

        it('should be a block element by default', async () => {
            const el: any = await fixture(html` <terra-divider></terra-divider> `)
            const styles = window.getComputedStyle(el)
            expect(styles.display).to.equal('block')
        })
    })

    describe('Properties', () => {
        it('should accept vertical property', async () => {
            const el: any = await fixture(html`
                <terra-divider vertical></terra-divider>
            `)
            expect(el.vertical).to.be.true
        })

        it('should reflect vertical as attribute', async () => {
            const el: any = await fixture(html`
                <terra-divider vertical></terra-divider>
            `)
            expect(el.hasAttribute('vertical')).to.be.true
        })

        it('should default vertical to false', async () => {
            const el: any = await fixture(html` <terra-divider></terra-divider> `)
            expect(el.vertical).to.be.false
        })

        it('should update vertical property dynamically', async () => {
            const el: any = await fixture(html` <terra-divider></terra-divider> `)
            expect(el.vertical).to.be.false
            el.vertical = true
            await el.updateComplete
            expect(el.vertical).to.be.true
            expect(el.hasAttribute('vertical')).to.be.true
        })
    })

    describe('Orientation', () => {
        it('should be inline-block when vertical', async () => {
            const el: any = await fixture(html`
                <terra-divider vertical></terra-divider>
            `)
            const styles = window.getComputedStyle(el)
            expect(styles.display).to.equal('inline-block')
        })

        it('should have border-top when horizontal', async () => {
            const el: any = await fixture(html` <terra-divider></terra-divider> `)
            const styles = window.getComputedStyle(el)
            expect(styles.borderTopWidth).to.not.equal('0px')
        })

        it('should have border-left when vertical', async () => {
            const el: any = await fixture(html`
                <terra-divider vertical></terra-divider>
            `)
            const styles = window.getComputedStyle(el)
            expect(styles.borderLeftWidth).to.not.equal('0px')
        })
    })

    describe('Accessibility', () => {
        it('should have role="separator"', async () => {
            const el: any = await fixture(html` <terra-divider></terra-divider> `)
            expect(el.getAttribute('role')).to.equal('separator')
        })

        it('should have aria-orientation="horizontal" by default', async () => {
            const el: any = await fixture(html` <terra-divider></terra-divider> `)
            expect(el.getAttribute('aria-orientation')).to.equal('horizontal')
        })

        it('should have aria-orientation="vertical" when vertical', async () => {
            const el: any = await fixture(html`
                <terra-divider vertical></terra-divider>
            `)
            expect(el.getAttribute('aria-orientation')).to.equal('vertical')
        })

        it('should update aria-orientation when vertical changes', async () => {
            const el: any = await fixture(html` <terra-divider></terra-divider> `)
            expect(el.getAttribute('aria-orientation')).to.equal('horizontal')
            el.vertical = true
            await el.updateComplete
            expect(el.getAttribute('aria-orientation')).to.equal('vertical')
        })
    })

    describe('CSS Custom Properties', () => {
        it('should accept --terra-divider-color', async () => {
            const el: any = await fixture(html`
                <terra-divider style="--terra-divider-color: red;"></terra-divider>
            `)
            const styles = window.getComputedStyle(el)
            // The color should be applied to the border
            expect(styles.borderTopColor).to.not.equal('')
        })

        it('should accept --terra-divider-width', async () => {
            const el: any = await fixture(html`
                <terra-divider style="--terra-divider-width: 4px;"></terra-divider>
            `)
            const styles = window.getComputedStyle(el)
            expect(styles.borderTopWidth).to.equal('4px')
        })

        it('should accept --terra-divider-spacing', async () => {
            const el: any = await fixture(html`
                <terra-divider style="--terra-divider-spacing: 2rem;"></terra-divider>
            `)
            const styles = window.getComputedStyle(el)
            expect(styles.marginTop).to.equal('32px') // body size is 16px, 2rem is 32px
            expect(styles.marginBottom).to.equal('32px')
        })
    })

    describe('Vertical Spacing', () => {
        it('should apply spacing to left and right margins when vertical', async () => {
            const el: any = await fixture(html`
                <terra-divider
                    vertical
                    style="--terra-divider-spacing: 1rem;"
                ></terra-divider>
            `)
            const styles = window.getComputedStyle(el)
            expect(styles.marginLeft).to.equal('16px') // body size is 16px
            expect(styles.marginRight).to.equal('16px')
        })
    })

    describe('Edge Cases', () => {
        it('should handle rapid vertical property changes', async () => {
            const el: any = await fixture(html` <terra-divider></terra-divider> `)
            el.vertical = true
            await el.updateComplete
            el.vertical = false
            await el.updateComplete
            el.vertical = true
            await el.updateComplete
            expect(el.vertical).to.be.true
            expect(el.getAttribute('aria-orientation')).to.equal('vertical')
        })

        it('should work in a flex container', async () => {
            const container = await fixture(html`
                <div style="display: flex; align-items: center; height: 2rem;">
                    <span>First</span>
                    <terra-divider vertical></terra-divider>
                    <span>Last</span>
                </div>
            `)
            const divider = container.querySelector('terra-divider')
            expect(divider).to.exist
        })
    })
})
