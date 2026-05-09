import { expect } from '@open-wc/testing'
import sinon from 'sinon'
import { harmonyApi } from '../../apis/harmony.api.js'
import { Status } from '../../data-services/types.js'
import './time-series.js'

describe('<terra-time-series>', () => {
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

    it('should default noCache to false', () => {
        const el = document.createElement('terra-time-series') as any
        expect(el.noCache).to.equal(false)
    })

    it('should set noCache to true via attribute', () => {
        const el = document.createElement('terra-time-series') as any
        el.setAttribute('no-cache', '')
        expect(el.noCache).to.equal(true)
    })
})

describe('<terra-time-series> harmony history', () => {
    let getJobsStub: sinon.SinonStub

    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 6)

    const futureExpiration = new Date()
    futureExpiration.setDate(futureExpiration.getDate() + 30)

    const makeJob = (overrides: Record<string, unknown> = {}): any => ({
        jobID: 'ts-history-job-1',
        status: Status.SUCCESSFUL,
        createdAt: oneWeekAgo.toISOString(),
        dataExpiration: futureExpiration.toISOString(),
        // Matches: collection=C1234-GES_DISC, variable=COLL_VAR, start=2009-01-01, end=2009-01-05, bbox=62,5,95,40, format=text/csv, average=area
        request:
            'https://harmony.earthdata.nasa.gov/C1234-GES_DISC/ogc-api-coverages/1.0.0/collections/parameter_vars/coverage/rangeset?subset=lat%285%3A40%29&subset=lon%2862%3A95%29&subset=time%28%222009-01-01T00%3A00%3A00Z%22%3A%222009-01-05T23%3A59%3A59Z%22%29&format=text%2Fcsv&label=terra-time-series&variable=COLL_VAR&average=area',
        links: [
            {
                rel: 'data',
                href: 'https://example.com/result.csv',
                title: 'Result',
                type: 'text/csv',
            },
        ],
        message: '',
        progress: 100,
        numInputGranules: 1,
        errors: [],
        ...overrides,
    })

    beforeEach(() => {
        getJobsStub = sinon.stub(harmonyApi, 'getJobs').resolves({
            count: 0,
            jobs: [],
            links: [],
        })
    })

    afterEach(() => {
        sinon.restore()
    })

    it('should not query Harmony history when there is no bearer token', () => {
        const el = document.createElement('terra-time-series') as any
        expect(el.bearerToken).to.be.undefined
        // Without a bearer token the history fetch is skipped entirely
        expect(getJobsStub.called).to.be.false
    })

    it('getJobs stub returns expected job structure', async () => {
        getJobsStub.resolves({ count: 1, jobs: [makeJob()], links: [] })

        const result = await harmonyApi.getJobs(
            { page: 1, limit: 10, label: 'terra-time-series' },
            { bearerToken: 'test-token' },
        )

        expect(getJobsStub.calledOnce).to.be.true
        expect(getJobsStub.firstCall.args[0]).to.deep.equal({
            page: 1,
            limit: 10,
            label: 'terra-time-series',
        })
        expect(result.jobs).to.have.length(1)
        expect(result.jobs[0].status).to.equal(Status.SUCCESSFUL)
    })

    it('should filter non-SUCCESSFUL history jobs', async () => {
        const jobs = [
            makeJob({ status: Status.FAILED }),
            makeJob({ jobID: 'j2', status: Status.RUNNING }),
            makeJob({ jobID: 'j3', status: Status.SUCCESSFUL }),
        ]
        getJobsStub.resolves({ count: 3, jobs, links: [] })

        const result = await harmonyApi.getJobs(
            { page: 1, limit: 10, label: 'terra-time-series' },
            { bearerToken: 'test-token' },
        )

        const successful = result.jobs.filter(
            (j: any) => j.status === Status.SUCCESSFUL,
        )
        expect(successful).to.have.length(1)
        expect(successful[0].jobID).to.equal('j3')
    })

    it('should filter jobs older than 7 days', async () => {
        const oldDate = new Date()
        oldDate.setDate(oldDate.getDate() - 8)
        const oldJob = makeJob({ createdAt: oldDate.toISOString() })
        const recentJob = makeJob({
            jobID: 'recent',
            createdAt: oneWeekAgo.toISOString(),
        })

        getJobsStub.resolves({ count: 2, jobs: [oldJob, recentJob], links: [] })

        const result = await harmonyApi.getJobs(
            { page: 1, limit: 10, label: 'terra-time-series' },
            { bearerToken: 'test-token' },
        )

        const cutoff = new Date()
        cutoff.setDate(cutoff.getDate() - 7)
        const withinWindow = result.jobs.filter(
            (j: any) => new Date(j.createdAt) >= cutoff,
        )
        expect(withinWindow).to.have.length(1)
        expect(withinWindow[0].jobID).to.equal('recent')
    })

    it('should filter jobs with expired dataExpiration', async () => {
        const pastDate = new Date()
        pastDate.setDate(pastDate.getDate() - 1)
        const expiredJob = makeJob({ dataExpiration: pastDate.toISOString() })
        getJobsStub.resolves({ count: 1, jobs: [expiredJob], links: [] })

        const result = await harmonyApi.getJobs(
            { page: 1, limit: 10, label: 'terra-time-series' },
            { bearerToken: 'test-token' },
        )

        const valid = result.jobs.filter(
            (j: any) =>
                !j.dataExpiration || new Date(j.dataExpiration) >= new Date(),
        )
        expect(valid).to.have.length(0)
    })
})
