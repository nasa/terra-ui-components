import { expect, fixture, html } from '@open-wc/testing'
import { mockGiovanniQueries } from '../../test-helpers/mock-apis.js'
import './data-rods.js'

type TestDataRodsElement = HTMLElement & {
    updateComplete: Promise<unknown>
}

describe('<terra-data-rods>', () => {
    mockGiovanniQueries()

    it('disables the date slider immediately on user range change', async () => {
        const el = await fixture<TestDataRodsElement>(
            html`<terra-data-rods></terra-data-rods>`
        )

        const slider = el.shadowRoot?.querySelector(
            'terra-date-range-slider'
        ) as HTMLElement & { disabled: boolean }

        expect(slider.disabled).to.equal(false)

        slider.dispatchEvent(
            new CustomEvent('terra-date-range-change', {
                detail: {
                    startDate: '2016-01-01',
                    endDate: '2016-08-01',
                },
                bubbles: true,
                composed: true,
            })
        )

        await el.updateComplete

        expect(slider.disabled).to.equal(true)
    })

    it('re-enables the date slider when time-series loading completes', async () => {
        const el = await fixture<TestDataRodsElement>(
            html`<terra-data-rods></terra-data-rods>`
        )

        const slider = el.shadowRoot?.querySelector(
            'terra-date-range-slider'
        ) as HTMLElement & { disabled: boolean }
        const timeSeries = el.shadowRoot?.querySelector('terra-time-series')

        slider.dispatchEvent(
            new CustomEvent('terra-date-range-change', {
                detail: {
                    startDate: '2016-01-01',
                    endDate: '2016-08-01',
                },
                bubbles: true,
                composed: true,
            })
        )

        await el.updateComplete
        expect(slider.disabled).to.equal(true)

        timeSeries?.dispatchEvent(
            new CustomEvent('terra-time-series-loading-change', {
                detail: { loading: false },
                bubbles: true,
                composed: true,
            })
        )

        await el.updateComplete

        expect(slider.disabled).to.equal(false)
    })

    it('shows chunk progress while the slider is disabled for chunked requests', async () => {
        const el = await fixture<TestDataRodsElement>(
            html`<terra-data-rods></terra-data-rods>`
        )

        const timeSeries = el.shadowRoot?.querySelector('terra-time-series')

        timeSeries?.dispatchEvent(
            new CustomEvent('terra-time-series-loading-change', {
                detail: { loading: true },
                bubbles: true,
                composed: true,
            })
        )
        timeSeries?.dispatchEvent(
            new CustomEvent('terra-time-series-chunk-progress-change', {
                detail: { currentChunk: 2, totalChunks: 4 },
                bubbles: true,
                composed: true,
            })
        )

        await el.updateComplete

        const normalizeWhitespace = (text: string | null | undefined) =>
            text?.replace(/\s+/g, ' ').trim()

        expect(normalizeWhitespace(el.shadowRoot?.textContent)).to.include(
            'Loading chunk 2 of 4'
        )

        timeSeries?.dispatchEvent(
            new CustomEvent('terra-time-series-loading-change', {
                detail: { loading: false },
                bubbles: true,
                composed: true,
            })
        )

        await el.updateComplete

        expect(normalizeWhitespace(el.shadowRoot?.textContent)).to.not.include(
            'Loading chunk 2 of 4'
        )
    })
})
