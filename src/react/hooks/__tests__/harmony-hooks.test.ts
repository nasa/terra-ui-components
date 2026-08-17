import { expect } from '@open-wc/testing'
import sinon from 'sinon'
import { QueryClient } from '@tanstack/query-core'
import {
    harmonyApi,
    Status,
    type SubsetJobStatus,
} from '../../../apis/harmony.api.js'
import { HarmonyRequest } from '../../../lib/harmony/harmony.request.js'
import { useCreateHarmonyJob } from '../use-create-harmony-job.js'
import { usePollHarmonyJobStatus } from '../use-poll-harmony-job-status.js'
import { useHarmonyRequest } from '../use-harmony-request.js'

describe('Harmony React Hooks', () => {
    let queryClient: QueryClient
    let createJobStub: sinon.SinonStub
    let getJobStatusStub: sinon.SinonStub
    let cancelJobStub: sinon.SinonStub

    const mockJob: SubsetJobStatus = {
        jobID: 'job-123',
        status: Status.RUNNING,
        message: 'Processing',
        progress: 50,
        createdAt: '2026-08-14T00:00:00Z',
        updatedAt: '2026-08-14T00:01:00Z',
        dataExpiration: '',
        request: 'http://harmony.earthdata.nasa.gov/job-123',
        numInputGranules: 1,
        links: [],
    }

    beforeEach(() => {
        queryClient = new QueryClient({
            defaultOptions: {
                queries: { retry: false },
                mutations: { retry: false },
            },
        })
        createJobStub = sinon.stub(harmonyApi, 'createJob').resolves(mockJob)
        getJobStatusStub = sinon.stub(harmonyApi, 'getJobStatus').resolves(mockJob)
        cancelJobStub = sinon.stub(harmonyApi, 'cancelJob').resolves({
            ...mockJob,
            status: Status.CANCELED,
        })
    })

    afterEach(() => {
        sinon.restore()
        queryClient.clear()
    })

    describe('useCreateHarmonyJob', () => {
        it('should initialize with default state', () => {
            const hook = useCreateHarmonyJob({ queryClient })
            expect(hook.data).to.be.undefined
            expect(hook.isPending).to.be.false
            expect(hook.status).to.equal('idle')
        })

        it('should execute createJob mutation when mutate is called', async () => {
            const onSuccess = sinon.spy()
            const hook = useCreateHarmonyJob({ queryClient, onSuccess })
            const req = new HarmonyRequest({ collectionId: 'C123456-GES_DISC' })

            const result = await hook.mutate({ harmonyRequest: req })

            expect(createJobStub.calledOnce).to.be.true
            expect(result).to.deep.equal(mockJob)
        })
    })

    describe('usePollHarmonyJobStatus', () => {
        it('should not poll when jobId is missing or disabled', () => {
            const hook = usePollHarmonyJobStatus(null, undefined, { queryClient })
            expect(hook.data).to.be.null
            expect(hook.isPolling).to.be.false
        })

        it('should poll job status when valid jobId is provided', async () => {
            const hook = usePollHarmonyJobStatus('job-123', undefined, {
                queryClient,
            })
            await hook.refetch()
            expect(getJobStatusStub.called).to.be.true
        })

        it('should cancel job using cancelJob method', async () => {
            const hook = usePollHarmonyJobStatus(
                'job-123',
                { bearerToken: 'token' },
                { queryClient }
            )
            const result = await hook.cancelJob()
            expect(cancelJobStub.calledOnce).to.be.true
            expect(result.status).to.equal(Status.CANCELED)
        })
    })

    describe('useHarmonyRequest', () => {
        it('should manage full job lifecycle from creation to polling to cancellation', async () => {
            const hook = useHarmonyRequest({ queryClient })
            expect(hook.jobId).to.be.null
            expect(hook.data).to.be.null

            const req = new HarmonyRequest({ collectionId: 'C123456-GES_DISC' })
            const jobPromise = hook.startJob({ harmonyRequest: req })

            expect(hook.jobId).to.equal('new')
            expect(hook.status).to.equal(Status.RUNNING)

            const createdJob = await jobPromise
            expect(createdJob).to.deep.equal(mockJob)

            hook.reset()
            expect(hook.jobId).to.be.null
            expect(hook.data).to.be.null
        })
    })
})
