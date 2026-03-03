import DataSubsetterService from '../data-subsetter.service.js'
import { expect } from '@open-wc/testing'
import { onlyGiovanniServices } from './fixtures/only-giovanni-services.js'
import { giovanniAndNetcdf } from './fixtures/giovanni-and-netcdf.js'
import { onlyNetcdf } from './fixtures/netcdf.js'
import { allServices } from './fixtures/all-services.js'

describe('DataSubsetterService', () => {
    let service: DataSubsetterService
    const makeGranule = (
        beginningDateTime?: string,
        endingDateTime?: string,
        granuleCount?: number
    ) =>
        ({
            hits: granuleCount,
            umm: {
                TemporalExtent: {
                    RangeDateTime: {
                        BeginningDateTime: beginningDateTime,
                        EndingDateTime: endingDateTime,
                    },
                },
            },
        }) as any

    const makeCollection = (
        west?: number,
        south?: number,
        east?: number,
        north?: number
    ) =>
        ({
            umm: {
                SpatialExtent: {
                    HorizontalSpatialDomain: {
                        Geometry: {
                            BoundingRectangles: [
                                {
                                    WestBoundingCoordinate: west,
                                    SouthBoundingCoordinate: south,
                                    EastBoundingCoordinate: east,
                                    NorthBoundingCoordinate: north,
                                },
                            ],
                        },
                    },
                },
            },
        }) as any

    const makeTemporalCollection = (
        granuleCount?: number,
        beginningDateTime?: string,
        endingDateTime?: string
    ) =>
        ({
            meta: {
                'granule-count': granuleCount,
            },
            umm: {
                TemporalExtents: [
                    {
                        RangeDateTimes: [
                            {
                                BeginningDateTime: beginningDateTime,
                                EndingDateTime: endingDateTime,
                            },
                        ],
                    },
                ],
            },
        }) as any

    beforeEach(() => {
        service = new DataSubsetterService()
    })

    describe('getConfiguredSubsetOptions', () => {
        it('should return NetCDF output formats if only NetCDF services available', async () => {
            const configuredSubsetOptions = service.getConfiguredSubsetOptions(
                {},
                undefined,
                undefined,
                onlyNetcdf
            )

            expect(configuredSubsetOptions.outputFormats).to.deep.equal([
                {
                    key: 'application/x-netcdf4',
                    label: 'NetCDF',
                    description: 'Download data in NetCDF format',
                },
            ])
        })

        it('should return Giovanni output formats if only Giovanni services available', async () => {
            const configuredSubsetOptions = service.getConfiguredSubsetOptions(
                {},
                undefined,
                undefined,
                onlyGiovanniServices
            )

            expect(configuredSubsetOptions.outputFormats).to.deep.equal([
                {
                    key: 'text/csv',
                    label: 'Time Series Plot (CSV)',
                    description: 'Single variable plotted over time',
                },
                {
                    key: 'image/tiff',
                    label: 'Time Averaged Map (TIFF)',
                    description: 'Time averaged representation as map',
                },
                {
                    key: 'text/csv',
                    label: 'Area Averaged Time Series (CSV)',
                    description: 'Area averaged data over time',
                },
            ])
        })

        it('should return Giovanni output formats if Giovanni services are present with other services', async () => {
            const configuredSubsetOptions = service.getConfiguredSubsetOptions(
                {},
                undefined,
                undefined,
                giovanniAndNetcdf
            )

            expect(configuredSubsetOptions.outputFormats).to.deep.equal([
                {
                    key: 'application/x-netcdf4',
                    label: 'NetCDF',
                    description: 'Download data in NetCDF format',
                },
                {
                    key: 'text/csv',
                    label: 'Time Series Plot (CSV)',
                    description: 'Single variable plotted over time',
                },
                {
                    key: 'image/tiff',
                    label: 'Time Averaged Map (TIFF)',
                    description: 'Time averaged representation as map',
                },
                {
                    key: 'text/csv',
                    label: 'Area Averaged Time Series (CSV)',
                    description: 'Area averaged data over time',
                },
            ])
        })

        it('should return CSV and Giovanni output formats if overlapping CSV output formats are present', async () => {
            const configuredSubsetOptions = service.getConfiguredSubsetOptions(
                {},
                undefined,
                undefined,
                allServices
            )

            expect(configuredSubsetOptions.outputFormats).to.deep.equal([
                {
                    description: 'Download data in CSV format',
                    key: 'text/csv',
                    label: 'CSV',
                },
                {
                    key: 'application/x-netcdf4',
                    label: 'NetCDF',
                    description: 'Download data in NetCDF format',
                },
                {
                    key: 'text/csv',
                    label: 'Time Series Plot (CSV)',
                    description: 'Single variable plotted over time',
                },
                {
                    key: 'image/tiff',
                    label: 'Time Averaged Map (TIFF)',
                    description: 'Time averaged representation as map',
                },
                {
                    key: 'text/csv',
                    label: 'Area Averaged Time Series (CSV)',
                    description: 'Area averaged data over time',
                },
            ])
        })

        it('should mark hasGranules true when first granule count is greater than zero', async () => {
            const configuredSubsetOptions = service.getConfiguredSubsetOptions(
                {},
                makeGranule(undefined, undefined, 3),
                undefined,
                onlyNetcdf
            )

            expect(configuredSubsetOptions.hasGranules).to.equal(true)
        })

        it('should mark hasGranules false when first granule count is zero', async () => {
            const configuredSubsetOptions = service.getConfiguredSubsetOptions(
                {},
                makeGranule(undefined, undefined, 0),
                undefined,
                onlyNetcdf
            )

            expect(configuredSubsetOptions.hasGranules).to.equal(false)
        })

        it('should mark hasGranules false when first granule is missing', async () => {
            const configuredSubsetOptions = service.getConfiguredSubsetOptions(
                {},
                undefined,
                undefined,
                onlyNetcdf
            )

            expect(configuredSubsetOptions.hasGranules).to.equal(false)
        })

        it('should disable temporal subsetting when collection temporal subset is false', async () => {
            const configuredSubsetOptions = service.getConfiguredSubsetOptions(
                {},
                undefined,
                undefined,
                {
                    temporalSubset: false,
                    services: [
                        {
                            name: 'foo-service',
                            href: 'https://example.com',
                            capabilities: {
                                subsetting: {
                                    temporal: true,
                                },
                                output_formats: ['text/csv'],
                            },
                        },
                    ],
                } as any
            )

            expect(configuredSubsetOptions.temporalSubsetting.enabled).to.equal(false)
        })

        it('should enable temporal subsetting when collection allows temporal subset and no format is selected', async () => {
            const configuredSubsetOptions = service.getConfiguredSubsetOptions(
                {},
                undefined,
                undefined,
                onlyNetcdf
            )

            expect(configuredSubsetOptions.temporalSubsetting.enabled).to.equal(true)
        })

        it('should enable temporal subsetting when selected format supports temporal subset', async () => {
            const configuredSubsetOptions = service.getConfiguredSubsetOptions(
                {
                    format: 'application/x-netcdf4',
                },
                undefined,
                undefined,
                onlyNetcdf
            )

            expect(configuredSubsetOptions.temporalSubsetting.enabled).to.equal(true)
        })

        it('should disable temporal subsetting when selected format lacks temporal subset support', async () => {
            const configuredSubsetOptions = service.getConfiguredSubsetOptions(
                {
                    format: 'text/csv',
                },
                undefined,
                undefined,
                {
                    temporalSubset: true,
                    services: [
                        {
                            name: 'csv-service',
                            href: 'https://example.com',
                            capabilities: {
                                subsetting: {
                                    temporal: false,
                                },
                                output_formats: ['text/csv'],
                            },
                        },
                    ],
                } as any
            )

            expect(configuredSubsetOptions.temporalSubsetting.enabled).to.equal(false)
        })

        it('should disable spatial subsetting when collection has no bbox or shape support', async () => {
            const configuredSubsetOptions = service.getConfiguredSubsetOptions(
                {},
                undefined,
                undefined,
                {
                    bboxSubset: false,
                    shapeSubset: false,
                    services: [
                        {
                            name: 'bbox-service',
                            href: 'https://example.com',
                            capabilities: {
                                subsetting: {
                                    bbox: true,
                                },
                                output_formats: ['application/x-netcdf4'],
                            },
                        },
                    ],
                } as any
            )

            expect(configuredSubsetOptions.spatialSubsetting.enabled).to.equal(false)
        })

        it('should enable spatial subsetting when collection supports bbox/shape and no format is selected', async () => {
            const configuredSubsetOptions = service.getConfiguredSubsetOptions(
                {},
                undefined,
                undefined,
                {
                    bboxSubset: true,
                    shapeSubset: false,
                    services: [],
                } as any
            )

            expect(configuredSubsetOptions.spatialSubsetting.enabled).to.equal(true)
            expect(configuredSubsetOptions.spatialSubsetting.bboxSubset).to.equal(
                true
            )
            expect(configuredSubsetOptions.spatialSubsetting.shapeSubset).to.equal(
                false
            )
        })

        it('should enable spatial subsetting when selected format supports bbox or shape subsetting', async () => {
            const configuredSubsetOptions = service.getConfiguredSubsetOptions(
                {
                    format: 'application/x-netcdf4',
                },
                undefined,
                undefined,
                {
                    bboxSubset: true,
                    shapeSubset: true,
                    services: [
                        {
                            name: 'spatial-service',
                            href: 'https://example.com',
                            capabilities: {
                                subsetting: {
                                    bbox: true,
                                    shape: false,
                                },
                                output_formats: ['application/x-netcdf4'],
                            },
                        },
                    ],
                } as any
            )

            expect(configuredSubsetOptions.spatialSubsetting.enabled).to.equal(true)
            expect(configuredSubsetOptions.spatialSubsetting.bboxSubset).to.equal(
                true
            )
            expect(configuredSubsetOptions.spatialSubsetting.shapeSubset).to.equal(
                false
            )
        })

        it('should enable spatial subsetting when selected format supports shape only', async () => {
            const configuredSubsetOptions = service.getConfiguredSubsetOptions(
                {
                    format: 'application/x-hdf',
                },
                undefined,
                undefined,
                {
                    bboxSubset: true,
                    shapeSubset: true,
                    services: [
                        {
                            name: 'shape-service',
                            href: 'https://example.com',
                            capabilities: {
                                subsetting: {
                                    bbox: false,
                                    shape: true,
                                },
                                output_formats: ['application/x-hdf'],
                            },
                        },
                    ],
                } as any
            )

            expect(configuredSubsetOptions.spatialSubsetting.enabled).to.equal(true)
            expect(configuredSubsetOptions.spatialSubsetting.bboxSubset).to.equal(
                false
            )
            expect(configuredSubsetOptions.spatialSubsetting.shapeSubset).to.equal(
                true
            )
        })

        it('should disable spatial subsetting when selected format lacks bbox/shape support', async () => {
            const configuredSubsetOptions = service.getConfiguredSubsetOptions(
                {
                    format: 'text/csv',
                },
                undefined,
                undefined,
                {
                    bboxSubset: true,
                    shapeSubset: true,
                    services: [
                        {
                            name: 'csv-service',
                            href: 'https://example.com',
                            capabilities: {
                                subsetting: {
                                    bbox: false,
                                    shape: false,
                                },
                                output_formats: ['text/csv'],
                            },
                        },
                    ],
                } as any
            )

            expect(configuredSubsetOptions.spatialSubsetting.enabled).to.equal(false)
        })

        it('should default bbox and shape flags to false when capabilities are missing', async () => {
            const configuredSubsetOptions = service.getConfiguredSubsetOptions(
                {},
                undefined,
                undefined,
                {
                    services: [],
                } as any
            )

            expect(configuredSubsetOptions.spatialSubsetting.bboxSubset).to.equal(
                false
            )
            expect(configuredSubsetOptions.spatialSubsetting.shapeSubset).to.equal(
                false
            )
        })

        it('should enable time picker for sub-daily granules', async () => {
            const configuredSubsetOptions = service.getConfiguredSubsetOptions(
                {},
                makeGranule('2026-01-01T00:00:00Z', '2026-01-01T06:00:00Z'),
                undefined,
                onlyNetcdf
            )

            expect(
                configuredSubsetOptions.temporalSubsetting.timePickerEnabled
            ).to.equal(true)
        })

        it('should disable time picker for daily-or-longer granules', async () => {
            const configuredSubsetOptions = service.getConfiguredSubsetOptions(
                {},
                makeGranule('2026-01-01T00:00:00Z', '2026-01-02T00:00:00Z'),
                undefined,
                onlyNetcdf
            )

            expect(
                configuredSubsetOptions.temporalSubsetting.timePickerEnabled
            ).to.equal(false)
        })

        it('should set granule min/max dates from first and last granules', async () => {
            const configuredSubsetOptions = service.getConfiguredSubsetOptions(
                {},
                makeGranule('2026-01-01T00:00:00Z', '2026-01-01T06:00:00Z'),
                makeGranule('2026-01-31T00:00:00Z', '2026-01-31T18:00:00Z'),
                onlyNetcdf
            )

            expect(
                configuredSubsetOptions.temporalSubsetting.granuleMinDate
            ).to.equal('2026-01-01T00:00:00Z')
            expect(
                configuredSubsetOptions.temporalSubsetting.granuleMaxDate
            ).to.equal('2026-01-31T18:00:00Z')
        })

        it('should leave granule min/max dates undefined when granules are missing', async () => {
            const configuredSubsetOptions = service.getConfiguredSubsetOptions(
                {},
                undefined,
                undefined,
                onlyNetcdf
            )

            expect(
                configuredSubsetOptions.temporalSubsetting.granuleMinDate
            ).to.equal(undefined)
            expect(
                configuredSubsetOptions.temporalSubsetting.granuleMaxDate
            ).to.equal(undefined)
        })

        it('should set spatial constraints from collection bounding rectangle', async () => {
            const configuredSubsetOptions = service.getConfiguredSubsetOptions(
                {},
                undefined,
                undefined,
                {
                    bboxSubset: true,
                    services: [],
                } as any,
                makeCollection(-120, 30, -90, 50)
            )

            expect(
                configuredSubsetOptions.spatialSubsetting.spatialConstraints
                    .coordinates.westBoundingCoordinate
            ).to.equal(-120)
            expect(
                configuredSubsetOptions.spatialSubsetting.spatialConstraints
                    .coordinates.southBoundingCoordinate
            ).to.equal(30)
            expect(
                configuredSubsetOptions.spatialSubsetting.spatialConstraints
                    .coordinates.eastBoundingCoordinate
            ).to.equal(-90)
            expect(
                configuredSubsetOptions.spatialSubsetting.spatialConstraints
                    .coordinates.northBoundingCoordinate
            ).to.equal(50)
            expect(
                configuredSubsetOptions.spatialSubsetting.spatialConstraints
                    .coordinatesStr
            ).to.equal('-120, 30, -90, 50')
        })

        it('should use default spatial constraints when collection is missing', async () => {
            const configuredSubsetOptions = service.getConfiguredSubsetOptions(
                {},
                undefined,
                undefined,
                {
                    bboxSubset: true,
                    services: [],
                } as any
            )

            expect(
                configuredSubsetOptions.spatialSubsetting.spatialConstraints
                    .coordinates.westBoundingCoordinate
            ).to.equal(-180)
            expect(
                configuredSubsetOptions.spatialSubsetting.spatialConstraints
                    .coordinates.southBoundingCoordinate
            ).to.equal(-90)
            expect(
                configuredSubsetOptions.spatialSubsetting.spatialConstraints
                    .coordinates.eastBoundingCoordinate
            ).to.equal(180)
            expect(
                configuredSubsetOptions.spatialSubsetting.spatialConstraints
                    .coordinates.northBoundingCoordinate
            ).to.equal(90)
            expect(
                configuredSubsetOptions.spatialSubsetting.spatialConstraints
                    .coordinatesStr
            ).to.equal('-180, -90, 180, 90')
        })

        it('should include null estimatedJobSize when collection is missing', async () => {
            const configuredSubsetOptions = service.getConfiguredSubsetOptions(
                {
                    dateRange: {
                        startDate: '2026-01-01',
                        endDate: '2026-01-10',
                    },
                },
                undefined,
                undefined,
                onlyNetcdf
            )

            expect(configuredSubsetOptions.estimatedJobSize).to.equal(null)
        })

        it('should estimate job size from selected date range when collection is available', async () => {
            const configuredSubsetOptions = service.getConfiguredSubsetOptions(
                {
                    dateRange: {
                        startDate: '2026-01-01',
                        endDate: '2026-01-10',
                    },
                },
                undefined,
                undefined,
                onlyNetcdf,
                makeTemporalCollection(
                    31,
                    '2026-01-01T00:00:00Z',
                    '2026-01-31T23:59:59Z'
                )
            )

            expect(configuredSubsetOptions.estimatedJobSize).to.deep.equal({
                days: 10,
                links: 10,
            })
        })

        it('should estimate job size from collection range when no selected date range exists', async () => {
            const configuredSubsetOptions = service.getConfiguredSubsetOptions(
                {},
                undefined,
                undefined,
                onlyNetcdf,
                makeTemporalCollection(
                    62,
                    '2026-01-01T00:00:00Z',
                    '2026-01-31T23:59:59Z'
                )
            )

            expect(configuredSubsetOptions.estimatedJobSize).to.deep.equal({
                days: 31,
                links: 62,
            })
        })
    })
})
