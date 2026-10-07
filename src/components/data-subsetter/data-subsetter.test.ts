import {
    elementUpdated,
    expect,
    fixture,
    html,
    waitUntil,
} from '@open-wc/testing'
import sinon from 'sinon'
import { authService } from '../../auth/auth.service.js'
import { HarmonyRequestController } from '../../controllers/harmony-request.controller.js'
import { HttpException } from '../../exceptions/http.exception.js'
import { LatLng } from '../map/models/LatLng.js'
import { LatLngBounds } from '../map/models/LatLngBounds.js'
import './data-subsetter.js'

const getAccordionContent = (el: any) => {
    const accordions = Array.from(
        el.shadowRoot?.querySelectorAll('terra-accordion') ?? [],
    ) as Element[]

    const dimensionsAccordion = accordions.find((acc) =>
        acc.textContent?.includes('Select Dimensions:'),
    )

    return dimensionsAccordion?.querySelector('.accordion-content')
}

// Resolves to a fetch `Response` wrapping the given JSON body — same pattern used in
// browse-variables.test.ts / variable-combobox.test.ts for stubbing globalThis.fetch.
function okJson(body: unknown) {
    return Promise.resolve(
        new Response(JSON.stringify(body), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        }),
    )
}

/**
 * `collectionWithServices` is now a @state value derived by `CollectionController`
 * (see src/controllers/collection.controller.ts) from two real TanStack Query-backed
 * requests — CMR's UMM-C collection record and Harmony's capabilities endpoint — and
 * it gets unconditionally overwritten from that controller on every render cycle. So
 * rather than hand-assigning `el.collectionWithServices`, we stub `globalThis.fetch`
 * to serve the CMR/Harmony/Giovanni responses the controller's queries expect, then
 * drive the component by setting `el.collectionEntryId` and waiting for the real
 * pipeline to populate it.
 *
 * `caps` supplies everything `HarmonyCapabilitiesResponse` normally provides
 * (conceptId, shortName, summary, services, variables, etc.) and `collectionUmm`
 * supplies the CMR UMM-C fields that end up at `collectionWithServices.collection`.
 */
function stubCollectionFetch({
    collectionEntryId,
    caps,
    collectionUmm,
    cmrVariables = { hits: 0, items: [] },
    jobStatuses = {},
}: {
    collectionEntryId: string
    caps: Record<string, unknown> & { conceptId: string }
    collectionUmm: Record<string, unknown>
    cmrVariables?: { hits: number; items: unknown[] }
    /** Keyed by jobID, used to stub Harmony's `jobs/{jobID}` status-polling endpoint */
    jobStatuses?: Record<string, Record<string, unknown>>
}) {
    const cmrCollectionResponse = {
        hits: 1,
        items: [
            {
                meta: {
                    'concept-id': caps.conceptId,
                    'native-id': collectionEntryId,
                    'provider-id': 'TEST_PROVIDER',
                },
                umm: collectionUmm,
            },
        ],
    }

    return sinon.stub(globalThis, 'fetch').callsFake((input: any) => {
        const url =
            typeof input === 'string' ? input : (input?.url ?? String(input))

        if (url.includes('collections.umm_json')) {
            return okJson(cmrCollectionResponse)
        }
        if (url.includes('variables.umm_json')) {
            return okJson(cmrVariables)
        }
        if (url.includes('granules.umm_json')) {
            // backs the CMR sampling query (first/last granule dates); not asserted
            // on in these tests, so a benign empty response is enough
            return okJson({ hits: 0, items: [] })
        }
        if (url.includes('/capabilities')) {
            return okJson(caps)
        }
        const jobsMatch = url.match(/\/jobs\/([^/?]+)/)
        if (jobsMatch && jobStatuses[jobsMatch[1]]) {
            return okJson(jobStatuses[jobsMatch[1]])
        }
        if (url.includes('configured-variables')) {
            // Giovanni's configured-variables query is always enabled regardless of
            // collection; none of these tests exercise Giovanni-specific behavior
            return okJson({ configured_variables: [] })
        }

        // benign fallback (e.g. GES DISC collection metadata) so nothing throws
        return okJson({})
    })
}

