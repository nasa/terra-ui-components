import { expect, fixture, html } from '@open-wc/testing'
import './data-access.js'

describe('<terra-data-access>', () => {
    it('should render a component', async () => {
        const el = await fixture(html`<terra-data-access></terra-data-access>`)

        expect(el).to.exist
    })

    it('should render core filter controls and results summary', async () => {
        const el: any = await fixture(
            html`<terra-data-access></terra-data-access>`,
        )

        const searchInput = el.shadowRoot?.querySelector('.search-input')
        const spatialButton = Array.from(
            el.shadowRoot?.querySelectorAll('.filter-btn span') ?? [],
        ).find((node) => node.textContent?.includes('Spatial Area'))
        const dateButton = Array.from(
            el.shadowRoot?.querySelectorAll('.filter-btn span') ?? [],
        ).find((node) => node.textContent?.includes('Date Range'))
        const resultsInfo = el.shadowRoot?.querySelector('.results-info')

        expect(searchInput).to.exist
        expect(spatialButton).to.exist
        expect(dateButton).to.exist
        expect(resultsInfo?.textContent).to.include('files selected')
    })

    it('should not render cloud cover filter until cloudCoverRange exists', async () => {
        const el: any = await fixture(
            html`<terra-data-access></terra-data-access>`,
        )

        const cloudLabelBefore = Array.from(
            el.shadowRoot?.querySelectorAll('.filter-btn span') ?? [],
        ).find((node) => node.textContent?.includes('Cloud Cover'))

        expect(cloudLabelBefore).to.not.exist

        el.cloudCoverRange = { min: 0, max: 100 }
        el.requestUpdate()
        await el.updateComplete

        const cloudLabelAfter = Array.from(
            el.shadowRoot?.querySelectorAll('.filter-btn span') ?? [],
        ).find((node) => node.textContent?.includes('Cloud Cover'))

        expect(cloudLabelAfter).to.exist
    })

    it('should render selected date range text and clear control when dates are set', async () => {
        const el: any = await fixture(
            html`<terra-data-access></terra-data-access>`,
        )

        el.searchParams = {
            ...el.searchParams,
            startDate: '2024-01-01T00:00:00.000Z',
            endDate: '2024-01-03T00:00:00.000Z',
        }
        await el.updateComplete

        const labels = Array.from(
            el.shadowRoot?.querySelectorAll('.filter-btn span') ?? [],
        ).map((node) => node.textContent?.trim() ?? '')
        const hasNonDefaultDateLabel = labels.some(
            (text) => text !== 'Date Range' && text.includes('2024'),
        )
        const clearDateButton = el.shadowRoot?.querySelector(
            'button[aria-label="Clear date range"]',
        )

        expect(hasNonDefaultDateLabel).to.be.true
        expect(clearDateButton).to.exist
    })

    it('should render footer content in footer slot when footerSlot is enabled', async () => {
        const el: any = await fixture(
            html`<terra-data-access></terra-data-access>`,
        )

        expect(el.shadowRoot?.querySelector('[slot="footer"]')).to.not.exist

        el.footerSlot = true
        await el.updateComplete

        const footerContainer = el.shadowRoot?.querySelector('[slot="footer"]')
        expect(footerContainer).to.exist
        expect(footerContainer?.textContent).to.include('Download Options')
    })
})
