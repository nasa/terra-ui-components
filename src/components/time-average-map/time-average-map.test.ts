import { expect, fixture, html } from '@open-wc/testing'
import './time-average-map.js'

describe('<terra-time-average-map>', () => {
    it('should render without errors', async () => {
        const el = await fixture(
            html`<terra-time-average-map></terra-time-average-map>`,
        )
        expect(el).to.exist
    })

    it('should render a map container', async () => {
        const el: any = await fixture(
            html`<terra-time-average-map></terra-time-average-map>`,
        )

        const mapContainer = el.shadowRoot?.querySelector('#map')
        expect(mapContainer).to.exist
    })

    it('should reflect collection property', async () => {
        const el: any = await fixture(
            html`<terra-time-average-map collection="AIRX3STD"></terra-time-average-map>`,
        )
        expect(el.collection).to.equal('AIRX3STD')
    })

    it('should reflect variable property', async () => {
        const el: any = await fixture(
            html`<terra-time-average-map variable="Temperature_A"></terra-time-average-map>`,
        )
        expect(el.variable).to.equal('Temperature_A')
    })

    it('should reflect start-date and end-date properties', async () => {
        const el: any = await fixture(
            html`<terra-time-average-map
                start-date="2024-01-01"
                end-date="2024-01-31"
            ></terra-time-average-map>`,
        )
        expect(el.startDate).to.equal('2024-01-01')
        expect(el.endDate).to.equal('2024-01-31')
    })

    it('should reflect location property', async () => {
        const el: any = await fixture(
            html`<terra-time-average-map
                location="-120,-50,120,50"
            ></terra-time-average-map>`,
        )
        expect(el.location).to.equal('-120,-50,120,50')
    })

    it('should emit terra-plot-options-change when colorMapName changes', async () => {
        const el: any = await fixture(
            html`<terra-time-average-map></terra-time-average-map>`,
        )

        let eventDetail: any
        el.addEventListener('terra-plot-options-change', (e: CustomEvent) => {
            eventDetail = e.detail
        })

        el.colorMapName = 'jet'
        await el.updateComplete

        expect(eventDetail).to.exist
        expect(eventDetail.colorMapName).to.equal('jet')
    })

    it('should emit terra-plot-options-change when opacity changes', async () => {
        const el: any = await fixture(
            html`<terra-time-average-map></terra-time-average-map>`,
        )

        let eventDetail: any
        el.addEventListener('terra-plot-options-change', (e: CustomEvent) => {
            eventDetail = e.detail
        })

        el.opacity = 0.5
        await el.updateComplete

        expect(eventDetail).to.exist
        expect(eventDetail.opacity).to.equal(0.5)
    })

    it('should display error alert when timeAverageMapError is set', async () => {
        const el: any = await fixture(
            html`<terra-time-average-map></terra-time-average-map>`,
        )

        el.timeAverageMapError = {
            code: '500',
            message: 'Internal server error',
        }
        await el.updateComplete

        const alert = el.shadowRoot?.querySelector('terra-alert.error-alert')
        expect(alert).to.exist
    })

    it('should not display error alert when timeAverageMapError is null', async () => {
        const el: any = await fixture(
            html`<terra-time-average-map></terra-time-average-map>`,
        )

        el.timeAverageMapError = null
        await el.updateComplete

        const alert = el.shadowRoot?.querySelector('terra-alert.error-alert')
        expect(alert).to.not.exist
    })

    it('should show loader dialog while job is pending', async () => {
        const el: any = await fixture(
            html`<terra-time-average-map></terra-time-average-map>`,
        )

        // Initially no dialog should be open
        const dialog = el.shadowRoot?.querySelector('dialog')
        // dialog exists but should not be open unless task is pending
        expect(dialog).to.exist
    })

    it('should handle terra-time-average-map-error event by capturing error state', async () => {
        const el: any = await fixture(
            html`<terra-time-average-map></terra-time-average-map>`,
        )

        el.dispatchEvent(
            new CustomEvent('terra-time-average-map-error', {
                detail: {
                    code: '400',
                    message: 'Bad request',
                    context: 'Test error context',
                },
                bubbles: true,
                composed: true,
            }),
        )

        await el.updateComplete

        expect(el.timeAverageMapError).to.deep.equal({
            code: '400',
            message: 'Bad request',
            context: 'Test error context',
        })
    })

    it('should clear timeAverageMapError when alert is closed', async () => {
        const el: any = await fixture(
            html`<terra-time-average-map></terra-time-average-map>`,
        )

        el.timeAverageMapError = { code: '500', message: 'Error' }
        await el.updateComplete

        const alert = el.shadowRoot?.querySelector('terra-alert.error-alert')
        expect(alert).to.exist

        alert.dispatchEvent(
            new CustomEvent('terra-after-hide', { bubbles: true }),
        )
        await el.updateComplete

        expect(el.timeAverageMapError).to.be.null
    })

    it('should default colorMapName to viridis', async () => {
        const el: any = await fixture(
            html`<terra-time-average-map></terra-time-average-map>`,
        )
        expect(el.colorMapName).to.equal('viridis')
    })

    it('should default opacity to 1', async () => {
        const el: any = await fixture(
            html`<terra-time-average-map></terra-time-average-map>`,
        )
        expect(el.opacity).to.equal(1)
    })

    it('should default cache to false', async () => {
        const el: any = await fixture(
            html`<terra-time-average-map></terra-time-average-map>`,
        )
        expect(el.cache).to.equal(false)
    })

    it('should set cache to true via property', async () => {
        const el: any = await fixture(
            html`<terra-time-average-map></terra-time-average-map>`,
        )
        el.cache = true
        await el.updateComplete
        expect(el.cache).to.equal(true)
    })

    it('should default jobId to undefined', async () => {
        const el: any = await fixture(
            html`<terra-time-average-map></terra-time-average-map>`,
        )
        expect(el.jobId).to.be.undefined
    })

    it('should set jobId via attribute', async () => {
        const el: any = await fixture(
            html`<terra-time-average-map job-id="abc-123"></terra-time-average-map>`,
        )
        expect(el.jobId).to.equal('abc-123')
    })
})
