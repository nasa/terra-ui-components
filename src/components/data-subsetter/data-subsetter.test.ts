import { elementUpdated, expect, fixture, html, waitUntil } from '@open-wc/testing'
import { HarmonyRequestController } from '../../controllers/harmony-request.controller.js'
import { HttpException } from '../../exceptions/http.exception.js'
import { mockCollectionQueries } from '../../test-helpers/mock-apis.js'
import { LatLng } from '../map/models/LatLng.js'
import { LatLngBounds } from '../map/models/LatLngBounds.js'
import './data-subsetter.js'
import type { HarmonyRequest } from '../../lib/harmony/harmony.request.js'

const getAccordionContent = (el: any) => {
    const accordions = Array.from(
        el.shadowRoot?.querySelectorAll('terra-accordion') ?? []
    ) as Element[]

    const dimensionsAccordion = accordions.find(acc =>
        acc.textContent?.includes('Select Dimensions:')
    )

    return dimensionsAccordion?.querySelector('.accordion-content')
}

const waitForCollectionLoaded = async (el: any, conceptId: string) => {
    await waitUntil(
        () => el.collectionWithServices?.conceptId === conceptId,
        'collection data did not load',
        { timeout: 2000 }
    )
}

const waitForDimensionsAccordion = async (el: any) => {
    await waitUntil(
        () => Boolean(getAccordionContent(el)),
        'dimensions accordion did not render',
        { timeout: 2000 }
    )
}

const findGetDataButton = (el: any): HTMLButtonElement | undefined =>
    Array.from(el.shadowRoot?.querySelectorAll('button') ?? []).find(
        (button: any) => button.textContent?.trim() === 'Get Data'
    ) as HTMLButtonElement | undefined

const waitForGetDataButton = async (
    el: any
): Promise<HTMLButtonElement | undefined> => {
    await waitUntil(
        () => Boolean(findGetDataButton(el)),
        'Get Data button did not render',
        { timeout: 2000 }
    )
    return findGetDataButton(el)
}

