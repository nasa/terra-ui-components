import {
    elementUpdated,
    expect,
    fixture,
    html,
    waitUntil,
} from '@open-wc/testing'
import { HarmonyRequestController } from '../../controllers/harmony-request.controller.js'
import { HttpException } from '../../exceptions/http.exception.js'
import { LatLng } from '../map/models/LatLng.js'
import { LatLngBounds } from '../map/models/LatLngBounds.js'
import './data-subsetter.js'
import type { HarmonyRequest } from '../../lib/harmony/harmony.request.js'

const getAccordionContent = (el: any) => {
    const accordions = Array.from(
        el.shadowRoot?.querySelectorAll('terra-accordion') ?? [],
    ) as Element[]

    const dimensionsAccordion = accordions.find((acc) =>
        acc.textContent?.includes('Select Dimensions:'),
    )

    return dimensionsAccordion?.querySelector('.accordion-content')
}

describe('<terra-data-subsetter> dimension intersection support', () => {
    it('renders common dimensions for all available variables when no variable selected', async () => {
        const el: any = await fixture(
            html`<terra-data-subsetter></terra-data-subsetter>`,
        )

        el.collectionWithServices = {
            conceptId: 'C1',
            shortName: 'S1',
            variableSubset: true,
            bboxSubset: false,
            temporalSubset: false,
            concatenate: false,
            reproject: false,
            capabilitiesVersion: '1',
            outputFormats: [],
            services: [],
            variables: [],
            collection: {
                ShortName: 'S1',
                Version: '1',
                granuleCount: 0,
                EntryTitle: 'Test',
                SpatialExtent: {
                    GranuleSpatialRepresentation: 'N/A',
                    HorizontalSpatialDomain: {
                        Geometry: {
                            CoordinateSystem: 'EPSG:4326',
                            BoundingRectangles: {
                                WestBoundingCoordinate: 0,
                                NorthBoundingCoordinate: 0,
                                EastBoundingCoordinate: 0,
                                SouthBoundingCoordinate: 0,
                            },
                        },
                    },
                },
                TemporalExtents: [],
            },
        }

        el.dataAccessMode = 'subset'

        el.variablesQuery = {
            result: {
                data: {
                    hits: 2,
                    items: [
                        {
                            umm: {
                                Name: 'var1',
                                Dimensions: [
                                    { Name: 'DimA', Size: 5, Type: 'OTHER' },
                                    {
                                        Name: 'time',
                                        Size: 10,
                                        Type: 'TIME_DIMENSION',
                                    },
                                ],
                            },
                        },
                        {
                            umm: {
                                Name: 'var2',
                                Dimensions: [
                                    { Name: 'DimA', Size: 5, Type: 'OTHER' },
                                    {
                                        Name: 'lat',
                                        Size: 180,
                                        Type: 'LATITUDE_DIMENSION',
                                    },
                                ],
                            },
                        },
                    ],
                },
            },
        }

        await elementUpdated(el)

        const accordionContent = getAccordionContent(el)

        expect(el.shadowRoot?.textContent).to.include('Select Dimensions:')
        expect(accordionContent?.textContent).to.include('DimA')
        expect(accordionContent?.textContent).to.not.include('time')
        expect(accordionContent?.textContent).to.not.include('lat')
    })

    it('shows union dimensions when one selected variable has no dimensions', async () => {
        const el: any = await fixture(
            html`<terra-data-subsetter></terra-data-subsetter>`,
        )

        el.collectionWithServices = {
            conceptId: 'C1',
            shortName: 'S1',
            variableSubset: true,
            bboxSubset: false,
            temporalSubset: false,
            concatenate: false,
            reproject: false,
            capabilitiesVersion: '1',
            outputFormats: [],
            services: [],
            variables: [],
            collection: {
                ShortName: 'S1',
                Version: '1',
                granuleCount: 0,
                EntryTitle: 'Test',
                SpatialExtent: {
                    GranuleSpatialRepresentation: 'N/A',
                    HorizontalSpatialDomain: {
                        Geometry: {
                            CoordinateSystem: 'EPSG:4326',
                            BoundingRectangles: {
                                WestBoundingCoordinate: 0,
                                NorthBoundingCoordinate: 0,
                                EastBoundingCoordinate: 0,
                                SouthBoundingCoordinate: 0,
                            },
                        },
                    },
                },
                TemporalExtents: [],
            },
        }

        el.dataAccessMode = 'subset'

        el.variablesQuery = {
            result: {
                data: {
                    hits: 2,
                    items: [
                        {
                            umm: {
                                Name: 'var1',
                                Dimensions: [],
                            },
                        },
                        {
                            umm: {
                                Name: 'var2',
                                Dimensions: [
                                    { Name: 'DimA', Size: 4, Type: 'OTHER' },
                                ],
                            },
                        },
                    ],
                },
            },
        }

        el.selectedVariables = [
            { name: 'var1', href: '', conceptId: 'C1' },
            { name: 'var2', href: '', conceptId: 'C2' },
        ]

        await elementUpdated(el)

        const accordionContent = getAccordionContent(el)

        expect(el.shadowRoot?.textContent).to.include('Select Dimensions:')
        expect(accordionContent?.textContent).to.include('DimA')
    })

    it('renders only common dimensions and excludes time/lat/lon', async () => {
        const el: any = await fixture(
            html`<terra-data-subsetter></terra-data-subsetter>`,
        )

        el.collectionWithServices = {
            conceptId: 'C1',
            shortName: 'S1',
            variableSubset: true,
            bboxSubset: false,
            temporalSubset: false,
            concatenate: false,
            reproject: false,
            capabilitiesVersion: '1',
            outputFormats: [],
            services: [],
            variables: [],
            collection: {
                ShortName: 'S1',
                Version: '1',
                granuleCount: 0,
                EntryTitle: 'Test',
                SpatialExtent: {
                    GranuleSpatialRepresentation: 'N/A',
                    HorizontalSpatialDomain: {
                        Geometry: {
                            CoordinateSystem: 'EPSG:4326',
                            BoundingRectangles: {
                                WestBoundingCoordinate: 0,
                                NorthBoundingCoordinate: 0,
                                EastBoundingCoordinate: 0,
                                SouthBoundingCoordinate: 0,
                            },
                        },
                    },
                },
                TemporalExtents: [],
            },
        }

        el.dataAccessMode = 'subset'

        el.variablesQuery = {
            result: {
                data: {
                    hits: 2,
                    items: [
                        {
                            umm: {
                                Name: 'var1',
                                Dimensions: [
                                    { Name: 'DimA', Size: 4, Type: 'OTHER' },
                                    {
                                        Name: 'time',
                                        Size: 10,
                                        Type: 'TIME_DIMENSION',
                                    },
                                ],
                            },
                        },
                        {
                            umm: {
                                Name: 'var2',
                                Dimensions: [
                                    { Name: 'DimA', Size: 4, Type: 'OTHER' },
                                    {
                                        Name: 'lat',
                                        Size: 180,
                                        Type: 'LATITUDE_DIMENSION',
                                    },
                                ],
                            },
                        },
                    ],
                },
            },
        }

        el.selectedVariables = [
            { name: 'var1', href: '', conceptId: 'C1' },
            { name: 'var2', href: '', conceptId: 'C2' },
        ]

        await elementUpdated(el)

        const accordionContent = getAccordionContent(el)

        expect(el.shadowRoot?.textContent).to.include('Select Dimensions:')
        expect(accordionContent?.textContent).to.include('DimA')
        expect(accordionContent?.textContent).to.not.include('time')
        expect(accordionContent?.textContent).to.not.include('lat')

        const slider = accordionContent?.querySelector('terra-slider')
        expect(slider).to.exist
        expect((slider as any)?.max).to.equal(4)
        expect((slider as any)?.min).to.equal(1)
    })
})

