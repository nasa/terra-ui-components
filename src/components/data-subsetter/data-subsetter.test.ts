import {
    elementUpdated,
    expect,
    fixture,
    html,
    waitUntil,
} from '@open-wc/testing'
import sinon from 'sinon'
import { HarmonyRequestController } from '../../controllers/harmony-request.controller.js'
import { HttpException } from '../../exceptions/http.exception.js'
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
}: {
    collectionEntryId: string
    caps: Record<string, unknown> & { conceptId: string }
    collectionUmm: Record<string, unknown>
    cmrVariables?: { hits: number; items: unknown[] }
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
