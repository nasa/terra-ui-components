import { expect } from '@open-wc/testing'
import sinon from 'sinon'
import { QueryClient } from '@tanstack/query-core'
import type { ReactiveController, ReactiveControllerHost } from 'lit'
import { harmonyApi, Status } from '../../apis/harmony.api.js'
import type { SubsetJobStatus } from '../../apis/harmony.api.js'
import type { QueryClientHost } from '../../mixins/query-client.mixin.js'
import { HarmonyRequest } from '../../lib/harmony/harmony.request.js'
import { LatLngBounds } from '../../components/map/models/LatLngBounds.js'
import { HarmonyRequestController } from '../harmony-request.controller.js'

const COLLECTION_CONCEPT_ID = 'C1276812863-GES_DISC'
const BBOX = new LatLngBounds([62.23, 5.29, 94.57, 37.49])

function makeHarmonyRequest(overrides: Partial<{ format: string }> = {}) {
    return new HarmonyRequest({
        collectionConceptId: COLLECTION_CONCEPT_ID,
        location: BBOX,
        startDate: '2026-01-01T00:00:00.000Z',
        endDate: '2026-01-02T00:00:00.000Z',
        format: overrides.format ?? 'image/tiff',
        average: 'time',
    }).label('terra-time-average-map')
}

function makeJob(overrides: Partial<SubsetJobStatus> = {}): SubsetJobStatus {
    return {
        jobID: 'existing-job-1',
        status: Status.RUNNING,
        message: '',
        progress: 50,
        createdAt: '2026-01-01T00:00:00.000Z',
        updatedAt: '2026-01-01T00:00:00.000Z',
        dataExpiration: '2026-04-01T00:00:00.000Z',
        request: makeHarmonyRequest().requestUrl,
        numInputGranules: 1,
        links: [],
        ...overrides,
    }
}

/** A minimal ReactiveControllerHost + QueryClientHost, fresh per test to avoid cache bleed. */
function makeHost(): ReactiveControllerHost & QueryClientHost {
    const controllers: ReactiveController[] = []
    return {
        addController: controller => controllers.push(controller),
        removeController: () => {},
        requestUpdate: () => {},
        get updateComplete() {
            return Promise.resolve(true)
        },
        queryClient: new QueryClient({
            defaultOptions: { queries: { retry: false } },
        }),
    }
}