describe('<terra-data-subsetter> harmony request errors', () => {
    it('shows Harmony validation errors on the Results view when job creation fails', async () => {
        const originalStartJob = HarmonyRequestController.prototype.startJob

        HarmonyRequestController.prototype.startJob = (async () => {
            throw new HttpException({
                status: 400,
                message: 'Error: No matching granules found.',
            })
        }) as typeof HarmonyRequestController.prototype.startJob

        try {
            const el: any = await fixture(
                html`<terra-data-subsetter></terra-data-subsetter>`,
            )

            el.collectionWithServices = {
                conceptId: 'C123',
                shortName: 'S1',
                summary: {
                    subsetting: {
                        bbox: false,
                        dimension: false,
                        shape: false,
                        temporal: false,
                        variable: true,
                    },
                    reprojection: {
                        supported: false,
                        supportedProjections: [],
                        interpolationMethods: [],
                    },
                    averaging: { time: false, area: false },
                    concatenation: false,
                    outputFormats: [],
                },
                services: [{ name: 'harmony', href: '', capabilities: {} }],
                variables: [
                    {
                        conceptId: 'V1',
                        name: 'Variable 1',
                        href: '',
                    },
                ],
                collection: {
                    EntryTitle: 'Test Collection',
                    ShortName: 'S1',
                    Version: '1',
                    TemporalExtents: [],
                    SpatialExtent: {},
                },
            }

            el.dataAccessMode = 'subset'
            await elementUpdated(el)

            const getDataButton = Array.from(
                el.shadowRoot?.querySelectorAll('button') ?? [],
            ).find((button) => button.textContent?.trim() === 'Get Data') as
                | HTMLButtonElement
                | undefined

            expect(getDataButton).to.exist
            getDataButton?.click()

            await waitUntil(() => Boolean(el.harmonyRequestError))
            await elementUpdated(el)

            await waitUntil(() =>
                Boolean(el.shadowRoot?.textContent?.includes('Results:')),
            )

            const errorAlert = Array.from(
                el.shadowRoot?.querySelectorAll('terra-alert') ?? [],
            ).find((alert) =>
                alert.textContent?.includes(
                    'No matching granules were found for your subset request. Please try expanding your search',
                ),
            )

            expect(errorAlert).to.exist
            expect(el.shadowRoot?.textContent).to.not.include(
                'No matching granules found.',
            )
        } finally {
            HarmonyRequestController.prototype.startJob = originalStartJob
        }
    })
})

