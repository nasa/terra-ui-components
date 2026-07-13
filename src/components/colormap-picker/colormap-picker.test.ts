import { expect, fixture, html } from '@open-wc/testing'
import './colormap-picker.js'

describe('<terra-colormap-picker>', () => {
    describe('Basic Rendering', () => {
        it('should render the component', async () => {
            const el = await fixture(html`<terra-colormap-picker></terra-colormap-picker>`)
            expect(el).to.exist
        })

        it('should render a filter bar', async () => {
            const el: any = await fixture(html`<terra-colormap-picker></terra-colormap-picker>`)
            const filter = el.shadowRoot?.querySelector('[part~="filter"]')
            expect(filter).to.exist
        })

        it('should render a swatch grid', async () => {
            const el: any = await fixture(html`<terra-colormap-picker></terra-colormap-picker>`)
            const grid = el.shadowRoot?.querySelector('[part~="grid"]')
            expect(grid).to.exist
        })

        it('should render swatches', async () => {
            const el: any = await fixture(html`<terra-colormap-picker></terra-colormap-picker>`)
            const swatches = el.shadowRoot?.querySelectorAll('[part~="swatch"]')
            expect(swatches?.length).to.be.greaterThan(0)
        })
    })

    describe('Default State', () => {
        it('should default value to viridis', async () => {
            const el: any = await fixture(html`<terra-colormap-picker></terra-colormap-picker>`)
            expect(el.value).to.equal('viridis')
        })

        it('should default category to all', async () => {
            const el: any = await fixture(html`<terra-colormap-picker></terra-colormap-picker>`)
            expect(el.category).to.equal('all')
        })

        it('should default disabled to false', async () => {
            const el: any = await fixture(html`<terra-colormap-picker></terra-colormap-picker>`)
            expect(el.disabled).to.be.false
        })
    })

    describe('Properties', () => {
        it('should accept a value property', async () => {
            const el: any = await fixture(html`<terra-colormap-picker value="plasma"></terra-colormap-picker>`)
            expect(el.value).to.equal('plasma')
        })

        it('should reflect value as an attribute', async () => {
            const el: any = await fixture(html`<terra-colormap-picker value="inferno"></terra-colormap-picker>`)
            expect(el.getAttribute('value')).to.equal('inferno')
        })

        it('should accept disabled property', async () => {
            const el: any = await fixture(html`<terra-colormap-picker disabled></terra-colormap-picker>`)
            expect(el.disabled).to.be.true
        })

        it('should reflect disabled as an attribute', async () => {
            const el: any = await fixture(html`<terra-colormap-picker disabled></terra-colormap-picker>`)
            expect(el.hasAttribute('disabled')).to.be.true
        })
    })

    describe('Selected Swatch', () => {
        it('should mark the selected swatch', async () => {
            const el: any = await fixture(html`<terra-colormap-picker value="plasma"></terra-colormap-picker>`)
            const selected = el.shadowRoot?.querySelector('[part~="swatch"][aria-selected="true"]')
            expect(selected).to.exist
            expect(selected?.getAttribute('aria-label')).to.equal('plasma')
        })

        it('should apply selected class to the active swatch', async () => {
            const el: any = await fixture(html`<terra-colormap-picker value="viridis"></terra-colormap-picker>`)
            const swatches = el.shadowRoot?.querySelectorAll('[part~="swatch"]')
            const selected = Array.from(swatches ?? []).find((s: any) =>
                s.getAttribute('aria-label') === 'viridis'
            ) as HTMLElement | undefined
            expect(selected?.classList.contains('colormap-picker__swatch--selected')).to.be.true
        })
    })

    describe('Events', () => {
        it('should emit terra-colormap-change when a swatch is clicked', async () => {
            const el: any = await fixture(html`<terra-colormap-picker value="viridis"></terra-colormap-picker>`)
            let event: CustomEvent | null = null
            el.addEventListener('terra-colormap-change', (e: CustomEvent) => { event = e })

            const swatch = Array.from(
                el.shadowRoot?.querySelectorAll('[part~="swatch"]') ?? []
            ).find((s: any) => s.getAttribute('aria-label') === 'plasma') as HTMLElement | undefined

            swatch?.click()
            expect(event).to.exist
            expect((event as any)?.detail?.value).to.equal('plasma')
        })

        it('should not emit terra-colormap-change when clicking the already-selected swatch', async () => {
            const el: any = await fixture(html`<terra-colormap-picker value="viridis"></terra-colormap-picker>`)
            let count = 0
            el.addEventListener('terra-colormap-change', () => { count++ })

            const swatch = Array.from(
                el.shadowRoot?.querySelectorAll('[part~="swatch"]') ?? []
            ).find((s: any) => s.getAttribute('aria-label') === 'viridis') as HTMLElement | undefined

            swatch?.click()
            expect(count).to.equal(0)
        })

        it('should not emit terra-colormap-change when disabled', async () => {
            const el: any = await fixture(html`<terra-colormap-picker value="viridis" disabled></terra-colormap-picker>`)
            let count = 0
            el.addEventListener('terra-colormap-change', () => { count++ })

            const swatch = Array.from(
                el.shadowRoot?.querySelectorAll('[part~="swatch"]') ?? []
            ).find((s: any) => s.getAttribute('aria-label') === 'plasma') as HTMLElement | undefined

            swatch?.click()
            expect(count).to.equal(0)
        })
    })

    describe('Category Filtering', () => {
        it('should render all colormaps by default', async () => {
            const el: any = await fixture(html`<terra-colormap-picker></terra-colormap-picker>`)
            const swatches = el.shadowRoot?.querySelectorAll('[part~="swatch"]')
            expect(swatches?.length).to.be.greaterThan(10)
        })

        it('should filter to sequential colormaps', async () => {
            const el: any = await fixture(html`<terra-colormap-picker></terra-colormap-picker>`)
            const allSwatches = el.shadowRoot?.querySelectorAll('[part~="swatch"]')?.length ?? 0

            const seqBtn = Array.from(
                el.shadowRoot?.querySelectorAll('[part~="filter-button"]') ?? []
            ).find((b: any) => b.textContent?.trim() === 'Sequential') as HTMLElement | undefined

            seqBtn?.click()
            await el.updateComplete

            const filtered = el.shadowRoot?.querySelectorAll('[part~="swatch"]')?.length ?? 0
            expect(filtered).to.be.lessThan(allSwatches)
        })

        it('should render four category filter buttons', async () => {
            const el: any = await fixture(html`<terra-colormap-picker></terra-colormap-picker>`)
            const buttons = el.shadowRoot?.querySelectorAll('[part~="filter-button"]')
            expect(buttons?.length).to.equal(4)
        })
    })

    describe('Accessibility', () => {
        it('should have a listbox role on the grid', async () => {
            const el: any = await fixture(html`<terra-colormap-picker></terra-colormap-picker>`)
            const grid = el.shadowRoot?.querySelector('[part~="grid"]')
            expect(grid?.getAttribute('role')).to.equal('listbox')
        })

        it('should have option role on each swatch', async () => {
            const el: any = await fixture(html`<terra-colormap-picker></terra-colormap-picker>`)
            const swatch = el.shadowRoot?.querySelector('[part~="swatch"]')
            expect(swatch?.getAttribute('role')).to.equal('option')
        })

        it('should have aria-label on each swatch matching the colormap name', async () => {
            const el: any = await fixture(html`<terra-colormap-picker></terra-colormap-picker>`)
            const swatch = el.shadowRoot?.querySelector('[part~="swatch"]') as HTMLElement
            expect(swatch?.getAttribute('aria-label')).to.be.a('string').and.not.empty
        })

        it('should have tablist role on the filter bar', async () => {
            const el: any = await fixture(html`<terra-colormap-picker></terra-colormap-picker>`)
            const filter = el.shadowRoot?.querySelector('[part~="filter"]')
            expect(filter?.getAttribute('role')).to.equal('tablist')
        })
    })
})
