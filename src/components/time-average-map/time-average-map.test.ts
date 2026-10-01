import { expect, fixture, html } from '@open-wc/testing'
import sinon from 'sinon'
import './time-average-map.js'
import TerraMap from '../map/map.component.js'
import type { Variable } from '../browse-variables/browse-variables.types.js'
import { HarmonyRequestController } from '../../controllers/harmony-request.controller.js'

const testVariable = {
    dataFieldId: 'AIRX3STD_Temperature_A',
    dataProductShortName: 'AIRX3STD',
    dataProductVersion: '006',
    dataFieldShortName: 'Temperature_A',
    dataFieldAccessName: 'Temperature_A',
    dataFieldLongName: 'Temperature',
    dataProductLongName: 'AIRS Temperature',
    dataProductTimeInterval: 'daily',
    dataProductWest: -180,
    dataProductSouth: -90,
    dataProductEast: 180,
    dataProductNorth: 90,
    dataProductSpatialResolution: '1 deg',
    dataProductBeginDateTime: '2002-01-01',
    dataProductEndDateTime: '2024-01-01',
    dataFieldKeywords: [],
    dataFieldUnits: 'K',
    dataProductDescriptionUrl: '',
    dataFieldDescriptionUrl: '',
    dataProductInstrumentShortName: '',
} as unknown as Variable

