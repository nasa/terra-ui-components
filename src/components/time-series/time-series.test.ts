import { expect, fixture, html } from '@open-wc/testing'
import sinon from 'sinon'
import './time-series.js'
import { HarmonyRequestController } from '../../controllers/harmony-request.controller.js'

describe('<terra-time-series>', () => {
    afterEach(() => {
        sinon.restore()
    })

    it('should parse JSON variable-entry-ids attribute values', () => {
        const el = document.createElement('terra-time-series') as any

        el.setAttribute('variable-entry-ids', '["A_B_c", "D_E_f"]')

        expect(el.variableEntryIds).to.deep.equal(['A_B_c', 'D_E_f'])
    })

    it('should parse comma-delimited variable-entry-ids attribute values', () => {
        const el = document.createElement('terra-time-series') as any

        el.setAttribute('variable-entry-ids', 'A_B_c, D_E_f, G_H_i')

        expect(el.variableEntryIds).to.deep.equal(['A_B_c', 'D_E_f', 'G_H_i'])
    })

    it('should allow variableEntryIds property assignment', () => {
        const el = document.createElement('terra-time-series') as any

        el.variableEntryIds = ['A_B_c', 'D_E_f']

        expect(el.variableEntryIds).to.deep.equal(['A_B_c', 'D_E_f'])
    })

    it('should default cache to false', () => {
        const el = document.createElement('terra-time-series') as any
        expect(el.cache).to.equal(false)
    })

    it('should set cache to true via property', () => {
        const el = document.createElement('terra-time-series') as any
        el.cache = true
        expect(el.cache).to.equal(true)
    })

    it('should default jobId to undefined', () => {
        const el = document.createElement('terra-time-series') as any
        expect(el.jobId).to.be.undefined
    })

    it('should set jobId via attribute', () => {
        const el = document.createElement('terra-time-series') as any
        el.setAttribute('job-id', 'abc-123')
        expect(el.jobId).to.equal('abc-123')
    })

    it('should call the real Harmony cancelJob endpoint when Cancel is clicked while a job is running', async () => {
        const cancelJobStub = sinon
            .stub(HarmonyRequestController.prototype, 'cancelJob')
            .resolves({} as any)
        sinon.stub(HarmonyRequestController.prototype, 'jobId').get(() => 'job-123')

        const el: any = await fixture(html`<terra-time-series></terra-time-series>`)

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

        const el: any = await fixture(html`<terra-time-series></terra-time-series>`)

        const cancelButton = el.shadowRoot?.querySelector('dialog terra-button')
        cancelButton.click()
        await el.updateComplete

        expect(cancelJobStub.called).to.be.false
    })
})
