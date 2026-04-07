import { expect, fixture, html, elementUpdated } from '@open-wc/testing'
import './data-subsetter.js'

describe('<terra-data-subsetter> dimension intersection support', () => {
    it('renders common dimensions for all available variables when no variable selected', async () => {
        const el: any = await fixture(
            html`<terra-data-subsetter></terra-data-subsetter>`
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

        el.variablesQuery.result = {
            data: {
                hits: 2,
                items: [
                    {
                        umm: {
                            Name: 'var1',
                            Dimensions: [
                                { Name: 'DimA', Size: 5, Type: 'OTHER' },
                                { Name: 'time', Size: 10, Type: 'TIME_DIMENSION' },
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
        }

        await elementUpdated(el)

        expect(el.shadowRoot?.textContent).to.include('Select Dimensions:')
        expect(el.shadowRoot?.textContent).to.include('DimA')
        expect(el.shadowRoot?.textContent).to.not.include('time')
        expect(el.shadowRoot?.textContent).to.not.include('lat')
    })

    it('shows union dimensions when one selected variable has no dimensions', async () => {
        const el: any = await fixture(
            html`<terra-data-subsetter></terra-data-subsetter>`
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

        el.variablesQuery.result = {
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
                            Dimensions: [{ Name: 'DimA', Size: 4, Type: 'OTHER' }],
                        },
                    },
                ],
            },
        }

        el.selectedVariables = [
            { name: 'var1', href: '', conceptId: 'C1' },
            { name: 'var2', href: '', conceptId: 'C2' },
        ]

        await elementUpdated(el)

        expect(el.shadowRoot?.textContent).to.include('Select Dimensions:')
        expect(el.shadowRoot?.textContent).to.include('DimA')
    })

    it('renders only common dimensions and excludes time/lat/lon', async () => {
        const el: any = await fixture(
            html`<terra-data-subsetter></terra-data-subsetter>`
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

        el.variablesQuery.result = {
            data: {
                hits: 2,
                items: [
                    {
                        umm: {
                            Name: 'var1',
                            Dimensions: [
                                { Name: 'DimA', Size: 4, Type: 'OTHER' },
                                { Name: 'time', Size: 10, Type: 'TIME_DIMENSION' },
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
        }

        el.selectedVariables = [
            { name: 'var1', href: '', conceptId: 'C1' },
            { name: 'var2', href: '', conceptId: 'C2' },
        ]

        await elementUpdated(el)

        expect(el.shadowRoot?.textContent).to.include('Select Dimensions:')
        expect(el.shadowRoot?.textContent).to.include('DimA')
        expect(el.shadowRoot?.textContent).to.not.include('time')
        expect(el.shadowRoot?.textContent).to.not.include('lat')

        const expandButton = el.shadowRoot?.querySelector(
            'button[aria-label="Expand DimA"]'
        )
        expect(expandButton).to.exist
        ;(expandButton as HTMLElement).click()
        await elementUpdated(el)

        expect(el.shadowRoot?.textContent).to.include('1')
        expect(el.shadowRoot?.textContent).to.include('4')
    })
})