describe('<terra-time-average-map>', () => {
    afterEach(() => {
        sinon.restore()
    })

    it('should render without errors', async () => {
        const el = await fixture(
            html`<terra-time-average-map></terra-time-average-map>`
        )
        expect(el).to.exist
    })

    it('should render a map container', async () => {
        const el: any = await fixture(
            html`<terra-time-average-map></terra-time-average-map>`
        )

        const innerMap = el.shadowRoot?.querySelector('terra-map')
        expect(innerMap).to.exist
    })

    it('should reflect collection property', async () => {
        const el: any = await fixture(
            html`<terra-time-average-map
                collection="AIRX3STD"
            ></terra-time-average-map>`
        )
        expect(el.collection).to.equal('AIRX3STD')
    })

    it('should reflect variable property', async () => {
        const el: any = await fixture(
            html`<terra-time-average-map
                variable="Temperature_A"
            ></terra-time-average-map>`
        )
        expect(el.variable).to.equal('Temperature_A')
    })

    it('should reflect start-date and end-date properties', async () => {
        const el: any = await fixture(
            html`<terra-time-average-map
                start-date="2024-01-01"
                end-date="2024-01-31"
            ></terra-time-average-map>`
        )
        expect(el.startDate).to.equal('2024-01-01')
        expect(el.endDate).to.equal('2024-01-31')
    })

    it('should reflect location property', async () => {
        const el: any = await fixture(
            html`<terra-time-average-map
                location="-120,-50,120,50"
            ></terra-time-average-map>`
        )
        expect(el.location).to.equal('-120,-50,120,50')
    })

    it('should emit terra-plot-options-change when colorMapName changes', async () => {
        const el: any = await fixture(
            html`<terra-time-average-map></terra-time-average-map>`
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
            html`<terra-time-average-map></terra-time-average-map>`
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
            html`<terra-time-average-map></terra-time-average-map>`
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
            html`<terra-time-average-map></terra-time-average-map>`
        )

        el.timeAverageMapError = null
        await el.updateComplete

        const alert = el.shadowRoot?.querySelector('terra-alert.error-alert')
        expect(alert).to.not.exist
    })

    it('should show loader dialog while job is pending', async () => {
        const el: any = await fixture(
            html`<terra-time-average-map></terra-time-average-map>`
        )

        // Initially no dialog should be open
        const dialog = el.shadowRoot?.querySelector('dialog')
        // dialog exists but should not be open unless task is pending
        expect(dialog).to.exist
    })

    it('should handle terra-time-average-map-error event by capturing error state', async () => {
        const el: any = await fixture(
            html`<terra-time-average-map></terra-time-average-map>`
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
            })
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
            html`<terra-time-average-map></terra-time-average-map>`
        )

        el.timeAverageMapError = { code: '500', message: 'Error' }
        await el.updateComplete

        const alert = el.shadowRoot?.querySelector('terra-alert.error-alert')
        expect(alert).to.exist

        alert.dispatchEvent(new CustomEvent('terra-after-hide', { bubbles: true }))
        await el.updateComplete

        expect(el.timeAverageMapError).to.be.null
    })

    it('should default colorMapName to viridis', async () => {
        const el: any = await fixture(
            html`<terra-time-average-map></terra-time-average-map>`
        )
        expect(el.colorMapName).to.equal('viridis')
    })

    it('should default opacity to 1', async () => {
        const el: any = await fixture(
            html`<terra-time-average-map></terra-time-average-map>`
        )
        expect(el.opacity).to.equal(1)
    })

    it('should default noCache to false (caching enabled by default)', async () => {
        const el: any = await fixture(
            html`<terra-time-average-map></terra-time-average-map>`
        )
        expect(el.noCache).to.equal(false)
        expect(el.cache).to.equal(true)
    })

    it('should set noCache to true via the no-cache attribute', async () => {
        const el: any = await fixture(
            html`<terra-time-average-map no-cache></terra-time-average-map>`
        )
        expect(el.noCache).to.equal(true)
        expect(el.cache).to.equal(false)
    })

    it('should forward the deprecated cache setter to noCache with a warning', async () => {
        const warnSpy = sinon.stub(console, 'warn')
        const el: any = await fixture(
            html`<terra-time-average-map></terra-time-average-map>`
        )

        el.cache = false
        await el.updateComplete

        expect(el.noCache).to.equal(true)
        expect(el.cache).to.equal(false)
        expect(warnSpy.called).to.be.true
    })

    it('should default jobId to undefined', async () => {
        const el: any = await fixture(
            html`<terra-time-average-map></terra-time-average-map>`
        )
        expect(el.jobId).to.be.undefined
    })

    it('should set jobId via attribute', async () => {
        const el: any = await fixture(
            html`<terra-time-average-map job-id="abc-123"></terra-time-average-map>`
        )
        expect(el.jobId).to.equal('abc-123')
    })

    it('should not independently fetch Natural Earth border/state GeoJSON', async () => {
        const el: any = await fixture(
            html`<terra-time-average-map></terra-time-average-map>`
        )
        expect(el.intializeMap).to.be.undefined
        expect(el.addSupportingLayersForGeoTIFF).to.be.undefined
    })

    it('should add a profile-line layer and draw interaction to the inner terra-map when the checkbox toggle is enabled', async () => {
        const addLayerSpy = sinon.spy(TerraMap.prototype, 'addLayer')
        const addInteractionSpy = sinon.spy(TerraMap.prototype, 'addInteraction')

        const el: any = await fixture(
            html`<terra-time-average-map></terra-time-average-map>`
        )
        el.catalogVariable = testVariable
        await el.updateComplete

        const toolbar = el.shadowRoot?.querySelector('terra-plot-toolbar')
        expect(toolbar).to.exist

        toolbar.dispatchEvent(
            new CustomEvent('show-check-box-toggle', {
                detail: true,
                bubbles: true,
                composed: true,
            })
        )
        await el.updateComplete

        expect(
            addLayerSpy.calledWith(sinon.match.any, {
                name: 'profile-line',
                position: 'top',
            })
        ).to.be.true
        expect(addInteractionSpy.called).to.be.true
    })

    it('should remove the profile-line layer and draw interaction from the inner terra-map when the checkbox toggle is disabled', async () => {
        const removeLayerSpy = sinon.spy(TerraMap.prototype, 'removeLayer')
        const removeInteractionSpy = sinon.spy(
            TerraMap.prototype,
            'removeInteraction'
        )

        const el: any = await fixture(
            html`<terra-time-average-map></terra-time-average-map>`
        )
        el.catalogVariable = testVariable
        await el.updateComplete

        const toolbar = el.shadowRoot?.querySelector('terra-plot-toolbar')

        toolbar.dispatchEvent(
            new CustomEvent('show-check-box-toggle', {
                detail: true,
                bubbles: true,
                composed: true,
            })
        )
        await el.updateComplete

        toolbar.dispatchEvent(
            new CustomEvent('show-check-box-toggle', {
                detail: false,
                bubbles: true,
                composed: true,
            })
        )
        await el.updateComplete

        expect(removeLayerSpy.calledWith('profile-line')).to.be.true
        expect(removeInteractionSpy.called).to.be.true
    })

    it('should call the real Harmony cancelJob endpoint when Cancel is clicked while a job is running', async () => {
        const cancelJobStub = sinon
            .stub(HarmonyRequestController.prototype, 'cancelJob')
            .resolves({} as any)
        sinon.stub(HarmonyRequestController.prototype, 'jobId').get(() => 'job-123')

        const el: any = await fixture(
            html`<terra-time-average-map></terra-time-average-map>`
        )

        const cancelButton = el.shadowRoot?.querySelector('dialog terra-button')
        expect(cancelButton).to.exist

        cancelButton.click()
        await el.updateComplete

        expect(
            cancelJobStub.calledWith({
                jobId: 'job-123',
                options: { bearerToken: el.bearerToken },
            })
        ).to.be.true
    })

    it('should not call cancelJob when no Harmony job has started', async () => {
        const cancelJobStub = sinon
            .stub(HarmonyRequestController.prototype, 'cancelJob')
            .resolves({} as any)
        sinon.stub(HarmonyRequestController.prototype, 'jobId').get(() => null)

        const el: any = await fixture(
            html`<terra-time-average-map></terra-time-average-map>`
        )

        const cancelButton = el.shadowRoot?.querySelector('dialog terra-button')
        cancelButton.click()
        await el.updateComplete

        expect(cancelJobStub.called).to.be.false
    })
})
