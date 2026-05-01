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
        it('should create a job with absolute harmony request URL', async () => {
            apiGetStub.resolves({ id: 'job-1' })

            await harmonyApi.createJob(
                {
                    requestUrl:
                        'https://harmony.earthdata.nasa.gov/C123/ogc-api-coverages/1.0.0/rangeset?subset=lat(0:1)',
                } as any,
                { bearerToken: 'test-token' },
            )

            expect(apiGetStub.calledOnce).to.be.true
            expect(apiGetStub.firstCall.args[0]).to.equal(
                'https://harmony.earthdata.nasa.gov/C123/ogc-api-coverages/1.0.0/rangeset?subset=lat(0:1)',
            )
            expect(apiGetStub.firstCall.args[1]).to.deep.equal({
                signal: undefined,
                headers: {
                    Authorization: 'Bearer test-token',
                },
            })
        })

        it('should request job status from PROD URL when authenticated', async () => {
            apiGetStub.resolves({ status: 'running' })

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