describe('<terra-data-subsetter> dimension intersection support', () => {
    afterEach(() => {
        sinon.restore()
    })

    const baseCaps = {
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
        capabilitiesVersion: '1',
        configuredOutputFormats: [],
        services: [],
        variables: [],
    }

    const baseCollectionUmm = {
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
    }

    it('renders common dimensions for all available variables when no variable selected', async () => {
        stubCollectionFetch({
            collectionEntryId: 'S1_1',
            caps: { ...baseCaps, conceptId: 'C1', shortName: 'S1' },
            collectionUmm: baseCollectionUmm,
            cmrVariables: {
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
        })

        const el: any = await fixture(
            html`<terra-data-subsetter></terra-data-subsetter>`,
        )

        el.dataAccessMode = 'subset'
        el.features = 'dimension-subset'
        el.collectionEntryId = 'S1_1'

        await waitUntil(
            () => Boolean(el.collectionWithServices),
            'expected collectionWithServices to be populated by CollectionController',
            { timeout: 3000 },
        )
        await waitUntil(
            () =>
                Boolean(getAccordionContent(el)?.textContent?.includes('DimA')),
            'expected the dimensions accordion to render',
            { timeout: 3000 },
        )

        const accordionContent = getAccordionContent(el)

        expect(el.shadowRoot?.textContent).to.include('Select Dimensions:')
        expect(accordionContent?.textContent).to.include('DimA')
        expect(accordionContent?.textContent).to.not.include('time')
        expect(accordionContent?.textContent).to.not.include('lat')
    })

    it('shows union dimensions when one selected variable has no dimensions', async () => {
        stubCollectionFetch({
            collectionEntryId: 'S2_1',
            caps: { ...baseCaps, conceptId: 'C2', shortName: 'S1' },
            collectionUmm: baseCollectionUmm,
            cmrVariables: {
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
        })

        const el: any = await fixture(
            html`<terra-data-subsetter></terra-data-subsetter>`,
        )

        el.dataAccessMode = 'subset'
        el.features = 'dimension-subset'
        el.collectionEntryId = 'S2_1'

        await waitUntil(
            () => Boolean(el.collectionWithServices),
            'expected collectionWithServices to be populated by CollectionController',
            { timeout: 3000 },
        )

        el.selectedVariables = [
            { name: 'var1', href: '', conceptId: 'C1' },
            { name: 'var2', href: '', conceptId: 'C2' },
        ]

        await waitUntil(
            () =>
                Boolean(getAccordionContent(el)?.textContent?.includes('DimA')),
            'expected the dimensions accordion to render',
            { timeout: 3000 },
        )

        const accordionContent = getAccordionContent(el)

        expect(el.shadowRoot?.textContent).to.include('Select Dimensions:')
        expect(accordionContent?.textContent).to.include('DimA')
    })

    it('renders only common dimensions and excludes time/lat/lon', async () => {
        stubCollectionFetch({
            collectionEntryId: 'S3_1',
            caps: { ...baseCaps, conceptId: 'C3', shortName: 'S1' },
            collectionUmm: baseCollectionUmm,
            cmrVariables: {
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
        })

        const el: any = await fixture(
            html`<terra-data-subsetter></terra-data-subsetter>`,
        )

        el.dataAccessMode = 'subset'
        el.features = 'dimension-subset'
        el.collectionEntryId = 'S3_1'

        await waitUntil(
            () => Boolean(el.collectionWithServices),
            'expected collectionWithServices to be populated by CollectionController',
            { timeout: 3000 },
        )

        el.selectedVariables = [
            { name: 'var1', href: '', conceptId: 'C1' },
            { name: 'var2', href: '', conceptId: 'C2' },
        ]

        await waitUntil(
            () =>
                Boolean(getAccordionContent(el)?.textContent?.includes('DimA')),
            'expected the dimensions accordion to render',
            { timeout: 3000 },
        )

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
    afterEach(() => {
        sinon.restore()
    })

    it('shows Harmony validation errors on the Results view when job creation fails', async () => {
        const originalStartJob = HarmonyRequestController.prototype.startJob

        HarmonyRequestController.prototype.startJob = (async () => {
            throw new HttpException({
                status: 400,
                message: 'Error: No matching granules found.',
            })
        }) as typeof HarmonyRequestController.prototype.startJob

        stubCollectionFetch({
            collectionEntryId: 'S4_1',
            caps: {
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
            },
            collectionUmm: {
                EntryTitle: 'Test Collection',
                ShortName: 'S1',
                Version: '1',
                TemporalExtents: [],
                SpatialExtent: {},
            },
        })

        try {
            const el: any = await fixture(
                html`<terra-data-subsetter></terra-data-subsetter>`,
            )

            el.dataAccessMode = 'subset'
            el.collectionEntryId = 'S4_1'

            await waitUntil(
                () => Boolean(el.collectionWithServices),
                'expected collectionWithServices to be populated by CollectionController',
                { timeout: 3000 },
            )
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

            // the error message is rendered across multiple text nodes (it wraps a
            // clickable "expanding your search" link), so normalize whitespace before
            // comparing rather than relying on exact substring matching
            const normalizeWhitespace = (text?: string | null) =>
                (text ?? '').replace(/\s+/g, ' ').trim()

            const errorAlert = Array.from(
                el.shadowRoot?.querySelectorAll('terra-alert') ?? [],
            ).find((alert: any) =>
                normalizeWhitespace(alert.textContent).includes(
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

describe('<terra-data-subsetter> anonymous access limiting', () => {
    afterEach(() => {
        sinon.restore()
    })

    const caps = {
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
    }

    const collectionUmm = {
        EntryTitle: 'Test Collection',
        ShortName: 'S1',
        Version: '1',
        TemporalExtents: [],
        SpatialExtent: {},
    }

    async function submitAndCaptureRequest(setup?: (el: any) => void) {
        let capturedHarmonyRequest: any
        const originalStartJob = HarmonyRequestController.prototype.startJob

        HarmonyRequestController.prototype.startJob = (async (
            variables: any,
        ) => {
            capturedHarmonyRequest = variables.harmonyRequest
            throw new HttpException({ status: 400, message: 'stop' })
        }) as typeof HarmonyRequestController.prototype.startJob

        stubCollectionFetch({
            collectionEntryId: 'S4_1',
            caps,
            collectionUmm,
        })

        try {
            const el: any = await fixture(
                html`<terra-data-subsetter></terra-data-subsetter>`,
            )

            el.dataAccessMode = 'subset'
            el.collectionEntryId = 'S4_1'

            await waitUntil(
                () => Boolean(el.collectionWithServices),
                'expected collectionWithServices to be populated by CollectionController',
                { timeout: 3000 },
            )

            setup?.(el)
            await elementUpdated(el)

            const getDataButton = Array.from(
                el.shadowRoot?.querySelectorAll('button') ?? [],
            ).find((button) => button.textContent?.trim() === 'Get Data') as
                | HTMLButtonElement
                | undefined

            expect(getDataButton).to.exist
            getDataButton?.click()

            await waitUntil(() => Boolean(capturedHarmonyRequest))

            return capturedHarmonyRequest
        } finally {
            HarmonyRequestController.prototype.startJob = originalStartJob
        }
    }

    it('caps results at 10 links (maxResults=10) when the user is logged out', async () => {
        sinon.stub(authService, 'getState').returns({
            user: null,
            token: null,
            isLoading: false,
            error: null,
        })

        const harmonyRequest = await submitAndCaptureRequest()

        expect(harmonyRequest.params).to.include('maxResults=10')
    })

    it('does not cap results when the user is logged in', async () => {
        sinon.stub(authService, 'getState').returns({
            user: { uid: 'test-user', first_name: 'Test', last_name: 'User' },
            token: 'test-token',
            isLoading: false,
            error: null,
        })

        const harmonyRequest = await submitAndCaptureRequest()

        expect(harmonyRequest.params).to.not.include('maxResults')
    })

    it('omits average=area for a text/csv request when the spatial selection is a point', async () => {
        sinon.stub(authService, 'getState').returns({
            user: null,
            token: null,
            isLoading: false,
            error: null,
        })

        const harmonyRequest = await submitAndCaptureRequest((el) => {
            el.selectedFormat = { key: 'text/csv', isGiovanniFormat: true }
            el.selectedVariables = [{ conceptId: 'V1', name: 'Variable 1' }]
            el.spatialSelection = new LatLng(10, 20)
        })

        expect(harmonyRequest.params).to.not.include('average')
    })

    it('adds average=area for a text/csv request when the spatial selection is an area', async () => {
        sinon.stub(authService, 'getState').returns({
            user: null,
            token: null,
            isLoading: false,
            error: null,
        })

        const harmonyRequest = await submitAndCaptureRequest((el) => {
            el.selectedFormat = { key: 'text/csv', isGiovanniFormat: true }
            el.selectedVariables = [{ conceptId: 'V1', name: 'Variable 1' }]
            el.spatialSelection = new LatLngBounds([-10, -10, 10, 10])
        })

        expect(harmonyRequest.params).to.include('average=area')
    })
})

describe('<terra-data-subsetter> duplicate submission prevention', () => {
    afterEach(() => {
        sinon.restore()
    })

    const caps = {
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
    }

    const collectionUmm = {
        EntryTitle: 'Test Collection',
        ShortName: 'S1',
        Version: '1',
        TemporalExtents: [],
        SpatialExtent: {},
    }

    it('ignores rapid duplicate clicks on "Get Data" while a request is in flight', async () => {
        let startJobCallCount = 0
        let resolveStartJob: (job: { jobID: string }) => void = () => {}
        const originalStartJob = HarmonyRequestController.prototype.startJob

        HarmonyRequestController.prototype.startJob = (async () => {
            startJobCallCount++
            return new Promise((resolve) => {
                resolveStartJob = resolve
            })
        }) as typeof HarmonyRequestController.prototype.startJob

        stubCollectionFetch({
            collectionEntryId: 'S4_1',
            caps,
            collectionUmm,
        })

        try {
            const el: any = await fixture(
                html`<terra-data-subsetter></terra-data-subsetter>`,
            )

            el.dataAccessMode = 'subset'
            el.collectionEntryId = 'S4_1'

            await waitUntil(
                () => Boolean(el.collectionWithServices),
                'expected collectionWithServices to be populated by CollectionController',
                { timeout: 3000 },
            )
            await elementUpdated(el)

            const getDataButton = () =>
                Array.from(
                    el.shadowRoot?.querySelectorAll('button') ?? [],
                ).find((button: any) =>
                    button.textContent?.trim().startsWith('Get Data'),
                ) as HTMLButtonElement | undefined

            const button = getDataButton()
            expect(button).to.exist

            // simulate a rapid succession of clicks (e.g. an impatient double-click)
            // before the first request has a chance to resolve
            button?.click()
            button?.click()
            button?.click()

            await waitUntil(() => startJobCallCount > 0)

            expect(startJobCallCount).to.equal(1)
            expect(el.isSubmittingRequest).to.be.true

            resolveStartJob({ jobID: 'job-1' })

            await waitUntil(() => !el.isSubmittingRequest)
        } finally {
            HarmonyRequestController.prototype.startJob = originalStartJob
        }
    })
})

describe('<terra-data-subsetter> recent date range default', () => {
    afterEach(() => {
        sinon.restore()
    })

    const caps = {
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
    }

    const collectionUmm = {
        EntryTitle: 'Test Collection',
        ShortName: 'S1',
        Version: '1',
        TemporalExtents: [],
        SpatialExtent: {},
    }

    const firstGranuleDate = '2000-01-01T00:00:00.000Z'
    const lastGranuleDate = '2020-01-01T00:00:00.000Z'

    // Like stubCollectionFetch, but also backs the granule sampling query with a
    // controllable first/last granule date and puts `granuleCount` on the CMR
    // collection meta, since both drive #getDefaultRecentDateRange's cadence math.
    function stubCollectionFetchWithGranules(granuleCount: number) {
        const cmrCollectionResponse = {
            hits: 1,
            items: [
                {
                    meta: {
                        'concept-id': caps.conceptId,
                        'native-id': 'S4_1',
                        'provider-id': 'TEST_PROVIDER',
                        'granule-count': granuleCount,
                    },
                    umm: collectionUmm,
                },
            ],
        }

        const granuleResponse = (date: string) => ({
            hits: granuleCount,
            items: [
                {
                    umm: {
                        TemporalExtent: {
                            RangeDateTime: { BeginningDateTime: date },
                        },
                    },
                },
            ],
        })

        return sinon.stub(globalThis, 'fetch').callsFake((input: any) => {
            const url =
                typeof input === 'string'
                    ? input
                    : (input?.url ?? String(input))

            if (url.includes('collections.umm_json')) {
                return okJson(cmrCollectionResponse)
            }
            if (url.includes('variables.umm_json')) {
                return okJson({ hits: 0, items: [] })
            }
            if (url.includes('granules.umm_json')) {
                // ascending sort_key ("+startDate", percent-encoded as %2BstartDate)
                // fetches the first/earliest granule; descending ("-startDate")
                // fetches the last/latest granule
                const isDescending = url.includes('-startDate')
                return okJson(
                    granuleResponse(
                        isDescending ? lastGranuleDate : firstGranuleDate,
                    ),
                )
            }
            if (url.includes('/capabilities')) {
                return okJson(caps)
            }
            if (url.includes('configured-variables')) {
                return okJson({ configured_variables: [] })
            }

            return okJson({})
        })
    }

    async function loadWithGranuleCount(granuleCount: number) {
        stubCollectionFetchWithGranules(granuleCount)

        const el: any = await fixture(
            html`<terra-data-subsetter></terra-data-subsetter>`,
        )
        el.dataAccessMode = 'subset'
        el.collectionEntryId = 'S4_1'

        await waitUntil(
            () => Boolean(el.granuleMinDate) && Boolean(el.granuleMaxDate),
            'expected granule sampling dates to be populated',
            { timeout: 3000 },
        )
        await elementUpdated(el)

        return el
    }

    it('defaults to a ~30-day recent window for a high-cadence (daily) collection', async () => {
        // one granule per day across the full 2000-01-01..2020-01-01 range
        const el = await loadWithGranuleCount(7306)

        expect(el.selectedDateRange.endDate).to.equal('2020-01-01')
        expect(el.selectedDateRange.startDate).to.equal('2019-12-03')
    })

    it('widens the default window for a low-cadence (monthly) collection so it covers multiple granules', async () => {
        // ~monthly cadence across the same 20-year range
        const el = await loadWithGranuleCount(240)

        expect(el.selectedDateRange.endDate).to.equal('2020-01-01')

        const days =
            (new Date(el.selectedDateRange.endDate).getTime() -
                new Date(el.selectedDateRange.startDate).getTime()) /
            (1000 * 60 * 60 * 24)

        // should be noticeably wider than the 30-day floor (a few months, to
        // cover several granules) but much narrower than the full 20-year range
        expect(days).to.be.greaterThan(60)
        expect(days).to.be.lessThan(150)
    })

    it('falls back to the full range when the collection has no usable granule count', async () => {
        const el = await loadWithGranuleCount(0)

        expect(el.selectedDateRange.startDate).to.equal('2000-01-01')
        expect(el.selectedDateRange.endDate).to.equal('2020-01-01')
    })

    it('restores the recent default window (not the full range) when the date range Reset button is clicked', async () => {
        const el = await loadWithGranuleCount(7306)

        // simulate the user having changed the date range away from the default
        el.selectedDateRange = { startDate: '2005-06-01', endDate: '2005-06-15' }
        await elementUpdated(el)

        const dateRangeResetButton = Array.from(
            el.shadowRoot?.querySelectorAll('.reset-btn') ?? [],
        ).find((button: any) =>
            button
                .closest('terra-accordion')
                ?.textContent?.includes('Refine Date Range'),
        ) as HTMLButtonElement | undefined

        expect(dateRangeResetButton).to.exist
        dateRangeResetButton?.click()
        await elementUpdated(el)

        // should go back to the ~30-day recent default, not the full
        // 2000-01-01..2020-01-01 collection extent
        expect(el.selectedDateRange.endDate).to.equal('2020-01-01')
        expect(el.selectedDateRange.startDate).to.equal('2019-12-03')
    })

    it('restores the recent default window when "Reset All" is clicked', async () => {
        const el = await loadWithGranuleCount(7306)

        el.selectedDateRange = { startDate: '2005-06-01', endDate: '2005-06-15' }
        await elementUpdated(el)

        const resetAllButton = Array.from(
            el.shadowRoot?.querySelectorAll('button') ?? [],
        ).find(
            (button) => button.textContent?.trim() === 'Reset All',
        ) as HTMLButtonElement | undefined

        expect(resetAllButton).to.exist
        resetAllButton?.click()
        await elementUpdated(el)

        expect(el.selectedDateRange.endDate).to.equal('2020-01-01')
        expect(el.selectedDateRange.startDate).to.equal('2019-12-03')
    })
})

describe('<terra-data-subsetter> paused job handling', () => {
    afterEach(() => {
        sinon.restore()
    })

    const caps = {
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
    }

    const collectionUmm = {
        EntryTitle: 'Test Collection',
        ShortName: 'S1',
        Version: '1',
        TemporalExtents: [],
        SpatialExtent: {},
    }

    const pausedJobStatus = {
        jobID: 'job-paused',
        status: 'paused',
        message: 'The job is paused and may be resumed using the provided link.',
        progress: 15,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        dataExpiration: '',
        request: '',
        numInputGranules: 100,
        links: [],
    }

    async function startPausedJob() {
        const originalStartJob = HarmonyRequestController.prototype.startJob

        HarmonyRequestController.prototype.startJob = (async () => {
            return { jobID: 'job-paused' } as any
        }) as typeof HarmonyRequestController.prototype.startJob

        stubCollectionFetch({
            collectionEntryId: 'S4_1',
            caps,
            collectionUmm,
            jobStatuses: { 'job-paused': pausedJobStatus },
        })

        const el: any = await fixture(
            html`<terra-data-subsetter></terra-data-subsetter>`,
        )

        try {
            el.dataAccessMode = 'subset'
            el.collectionEntryId = 'S4_1'

            await waitUntil(
                () => Boolean(el.collectionWithServices),
                'expected collectionWithServices to be populated by CollectionController',
                { timeout: 3000 },
            )
            await elementUpdated(el)

            const getDataButton = Array.from(
                el.shadowRoot?.querySelectorAll('button') ?? [],
            ).find((button) => button.textContent?.trim() === 'Get Data') as
                | HTMLButtonElement
                | undefined

            expect(getDataButton).to.exist
            getDataButton?.click()

            await waitUntil(
                () => el.shadowRoot?.textContent?.includes('Paused for review'),
                'expected the job status section to show the paused status',
                { timeout: 3000 },
            )
            await elementUpdated(el)
        } finally {
            HarmonyRequestController.prototype.startJob = originalStartJob
        }

        return el
    }

    it('shows the paused message and Resume Job / Cancel request buttons when a job is paused', async () => {
        const el = await startPausedJob()

        const alertText = Array.from(
            el.shadowRoot?.querySelectorAll('terra-alert') ?? [],
        )
            .map((alert: any) => alert.textContent)
            .join(' ')

        expect(alertText).to.include('This job is paused for review')

        const buttons = Array.from(
            el.shadowRoot?.querySelectorAll('button') ?? [],
        ) as HTMLButtonElement[]

        expect(
            buttons.some((button) => button.textContent?.trim() === 'Resume Job'),
        ).to.be.true
        expect(
            buttons.some(
                (button) => button.textContent?.trim() === 'Cancel request',
            ),
        ).to.be.true
    })

    it('calls HarmonyRequestController.resumeJob with the job ID when Resume Job is clicked', async () => {
        const el = await startPausedJob()

        const originalResumeJob = HarmonyRequestController.prototype.resumeJob
        let resumeJobArgs: any

        HarmonyRequestController.prototype.resumeJob = (async (
            options: any,
        ) => {
            resumeJobArgs = options
            return pausedJobStatus
        }) as typeof HarmonyRequestController.prototype.resumeJob

        try {
            const resumeButton = Array.from(
                el.shadowRoot?.querySelectorAll('button') ?? [],
            ).find(
                (button) => button.textContent?.trim() === 'Resume Job',
            ) as HTMLButtonElement | undefined

            expect(resumeButton).to.exist
            resumeButton?.click()

            await waitUntil(() => Boolean(resumeJobArgs))

            expect(resumeJobArgs.jobId).to.equal('job-paused')
        } finally {
            HarmonyRequestController.prototype.resumeJob = originalResumeJob
        }
    })
})