describe('<terra-data-subsetter> average=area param', () => {
    const collectionWithServices = {
        conceptId: 'C123',
        shortName: 'S1',
        summary: {
            subsetting: {
                bbox: false,
                dimension: false,
                shape: false,
                temporal: false,
                variable: true,
            },
            reprojection: {
                supported: false,
                supportedProjections: [],
                interpolationMethods: [],
            },
            averaging: { time: false, area: false },
            concatenation: false,
            outputFormats: [],
        },
        services: [{ name: 'harmony', href: '', capabilities: {} }],
        variables: [
            {
                conceptId: 'V1',
                name: 'Variable 1',
                href: '',
            },
        ],
        collection: {
            EntryTitle: 'Test Collection',
            ShortName: 'S1',
            Version: '1',
            TemporalExtents: [],
            SpatialExtent: {},
        },
    }

    const clickGetDataAndCaptureRequest = async (
        el: any,
    ): Promise<HarmonyRequest> => {
        const originalStartJob = HarmonyRequestController.prototype.startJob
        let capturedRequest: HarmonyRequest | undefined

        HarmonyRequestController.prototype.startJob = (async ({
            harmonyRequest,
        }: {
            harmonyRequest: HarmonyRequest
        }) => {
            capturedRequest = harmonyRequest
            return { jobID: 'job-1' }
        }) as typeof HarmonyRequestController.prototype.startJob

        try {
            await elementUpdated(el)

            const getDataButton = Array.from(
                el.shadowRoot?.querySelectorAll('button') ?? [],
            ).find((button) => button.textContent?.trim() === 'Get Data') as
                | HTMLButtonElement
                | undefined

            expect(getDataButton).to.exist
            getDataButton?.click()

            await waitUntil(() => Boolean(capturedRequest))

            return capturedRequest!
        } finally {
            HarmonyRequestController.prototype.startJob = originalStartJob
        }
    }

    it('omits average=area for a point-based (lat/lon) selection', async () => {
        const el: any = await fixture(
            html`<terra-data-subsetter></terra-data-subsetter>`,
        )

        el.collectionWithServices = collectionWithServices
        el.dataAccessMode = 'subset'
        el.spatialSelection = new LatLng(38.9, -77.03)
        el.selectedFormat = {
            key: 'text/csv',
            label: 'CSV',
            description: 'Download data in CSV format',
        }

        const harmonyRequest = await clickGetDataAndCaptureRequest(el)

        expect(harmonyRequest.params).to.include('point=')
        expect(harmonyRequest.params).to.not.include('average=area')
    })

    it('includes average=area for a bounding-box selection', async () => {
        const el: any = await fixture(
            html`<terra-data-subsetter></terra-data-subsetter>`,
        )

        el.collectionWithServices = collectionWithServices
        el.dataAccessMode = 'subset'
        el.spatialSelection = new LatLngBounds([-78, 38, -77, 39])
        el.selectedFormat = {
            key: 'text/csv',
            label: 'CSV',
            description: 'Download data in CSV format',
        }

        const harmonyRequest = await clickGetDataAndCaptureRequest(el)

        expect(harmonyRequest.params).to.include('average=area')
    })
})
