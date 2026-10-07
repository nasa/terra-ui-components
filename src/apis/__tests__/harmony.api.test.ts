import { harmonyApi } from '../harmony.api.js'
import { expect } from '@open-wc/testing'
import sinon from 'sinon'
import { apiClient } from '../../lib/api.client.js'
import { onlyGiovanniServices } from './fixtures/only-giovanni-services.js'
import { giovanniAndNetcdf } from './fixtures/giovanni-and-netcdf-services.js'
import { onlyNetcdf } from './fixtures/only-netcdf-service.js'
import { allServices } from './fixtures/all-services.js'

describe('HarmonyAPI', () => {
    let apiGetStub: sinon.SinonStub

    beforeEach(() => {
        apiGetStub = sinon.stub(apiClient, 'get')
    })

    afterEach(() => {
        sinon.restore()
    })

    describe('getCollectionCapabilities', () => {
        it('should throw if conceptId is missing', async () => {
            try {
                await harmonyApi.getCollectionCapabilities()
                expect.fail('Expected getCollectionCapabilities to throw')
            } catch (err: any) {
                expect(err?.message).to.equal(
                    '`collectionConceptId` is required',
                )
            }
        })

        it('should call capabilities endpoint with bearer token and version', async () => {
            apiGetStub.resolves(onlyNetcdf)

            const result = await harmonyApi.getCollectionCapabilities(
                onlyNetcdf.conceptId,
                { bearerToken: 'test-token' },
            )

            expect(apiGetStub.calledOnce).to.be.true
            expect(apiGetStub.firstCall.args[0]).to.equal(
                `https://harmony.earthdata.nasa.gov/capabilities?collectionId=${onlyNetcdf.conceptId}&version=3`,
            )
            expect(apiGetStub.firstCall.args[1]).to.deep.equal({
                signal: undefined,
                headers: {
                    Authorization: 'Bearer test-token',
                },
            })
            expect(result.configuredOutputFormats).to.deep.equal([
                {
                    key: 'application/x-netcdf4',
                    label: 'NetCDF',
                    description: 'Download data in NetCDF format',
                },
            ])
        })

        it('should call anonymous proxy when bearer token is not provided', async () => {
            apiGetStub.resolves(allServices)

            await harmonyApi.getCollectionCapabilities(allServices.conceptId)

            expect(apiGetStub.calledOnce).to.be.true
            expect(apiGetStub.firstCall.args[0]).to.equal(
                `https://sjldutoe6c.execute-api.us-east-1.amazonaws.com/default/harmony-proxy/capabilities?collectionId=${allServices.conceptId}&version=3`,
            )
            expect(apiGetStub.firstCall.args[1]).to.deep.equal({
                signal: undefined,
                headers: {},
            })
        })

        it('should add conceptId to variables based on href when missing', async () => {
            const responseWithoutConceptIds = {
                ...onlyNetcdf,
                variables: onlyNetcdf.variables.map((variable) => ({
                    ...variable,
                    conceptId: '',
                })),
            }

            apiGetStub.resolves(responseWithoutConceptIds)

            const result = await harmonyApi.getCollectionCapabilities(
                onlyNetcdf.conceptId,
                { bearerToken: 'token' },
            )

            expect(result.variables[0].conceptId).to.equal(
                'V2778423892-GES_DISC',
            )
            expect(result.variables[1].conceptId).to.equal(
                'V2778427374-GES_DISC',
            )
        })
    })

    describe('job endpoints', () => {
        // createJob fetches directly (rather than through apiClient) so it can inspect
        // the raw response for a job-creation redirect; stub `fetch` for these tests.
        function stubFetchJson(body: unknown) {
            return sinon.stub(globalThis, 'fetch').resolves(
                new Response(JSON.stringify(body), {
                    status: 200,
                    headers: { 'Content-Type': 'application/json' },
                }),
            )
        }

        it('should create a job with absolute harmony request URL', async () => {
            const fetchStub = stubFetchJson({ id: 'job-1' })

            await harmonyApi.createJob(
                {
                    requestUrl:
                        'https://harmony.earthdata.nasa.gov/C123/ogc-api-coverages/1.0.0/rangeset?subset=lat(0:1)',
                } as any,
                { bearerToken: 'test-token' },
            )

            expect(fetchStub.calledOnce).to.be.true
            expect(fetchStub.firstCall.args[0]).to.equal(
                'https://harmony.earthdata.nasa.gov/C123/ogc-api-coverages/1.0.0/rangeset?subset=lat(0:1)',
            )
            expect(fetchStub.firstCall.args[1]).to.deep.equal({
                method: 'GET',
                headers: {
                    Authorization: 'Bearer test-token',
                },
                body: undefined,
                signal: undefined,
            })
        })

        it('should route createJob through the anonymous proxy when no bearer token is provided', async () => {
            const fetchStub = stubFetchJson({ id: 'job-anon' })

            await harmonyApi.createJob({
                hasShape: false,
                requestUrl:
                    'https://harmony.earthdata.nasa.gov/C123/ogc-api-coverages/1.0.0/rangeset?subset=lat(0:1)',
            } as any)

            expect(fetchStub.calledOnce).to.be.true
            expect(fetchStub.firstCall.args[0]).to.equal(
                'https://sjldutoe6c.execute-api.us-east-1.amazonaws.com/default/harmony-proxy/C123/ogc-api-coverages/1.0.0/rangeset?subset=lat(0:1)',
            )
            expect(fetchStub.firstCall.args[1]).to.deep.equal({
                method: 'GET',
                headers: {},
                body: undefined,
                signal: undefined,
            })
        })

        it('follows a job-creation redirect by fetching the job it points to', async () => {
            const fetchStub = sinon.stub(globalThis, 'fetch')
            fetchStub.onFirstCall().resolves(
                new Response(null, {
                    status: 303,
                    headers: {
                        Location:
                            'https://harmony.earthdata.nasa.gov/jobs/job-1',
                    },
                }),
            )
            apiGetStub.resolves({
                jobID: 'job-1',
                status: 'running',
                links: [],
            })

            const result = await harmonyApi.createJob(
                {
                    hasShape: false,
                    requestUrl:
                        'https://harmony.earthdata.nasa.gov/C123/ogc-api-coverages/1.0.0/rangeset?subset=lat(0:1)',
                } as any,
                { bearerToken: 'test-token' },
            )

            expect(fetchStub.calledOnce).to.be.true
            // falls through to getJobStatus, which goes through apiClient.get
            expect(apiGetStub.calledOnce).to.be.true
            expect(apiGetStub.firstCall.args[0]).to.equal(
                'https://harmony.earthdata.nasa.gov/jobs/job-1',
            )
            expect(result).to.deep.equal({
                jobID: 'job-1',
                status: 'running',
                links: [],
            })
        })

        it('throws an HttpException for a redirect whose Location does not point at a job', async () => {
            sinon.stub(globalThis, 'fetch').resolves(
                new Response(null, {
                    status: 303,
                    headers: { Location: 'https://example.com/not-a-job' },
                }),
            )

            try {
                await harmonyApi.createJob({
                    hasShape: false,
                    requestUrl:
                        'https://harmony.earthdata.nasa.gov/C123/ogc-api-coverages/1.0.0/rangeset?subset=lat(0:1)',
                } as any)
                expect.fail('Expected createJob to throw')
            } catch (err: any) {
                expect(err.status).to.equal(303)
            }
        })

        it('throws an HttpException with the server message for a non-redirect error response', async () => {
            sinon.stub(globalThis, 'fetch').resolves(
                new Response(
                    JSON.stringify({
                        description: 'No matching granules found.',
                    }),
                    {
                        status: 400,
                        headers: { 'Content-Type': 'application/json' },
                    },
                ),
            )

            try {
                await harmonyApi.createJob({
                    hasShape: false,
                    requestUrl:
                        'https://harmony.earthdata.nasa.gov/C123/ogc-api-coverages/1.0.0/rangeset?subset=lat(0:1)',
                } as any)
                expect.fail('Expected createJob to throw')
            } catch (err: any) {
                expect(err.status).to.equal(400)
                expect(err.message).to.equal('No matching granules found.')
            }
        })

        it('should request job status from PROD URL when authenticated', async () => {
            apiGetStub.resolves({ status: 'running', links: [] })

            await harmonyApi.getJobStatus('abc123', {
                bearerToken: 'token',
            })

            expect(apiGetStub.calledOnce).to.be.true
            expect(apiGetStub.firstCall.args[0]).to.equal(
                'https://harmony.earthdata.nasa.gov/jobs/abc123',
            )
        })

        it('should request cancel endpoint via anonymous proxy when unauthenticated', async () => {
            apiGetStub.resolves({ status: 'canceled' })

            await harmonyApi.cancelJob('abc123')

            expect(apiGetStub.calledOnce).to.be.true
            expect(apiGetStub.firstCall.args[0]).to.equal(
                'https://sjldutoe6c.execute-api.us-east-1.amazonaws.com/default/harmony-proxy/jobs/abc123/cancel',
            )
        })

        it('should request resume endpoint from PROD URL when authenticated', async () => {
            apiGetStub.resolves({ status: 'running' })

            await harmonyApi.resumeJob('abc123', { bearerToken: 'test-token' })

            expect(apiGetStub.calledOnce).to.be.true
            expect(apiGetStub.firstCall.args[0]).to.equal(
                'https://harmony.earthdata.nasa.gov/jobs/abc123/resume',
            )
        })

        it('should request resume endpoint via anonymous proxy when unauthenticated', async () => {
            apiGetStub.resolves({ status: 'running' })

            await harmonyApi.resumeJob('abc123')

            expect(apiGetStub.calledOnce).to.be.true
            expect(apiGetStub.firstCall.args[0]).to.equal(
                'https://sjldutoe6c.execute-api.us-east-1.amazonaws.com/default/harmony-proxy/jobs/abc123/resume',
            )
        })

        describe('getJobs', () => {
            it('should request the jobs endpoint with no query params by default', async () => {
                apiGetStub.resolves({ count: 0, jobs: [], links: [] })

                await harmonyApi.getJobs(undefined, { bearerToken: 'token' })

                expect(apiGetStub.calledOnce).to.be.true
                expect(apiGetStub.firstCall.args[0]).to.equal(
                    'https://harmony.earthdata.nasa.gov/jobs?',
                )
            })

            it('should include page, limit, and label query params when provided', async () => {
                apiGetStub.resolves({ count: 0, jobs: [], links: [] })

                await harmonyApi.getJobs(
                    { page: 2, limit: 50, label: 'terra-time-average-map' },
                    { bearerToken: 'token' },
                )

                expect(apiGetStub.calledOnce).to.be.true
                expect(apiGetStub.firstCall.args[0]).to.equal(
                    'https://harmony.earthdata.nasa.gov/jobs?page=2&limit=50&label=terra-time-average-map',
                )
            })

            it('should route through the anonymous proxy when no bearer token is provided', async () => {
                apiGetStub.resolves({ count: 0, jobs: [], links: [] })

                await harmonyApi.getJobs({ limit: 10 })

                expect(apiGetStub.calledOnce).to.be.true
                expect(apiGetStub.firstCall.args[0]).to.equal(
                    'https://sjldutoe6c.execute-api.us-east-1.amazonaws.com/default/harmony-proxy/jobs?limit=10',
                )
            })
        })
    })

    describe('output format options', () => {
        it('should return NetCDF output formats if only NetCDF services available', () => {
            expect(
                harmonyApi.getOutputFormatOptions(onlyNetcdf as any),
            ).to.deep.equal([
                {
                    key: 'application/x-netcdf4',
                    label: 'NetCDF',
                    description: 'Download data in NetCDF format',
                },
            ])
        })

        it('should include non-Giovanni formats when both Giovanni and non-Giovanni services are available', () => {
            expect(
                harmonyApi.getOutputFormatOptions(giovanniAndNetcdf as any),
            ).to.deep.equal([
                {
                    key: 'application/x-netcdf4',
                    label: 'NetCDF',
                    description: 'Download data in NetCDF format',
                },
                {
                    key: 'text/csv',
                    label: 'CSV (point-based time series; one file)',
                    description: 'Single variable plotted over time',
                    isGiovanniFormat: true,
                },
                {
                    key: 'image/tiff',
                    label: 'GeoTIFF (time-averaged map; one file)',
                    description: 'Time averaged representation as map',
                    isGiovanniFormat: true,
                },
                {
                    key: 'text/csv',
                    label: 'CSV (area-averaged time series; one file)',
                    description: 'Area averaged data over time',
                    isGiovanniFormat: true,
                },
            ])
        })

        it('should include only Giovanni output formats when only Giovanni services are available', () => {
            expect(
                harmonyApi.getOutputFormatOptions(onlyGiovanniServices as any),
            ).to.deep.equal([
                {
                    key: 'text/csv',
                    label: 'CSV (point-based time series; one file)',
                    description: 'Single variable plotted over time',
                    isGiovanniFormat: true,
                },
                {
                    key: 'image/tiff',
                    label: 'GeoTIFF (time-averaged map; one file)',
                    description: 'Time averaged representation as map',
                    isGiovanniFormat: true,
                },
                {
                    key: 'text/csv',
                    label: 'CSV (area-averaged time series; one file)',
                    description: 'Area averaged data over time',
                    isGiovanniFormat: true,
                },
            ])
        })

        it('should include return point-based time series CSV when the giovanni-time-series adapter is the only Giovanni service', () => {
            const onlyTimeSeriesAdapter = {
                ...onlyGiovanniServices,
                services: onlyGiovanniServices.services.filter(
                    (service) =>
                        service.name === 'giovanni-time-series-adapter',
                ),
            }

            expect(
                harmonyApi.getOutputFormatOptions(onlyTimeSeriesAdapter as any),
            ).to.deep.equal([
                {
                    key: 'text/csv',
                    label: 'CSV (point-based time series; one file)',
                    description: 'Single variable plotted over time',
                    isGiovanniFormat: true,
                },
            ])
        })

        it('should include return area-averaged CSV and TIFF when the giovanni-averaging-service adapter is the only Giovanni service', () => {
            const onlyAveragingAdapter = {
                ...onlyGiovanniServices,
                services: onlyGiovanniServices.services.filter(
                    (service) => service.name === 'giovanni-averaging-service',
                ),
            }

            expect(
                harmonyApi.getOutputFormatOptions(onlyAveragingAdapter as any),
            ).to.deep.equal([
                {
                    key: 'image/tiff',
                    label: 'GeoTIFF (time-averaged map; one file)',
                    description: 'Time averaged representation as map',
                    isGiovanniFormat: true,
                },
                {
                    key: 'text/csv',
                    label: 'CSV (area-averaged time series; one file)',
                    description: 'Area averaged data over time',
                    isGiovanniFormat: true,
                },
            ])
        })

        it('should include csv from non-Giovanni service and deduplicate netcdf variants', () => {
            const nonGiovanniServices = {
                ...allServices,
                services: allServices.services.filter(
                    (service) =>
                        !service.name.toLowerCase().includes('giovanni'),
                ),
            }

            expect(
                harmonyApi.getOutputFormatOptions(nonGiovanniServices as any),
            ).to.deep.equal([
                {
                    key: 'text/csv',
                    label: 'CSV',
                    description: 'Download data in CSV format',
                },
                {
                    key: 'application/x-netcdf4',
                    label: 'NetCDF',
                    description: 'Download data in NetCDF format',
                },
            ])
        })

        it('should include csv from non-Giovanni service and CSV from Giovanni and deduplicate netcdf variants', () => {
            expect(
                harmonyApi.getOutputFormatOptions(allServices as any),
            ).to.deep.equal([
                {
                    key: 'text/csv',
                    label: 'CSV',
                    description: 'Download data in CSV format',
                },
                {
                    key: 'application/x-netcdf4',
                    label: 'NetCDF',
                    description: 'Download data in NetCDF format',
                },
                {
                    key: 'text/csv',
                    label: 'CSV (point-based time series; one file)',
                    description: 'Single variable plotted over time',
                    isGiovanniFormat: true,
                },
                {
                    key: 'image/tiff',
                    label: 'GeoTIFF (time-averaged map; one file)',
                    description: 'Time averaged representation as map',
                    isGiovanniFormat: true,
                },
                {
                    key: 'text/csv',
                    label: 'CSV (area-averaged time series; one file)',
                    description: 'Area averaged data over time',
                    isGiovanniFormat: true,
                },
            ])
        })
    })
})