describe('<terra-data-subsetter> dimension intersection support', () => {
    const makeCapabilities = (conceptId: string) => ({
        conceptId,
        shortName: 'S1',
        capabilitiesVersion: '1',
        summary: {
            subsetting: {
                bbox: false,
                dimension: true,
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
        configuredOutputFormats: [],
        services: [],
        variables: [],
    })

    const makeCollection = (conceptId: string) => ({
        meta: { 'concept-id': conceptId, 'granule-count': 0 },
        umm: {
            ShortName: 'S1',
            Version: '1',
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
    })

    it('renders common dimensions for all available variables when no variable selected', async () => {
        const restore = mockCollectionQueries({
            collection: makeCollection('C-DIM-1'),
            capabilities: makeCapabilities('C-DIM-1'),
            ummVariables: [
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
        })

        try {
            const el: any = await fixture(
                html`<terra-data-subsetter></terra-data-subsetter>`
            )

            el.dataAccessMode = 'subset'
            el.collectionEntryId = 'S-DIM-1_1'
            el.features = 'dimension-subset'

            await waitForCollectionLoaded(el, 'C-DIM-1')
            await waitForDimensionsAccordion(el)

            const accordionContent = getAccordionContent(el)

            expect(el.shadowRoot?.textContent).to.include('Select Dimensions:')
            expect(accordionContent?.textContent).to.include('DimA')
            expect(accordionContent?.textContent).to.not.include('time')
            expect(accordionContent?.textContent).to.not.include('lat')
        } finally {
            restore()
        }
    })

    it('shows union dimensions when one selected variable has no dimensions', async () => {
        const restore = mockCollectionQueries({
            collection: makeCollection('C-DIM-2'),
            capabilities: makeCapabilities('C-DIM-2'),
            ummVariables: [
                {
                    umm: {
                        Name: 'var1',
                        Dimensions: [],
                    },
                },
                {
                    umm: {
                        Name: 'var2',
                        Dimensions: [{ Name: 'DimA', Size: 4, Type: 'OTHER' }],
                    },
                },
            ],
        })

        try {
            const el: any = await fixture(
                html`<terra-data-subsetter></terra-data-subsetter>`
            )

            el.dataAccessMode = 'subset'
            el.collectionEntryId = 'S-DIM-2_1'
            el.features = 'dimension-subset'

            await waitForCollectionLoaded(el, 'C-DIM-2')

            el.selectedVariables = [
                { name: 'var1', href: '', conceptId: 'C1' },
                { name: 'var2', href: '', conceptId: 'C2' },
            ]

            await waitForDimensionsAccordion(el)

            const accordionContent = getAccordionContent(el)

            expect(el.shadowRoot?.textContent).to.include('Select Dimensions:')
            expect(accordionContent?.textContent).to.include('DimA')
        } finally {
            restore()
        }
    })

    it('renders only common dimensions and excludes time/lat/lon', async () => {
        const restore = mockCollectionQueries({
            collection: makeCollection('C-DIM-3'),
            capabilities: makeCapabilities('C-DIM-3'),
            ummVariables: [
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
        })

        try {
            const el: any = await fixture(
                html`<terra-data-subsetter></terra-data-subsetter>`
            )

            el.dataAccessMode = 'subset'
            el.collectionEntryId = 'S-DIM-3_1'
            el.features = 'dimension-subset'

            await waitForCollectionLoaded(el, 'C-DIM-3')

            el.selectedVariables = [
                { name: 'var1', href: '', conceptId: 'C1' },
                { name: 'var2', href: '', conceptId: 'C2' },
            ]

            await waitForDimensionsAccordion(el)

            const accordionContent = getAccordionContent(el)

            expect(el.shadowRoot?.textContent).to.include('Select Dimensions:')
            expect(accordionContent?.textContent).to.include('DimA')
            expect(accordionContent?.textContent).to.not.include('time')
            expect(accordionContent?.textContent).to.not.include('lat')

            const slider = accordionContent?.querySelector('terra-slider')
            expect(slider).to.exist
            expect((slider as any)?.max).to.equal(4)
            expect((slider as any)?.min).to.equal(1)
        } finally {
            restore()
        }
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

        const restore = mockCollectionQueries({
            collection: {
                meta: { 'concept-id': 'C-ERR-1', 'granule-count': 0 },
                umm: {
                    EntryTitle: 'Test Collection',
                    ShortName: 'S1',
                    Version: '1',
                    TemporalExtents: [],
                    SpatialExtent: {},
                },
            },
            capabilities: {
                conceptId: 'C-ERR-1',
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
                configuredOutputFormats: [],
                services: [{ name: 'harmony', href: '', capabilities: {} }],
                variables: [
                    {
                        conceptId: 'V1',
                        name: 'Variable 1',
                        href: '',
                    },
                ],
            },
        })

        try {
            const el: any = await fixture(
                html`<terra-data-subsetter></terra-data-subsetter>`
            )

            el.dataAccessMode = 'subset'
            el.collectionEntryId = 'S-ERR-1_1'
            await waitForCollectionLoaded(el, 'C-ERR-1')

            const getDataButton = await waitForGetDataButton(el)

            expect(getDataButton).to.exist
            getDataButton?.click()

            await waitUntil(() => Boolean(el.harmonyRequestError))
            await elementUpdated(el)

            await waitUntil(() =>
                Boolean(el.shadowRoot?.textContent?.includes('Results:'))
            )

            const normalizeWhitespace = (text: string | null | undefined) =>
                text?.replace(/\s+/g, ' ').trim()

            const errorAlert = Array.from(
                el.shadowRoot?.querySelectorAll('terra-alert') ?? []
            ).find(alert =>
                normalizeWhitespace(alert.textContent)?.includes(
                    'No matching granules were found for your subset request. Please try expanding your search'
                )
            )

            expect(errorAlert).to.exist
            expect(el.shadowRoot?.textContent).to.not.include(
                'No matching granules found.'
            )
        } finally {
            HarmonyRequestController.prototype.startJob = originalStartJob
            restore()
        }
    })
})

describe('<terra-data-subsetter> average=area param', () => {
    const makeCollectionForAreaTests = (conceptId: string) => ({
        meta: { 'concept-id': conceptId, 'granule-count': 0 },
        umm: {
            EntryTitle: 'Test Collection',
            ShortName: 'S1',
            Version: '1',
            TemporalExtents: [],
            SpatialExtent: {},
        },
    })

    const makeCapabilitiesForAreaTests = (conceptId: string) => ({
        conceptId,
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
        configuredOutputFormats: [],
        services: [{ name: 'harmony', href: '', capabilities: {} }],
        variables: [
            {
                conceptId: 'V1',
                name: 'Variable 1',
                href: '',
            },
        ],
    })

    const clickGetDataAndCaptureRequest = async (
        el: any
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
            const getDataButton = await waitForGetDataButton(el)

            expect(getDataButton).to.exist
            getDataButton?.click()

            await waitUntil(() => Boolean(capturedRequest))

            return capturedRequest!
        } finally {
            HarmonyRequestController.prototype.startJob = originalStartJob
        }
    }

    it('omits average=area for a point-based (lat/lon) selection', async () => {
        const restore = mockCollectionQueries({
            collection: makeCollectionForAreaTests('C-POINT-1'),
            capabilities: makeCapabilitiesForAreaTests('C-POINT-1'),
        })

        try {
            const el: any = await fixture(
                html`<terra-data-subsetter></terra-data-subsetter>`
            )

            el.dataAccessMode = 'subset'
            el.collectionEntryId = 'S-POINT-1_1'
            await waitForCollectionLoaded(el, 'C-POINT-1')

            el.spatialSelection = new LatLng(38.9, -77.03)
            el.selectedFormat = {
                key: 'text/csv',
                label: 'CSV',
                description: 'Download data in CSV format',
            }

            const harmonyRequest = await clickGetDataAndCaptureRequest(el)

            expect(harmonyRequest.params).to.include('point=')
            expect(harmonyRequest.params).to.not.include('average=area')
        } finally {
            restore()
        }
    })

    it('includes average=area for a bounding-box selection', async () => {
        const restore = mockCollectionQueries({
            collection: makeCollectionForAreaTests('C-BBOX-1'),
            capabilities: makeCapabilitiesForAreaTests('C-BBOX-1'),
        })

        try {
            const el: any = await fixture(
                html`<terra-data-subsetter></terra-data-subsetter>`
            )

            el.dataAccessMode = 'subset'
            el.collectionEntryId = 'S-BBOX-1_1'
            await waitForCollectionLoaded(el, 'C-BBOX-1')

            el.spatialSelection = new LatLngBounds([-78, 38, -77, 39])
            el.selectedFormat = {
                key: 'text/csv',
                label: 'CSV',
                description: 'Download data in CSV format',
            }

            const harmonyRequest = await clickGetDataAndCaptureRequest(el)

            expect(harmonyRequest.params).to.include('average=area')
        } finally {
            restore()
        }
    })
})