describe('HarmonyRequestController', () => {
    let getJobsStub: sinon.SinonStub
    let createJobStub: sinon.SinonStub

    beforeEach(() => {
        getJobsStub = sinon.stub(harmonyApi, 'getJobs')
        createJobStub = sinon.stub(harmonyApi, 'createJob')
        createJobStub.resolves(makeJob({ jobID: 'new-job' }))
    })

    afterEach(() => {
        sinon.restore()
    })

    describe('startJob dedup lookup', () => {
        it('skips the lookup and creates a job when no bearer token is provided', async () => {
            const controller = new HarmonyRequestController(makeHost())

            const result = await controller.startJob({
                harmonyRequest: makeHarmonyRequest(),
            })

            expect(getJobsStub.called).to.be.false
            expect(createJobStub.calledOnce).to.be.true
            expect(result.jobID).to.equal('new-job')
        })

        it('creates a job when the lookup finds no reusable candidates', async () => {
            getJobsStub.resolves({ count: 0, jobs: [], links: [] })
            const controller = new HarmonyRequestController(makeHost())

            const result = await controller.startJob({
                harmonyRequest: makeHarmonyRequest(),
                options: { bearerToken: 'token' },
            })

            expect(getJobsStub.calledOnce).to.be.true
            expect(createJobStub.calledOnce).to.be.true
            expect(result.jobID).to.equal('new-job')
        })

        it('reuses an in-flight job with an equivalent request instead of creating a new one', async () => {
            const existing = makeJob({
                jobID: 'in-flight-job',
                status: Status.RUNNING,
            })
            getJobsStub.resolves({ count: 1, jobs: [existing], links: [] })
            const controller = new HarmonyRequestController(makeHost())

            const result = await controller.startJob({
                harmonyRequest: makeHarmonyRequest(),
                options: { bearerToken: 'token' },
            })

            expect(createJobStub.called).to.be.false
            expect(result.jobID).to.equal('in-flight-job')
            expect(controller.jobId).to.equal('in-flight-job')
        })

        it('does not reuse a job whose request does not match', async () => {
            const differentRequest = makeHarmonyRequest({
                format: 'text/csv',
            }).requestUrl
            const existing = makeJob({
                jobID: 'unrelated-job',
                request: differentRequest,
            })
            getJobsStub.resolves({ count: 1, jobs: [existing], links: [] })
            const controller = new HarmonyRequestController(makeHost())

            const result = await controller.startJob({
                harmonyRequest: makeHarmonyRequest(),
                options: { bearerToken: 'token' },
            })

            expect(createJobStub.calledOnce).to.be.true
            expect(result.jobID).to.equal('new-job')
        })

        it('reuses a successful job whose output has not yet expired', async () => {
            const existing = makeJob({
                jobID: 'successful-job',
                status: Status.SUCCESSFUL,
                dataExpiration: new Date(Date.now() + 86_400_000).toISOString(),
            })
            getJobsStub.resolves({ count: 1, jobs: [existing], links: [] })
            const controller = new HarmonyRequestController(makeHost())

            const result = await controller.startJob({
                harmonyRequest: makeHarmonyRequest(),
                options: { bearerToken: 'token' },
            })

            expect(createJobStub.called).to.be.false
            expect(result.jobID).to.equal('successful-job')
        })

        it('does not reuse a successful job whose output has already expired', async () => {
            const existing = makeJob({
                jobID: 'expired-job',
                status: Status.SUCCESSFUL,
                dataExpiration: new Date(Date.now() - 86_400_000).toISOString(),
            })
            getJobsStub.resolves({ count: 1, jobs: [existing], links: [] })
            const controller = new HarmonyRequestController(makeHost())

            const result = await controller.startJob({
                harmonyRequest: makeHarmonyRequest(),
                options: { bearerToken: 'token' },
            })

            expect(createJobStub.calledOnce).to.be.true
            expect(result.jobID).to.equal('new-job')
        })

        it('never reuses a failed or canceled job, even with a matching request', async () => {
            const failed = makeJob({ jobID: 'failed-job', status: Status.FAILED })
            const canceled = makeJob({
                jobID: 'canceled-job',
                status: Status.CANCELED,
            })
            getJobsStub.resolves({
                count: 2,
                jobs: [failed, canceled],
                links: [],
            })
            const controller = new HarmonyRequestController(makeHost())

            const result = await controller.startJob({
                harmonyRequest: makeHarmonyRequest(),
                options: { bearerToken: 'token' },
            })

            expect(createJobStub.calledOnce).to.be.true
            expect(result.jobID).to.equal('new-job')
        })

        it('reuses the most recently created match when multiple candidates match', async () => {
            const older = makeJob({
                jobID: 'older-job',
                createdAt: '2026-01-01T00:00:00.000Z',
            })
            const newer = makeJob({
                jobID: 'newer-job',
                createdAt: '2026-01-02T00:00:00.000Z',
            })
            getJobsStub.resolves({ count: 2, jobs: [older, newer], links: [] })
            const controller = new HarmonyRequestController(makeHost())

            const result = await controller.startJob({
                harmonyRequest: makeHarmonyRequest(),
                options: { bearerToken: 'token' },
            })

            expect(createJobStub.called).to.be.false
            expect(result.jobID).to.equal('newer-job')
        })

        it('skips a candidate whose request URL cannot be parsed, without throwing', async () => {
            const malformed = makeJob({
                jobID: 'malformed-job',
                request: 'not a url',
            })
            getJobsStub.resolves({ count: 1, jobs: [malformed], links: [] })
            const controller = new HarmonyRequestController(makeHost())

            const result = await controller.startJob({
                harmonyRequest: makeHarmonyRequest(),
                options: { bearerToken: 'token' },
            })

            expect(createJobStub.calledOnce).to.be.true
            expect(result.jobID).to.equal('new-job')
        })

        it('falls back to creating a job when the lookup itself fails', async () => {
            getJobsStub.rejects(new Error('network error'))
            const warnStub = sinon.stub(console, 'warn')
            const controller = new HarmonyRequestController(makeHost())

            const result = await controller.startJob({
                harmonyRequest: makeHarmonyRequest(),
                options: { bearerToken: 'token' },
            })

            expect(createJobStub.calledOnce).to.be.true
            expect(result.jobID).to.equal('new-job')
            expect(warnStub.calledOnce).to.be.true
        })

        it('sets jobId to the reused job and requests an update, same as on normal creation', async () => {
            const existing = makeJob({ jobID: 'in-flight-job' })
            getJobsStub.resolves({ count: 1, jobs: [existing], links: [] })
            const host = makeHost()
            const requestUpdateSpy = sinon.spy(host, 'requestUpdate')
            const controller = new HarmonyRequestController(host)

            await controller.startJob({
                harmonyRequest: makeHarmonyRequest(),
                options: { bearerToken: 'token' },
            })

            expect(controller.jobId).to.equal('in-flight-job')
            expect(requestUpdateSpy.called).to.be.true
        })
    })
})
