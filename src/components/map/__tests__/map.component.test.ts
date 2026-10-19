import { expect, fixture, html, waitUntil } from '@open-wc/testing'
import sinon from 'sinon'
import ImageTile from 'ol/source/ImageTile.js'
import WMTS from 'ol/source/WMTS.js'
import type TileLayer from 'ol/layer/Tile.js'
import { apiClient } from '../../../lib/api.client.js'
import type TerraMap from '../map.component.js'
import '../map.js'

function makeCapabilitiesXml(projection: string, matrixSet: string) {
    return `<?xml version="1.0" encoding="UTF-8"?>
<Capabilities xmlns="http://www.opengis.net/wmts/1.0" xmlns:ows="http://www.opengis.net/ows/1.1" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.0.0">
    <Contents>
        <Layer>
            <ows:Title>Test Layer</ows:Title>
            <ows:Identifier>TestLayer</ows:Identifier>
            <Style isDefault="true">
                <ows:Identifier>default</ows:Identifier>
            </Style>
            <Format>image/jpeg</Format>
            <Dimension>
                <ows:Identifier>Time</ows:Identifier>
                <Default>default</Default>
                <Value>2024-06-01</Value>
            </Dimension>
            <TileMatrixSetLink>
                <TileMatrixSet>${matrixSet}</TileMatrixSet>
            </TileMatrixSetLink>
            <ResourceURL format="image/jpeg" resourceType="tile" template="https://example.com/${projection}/TestLayer/default/{Time}/${matrixSet}/{TileMatrix}/{TileRow}/{TileCol}.jpg"/>
        </Layer>
        <TileMatrixSet>
            <ows:Identifier>${matrixSet}</ows:Identifier>
            <ows:SupportedCRS>urn:ogc:def:crs:${projection.replace(':', '::')}</ows:SupportedCRS>
            <TileMatrix>
                <ows:Identifier>0</ows:Identifier>
                <ScaleDenominator>279541132.0143589</ScaleDenominator>
                <TopLeftCorner>-180 90</TopLeftCorner>
                <TileWidth>512</TileWidth>
                <TileHeight>512</TileHeight>
                <MatrixWidth>2</MatrixWidth>
                <MatrixHeight>1</MatrixHeight>
            </TileMatrix>
        </TileMatrixSet>
    </Contents>
</Capabilities>`
}

describe('<terra-map> layers (gibs)', () => {
    let originalFetch: typeof fetch

    beforeEach(() => {
        originalFetch = window.fetch
    })

    afterEach(() => {
        window.fetch = originalFetch
    })

    function stubFetch(xml: string) {
        window.fetch = (async () =>
            new Response(xml, { status: 200 })) as typeof fetch
    }

    describe('attribute parsing', () => {
        it('parses a JSON array from the layers attribute', async () => {
            const el = await fixture<TerraMap>(html`
                <terra-map
                    layers='[{ "type": "gibs", "name": "imagery", "layer": "TestLayer" }]'
                ></terra-map>
            `)

            expect(el.layers).to.deep.equal([
                { type: 'gibs', name: 'imagery', layer: 'TestLayer' },
            ])
        })

        it('falls back to an empty array for missing/invalid JSON', async () => {
            const el = await fixture<TerraMap>(
                html`<terra-map layers="not json"></terra-map>`
            )

            expect(el.layers).to.deep.equal([])
        })

        it('falls back to an empty array when the parsed value is not an array', async () => {
            const el = await fixture<TerraMap>(
                html`<terra-map layers='{ "name": "imagery" }'></terra-map>`
            )

            expect(el.layers).to.deep.equal([])
        })
    })

    describe('declared up front (EPSG:3857, sync)', () => {
        it('adds a layer for each entry in layers', async () => {
            const el = await fixture<TerraMap>(html`
                <terra-map
                    layers='[{ "type": "gibs", "name": "imagery", "layer": "TestLayer" }]'
                ></terra-map>
            `)

            await waitUntil(() => el.getLayer('imagery'))

            const layer = el.getLayer('imagery') as TileLayer | undefined
            expect(layer).to.exist
            expect(layer?.getSource()).to.be.instanceOf(ImageTile)
        })

        it('emits terra-map-layer-change once the layer is built', async () => {
            const el = await fixture<TerraMap>(html`<terra-map></terra-map>`)
            const changeSpy = sinon.spy()
            el.addEventListener('terra-map-layer-change', changeSpy)

            el.layers = [{ type: 'gibs', name: 'imagery', layer: 'TestLayer' }]

            await waitUntil(() => changeSpy.called)

            const detail = changeSpy.firstCall.args[0].detail
            expect(detail).to.deep.equal({ name: 'imagery', type: 'gibs' })
        })
    })

    describe('forProjection (async, non-EPSG:3857)', () => {
        it('adds the resolved layer once the GetCapabilities fetch completes', async () => {
            stubFetch(makeCapabilitiesXml('EPSG:3413', '1km'))

            const el = await fixture<TerraMap>(html`<terra-map></terra-map>`)
            el.layers = [
                {
                    type: 'gibs',
                    name: 'polar',
                    layer: 'TestLayer',
                    projection: 'EPSG:3413',
                },
            ]

            await waitUntil(() => el.getLayer('polar'))

            const layer = el.getLayer('polar') as TileLayer | undefined
            expect(layer).to.exist
            expect(layer?.getSource()).to.be.instanceOf(WMTS)
        })
    })

    describe('projection', () => {
        it('defaults to EPSG:3857', async () => {
            const el = await fixture<TerraMap>(html`<terra-map></terra-map>`)

            expect(el.projection).to.equal('EPSG:3857')
        })

        it('passes the projection attribute through to the map view', async () => {
            const el = await fixture<TerraMap>(
                html`<terra-map projection="EPSG:3413"></terra-map>`
            )

            expect(el.projection).to.equal('EPSG:3413')
        })

        it('warns when a gibs layers entry does not match the configured projection', async () => {
            stubFetch(makeCapabilitiesXml('EPSG:3413', '1km'))
            const warnSpy = sinon.spy(console, 'warn')

            const el = await fixture<TerraMap>(html`<terra-map></terra-map>`)
            el.layers = [
                {
                    type: 'gibs',
                    name: 'polar',
                    layer: 'TestLayer',
                    projection: 'EPSG:3413',
                },
            ]

            await waitUntil(() => el.getLayer('polar'))

            expect(
                warnSpy.calledWith(sinon.match(/published in EPSG:3413.*EPSG:3857/))
            ).to.be.true
            warnSpy.restore()
        })

        it('does not warn when a gibs layers entry matches the configured projection', async () => {
            stubFetch(makeCapabilitiesXml('EPSG:3413', '1km'))
            const warnSpy = sinon.spy(console, 'warn')

            const el = await fixture<TerraMap>(
                html`<terra-map projection="EPSG:3413"></terra-map>`
            )
            el.layers = [
                {
                    type: 'gibs',
                    name: 'polar',
                    layer: 'TestLayer',
                    projection: 'EPSG:3413',
                },
            ]

            await waitUntil(() => el.getLayer('polar'))

            expect(warnSpy.called).to.be.false
            warnSpy.restore()
        })
    })

    describe('vector gibs layers (type: "gibs-vector")', () => {
        function stubVectorFetch() {
            window.fetch = (async () =>
                new Response(
                    `<?xml version="1.0" encoding="UTF-8"?>
<Capabilities xmlns="http://www.opengis.net/wmts/1.0" xmlns:ows="http://www.opengis.net/ows/1.1" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.0.0">
    <Contents>
        <Layer>
            <ows:Title>GRanD_Dams</ows:Title>
            <ows:Identifier>GRanD_Dams</ows:Identifier>
            <Style isDefault="true"><ows:Identifier>default</ows:Identifier></Style>
            <Format>application/vnd.mapbox-vector-tile</Format>
            <TileMatrixSetLink><TileMatrixSet>2km</TileMatrixSet></TileMatrixSetLink>
            <ResourceURL format="application/vnd.mapbox-vector-tile" resourceType="tile" template="https://example.com/epsg4326/GRanD_Dams/default/{Time}/2km/{TileMatrix}/{TileRow}/{TileCol}.mvt"/>
        </Layer>
        <TileMatrixSet>
            <ows:Identifier>2km</ows:Identifier>
            <ows:SupportedCRS>urn:ogc:def:crs:EPSG::4326</ows:SupportedCRS>
            <TileMatrix>
                <ows:Identifier>0</ows:Identifier>
                <ScaleDenominator>279541132.0143589</ScaleDenominator>
                <TopLeftCorner>-180 90</TopLeftCorner>
                <TileWidth>512</TileWidth>
                <TileHeight>512</TileHeight>
                <MatrixWidth>2</MatrixWidth>
                <MatrixHeight>1</MatrixHeight>
            </TileMatrix>
        </TileMatrixSet>
    </Contents>
</Capabilities>`,
                    { status: 200 }
                )) as typeof fetch
        }

        it('adds a VectorTileLayer for a type: "gibs-vector" entry', async () => {
            stubVectorFetch()

            const el = await fixture<TerraMap>(html`<terra-map></terra-map>`)
            el.layers = [{ type: 'gibs-vector', name: 'dams', layer: 'GRanD_Dams' }]

            await waitUntil(() => el.getLayer('dams'))

            expect(el.getLayer('dams')).to.exist
        })
    })

    describe('getFeaturesAtPixel', () => {
        it('delegates to the underlying map service', async () => {
            const el = await fixture<TerraMap>(html`<terra-map></terra-map>`)

            expect(() => el.getFeaturesAtPixel([0, 0])).to.not.throw()
        })
    })

    describe('diffing on updates', () => {
        it('removes a layer whose entry is dropped from the array', async () => {
            const el = await fixture<TerraMap>(html`<terra-map></terra-map>`)
            el.layers = [{ type: 'gibs', name: 'imagery', layer: 'TestLayer' }]
            await waitUntil(() => el.getLayer('imagery'))

            el.layers = []
            await waitUntil(() => !el.getLayer('imagery'))

            expect(el.getLayer('imagery')).to.not.exist
        })

        it('rebuilds a layer whose config changed', async () => {
            const el = await fixture<TerraMap>(html`<terra-map></terra-map>`)
            el.layers = [
                {
                    type: 'gibs',
                    name: 'imagery',
                    layer: 'TestLayer',
                    date: '2024-06-01',
                },
            ]
            await waitUntil(() => el.getLayer('imagery'))
            const firstLayer = el.getLayer('imagery')

            el.layers = [
                {
                    type: 'gibs',
                    name: 'imagery',
                    layer: 'TestLayer',
                    date: '2024-06-02',
                },
            ]
            await waitUntil(() => el.getLayer('imagery') !== firstLayer)

            const secondLayer = el.getLayer('imagery')
            expect(secondLayer).to.exist
            expect(secondLayer).to.not.equal(firstLayer)
        })

        it('leaves an unchanged entry alone', async () => {
            const el = await fixture<TerraMap>(html`<terra-map></terra-map>`)
            el.layers = [{ type: 'gibs', name: 'imagery', layer: 'TestLayer' }]
            await waitUntil(() => el.getLayer('imagery'))
            const firstLayer = el.getLayer('imagery')

            // re-assign an equivalent (but new) array reference
            el.layers = [{ type: 'gibs', name: 'imagery', layer: 'TestLayer' }]
            await el.updateComplete

            expect(el.getLayer('imagery')).to.equal(firstLayer)
        })
    })
})

describe('<terra-map> layers (geotiff)', () => {
    // NOTE: `ol/source/GeoTIFF.js` statically imports the `geotiff` npm
    // package, which only ships Node and bundled-browser builds - not a
    // plain unbundled ESM build - so web-test-runner's unbundled dev server
    // can't load it (a pre-existing, environment-level constraint; a bundled
    // build, e.g. `npm run build`, resolves it fine). That means every
    // geotiff-type `layers` build attempt below rejects, exercising
    // `layersChanged`'s error path, diffing, and cleanup logic - just not the
    // happy-path layer construction itself (covered indirectly by
    // `geotiff.layer.test.ts`'s unit tests of the underlying math).

    it('emits an error event when the layer fails to build', async () => {
        const el = await fixture<TerraMap>(html`<terra-map></terra-map>`)
        const changeSpy = sinon.spy()
        el.addEventListener('terra-map-layer-change', changeSpy)

        el.layers = [
            { type: 'geotiff', name: 'my-data', url: 'https://example.com/data.tif' },
        ]

        await waitUntil(() => changeSpy.called)

        const detail = changeSpy.firstCall.args[0].detail
        expect(detail.name).to.equal('my-data')
        expect(detail.type).to.equal('geotiff')
        expect(detail.error).to.be.instanceOf(Error)
        expect(el.getLayer('my-data')).to.not.exist
        expect(el.getGeoTiffLayerInfo('my-data')).to.be.undefined
    })

    it('removes a dropped entry without throwing, even if it never finished building', async () => {
        const el = await fixture<TerraMap>(html`<terra-map></terra-map>`)
        el.layers = [
            { type: 'geotiff', name: 'my-data', url: 'https://example.com/data.tif' },
        ]
        await el.updateComplete

        expect(() => {
            el.layers = []
        }).to.not.throw()
        await el.updateComplete

        expect(el.getLayer('my-data')).to.not.exist
        expect(el.getGeoTiffLayerInfo('my-data')).to.be.undefined
    })

    it('getGeoTiffValueAtPixel returns undefined for a layer that never finished building', async () => {
        const el = await fixture<TerraMap>(html`<terra-map></terra-map>`)
        el.layers = [
            { type: 'geotiff', name: 'my-data', url: 'https://example.com/data.tif' },
        ]
        await el.updateComplete

        expect(el.getGeoTiffValueAtPixel('my-data', [0, 0])).to.be.undefined
    })

    it('does not throw when the config changes again before the previous attempt settles', async () => {
        const el = await fixture<TerraMap>(html`<terra-map></terra-map>`)

        el.layers = [
            { type: 'geotiff', name: 'my-data', url: 'https://example.com/a.tif' },
        ]
        el.layers = [
            { type: 'geotiff', name: 'my-data', url: 'https://example.com/b.tif' },
        ]

        // give both build attempts a chance to settle
        await new Promise(resolve => setTimeout(resolve, 50))

        expect(el.getGeoTiffLayerInfo('my-data')).to.be.undefined
        expect(el.getLayer('my-data')).to.not.exist
    })
})

describe('<terra-map> layer picker', () => {
    it('emits terra-map-layer-toggle and switches base layers when a radio option is selected', async () => {
        const el = await fixture<TerraMap>(
            html`<terra-map show-layer-picker></terra-map>`
        )
        const toggleSpy = sinon.spy()
        el.addEventListener('terra-map-layer-toggle', toggleSpy)

        const toggleBtn = el.shadowRoot?.querySelector(
            '.layer-picker-toggle'
        ) as HTMLButtonElement
        expect(toggleBtn.style.display).to.equal('flex')

        toggleBtn.click()

        const radios = el.shadowRoot?.querySelectorAll(
            '.layer-picker-panel input[type="radio"]'
        ) as NodeListOf<HTMLInputElement>
        expect(radios.length).to.equal(3)

        // Select OpenStreetMap (second base layer)
        radios[1].checked = true
        radios[1].dispatchEvent(new Event('change'))

        expect(el.getLayer('base')?.getVisible()).to.be.false
        expect(el.getLayer('osm')?.getVisible()).to.be.true
        expect(el.getLayer('topo')?.getVisible()).to.be.false

        expect(toggleSpy.calledOnce).to.be.true
        const detail = toggleSpy.firstCall.args[0].detail
        expect(detail).to.include({
            name: 'osm',
            title: 'OpenStreetMap',
            type: 'base',
            visible: true,
        })
        expect(detail.layer).to.equal(el.getLayer('osm'))
    })

    it('synchronizes showGraticule when the Graticule overlay checkbox is toggled', async () => {
        const el = await fixture<TerraMap>(
            html`<terra-map show-layer-picker show-graticule></terra-map>`
        )
        expect(el.showGraticule).to.be.true
        expect(el.getLayer('graticule')?.getVisible()).to.be.true

        const toggleBtn = el.shadowRoot?.querySelector(
            '.layer-picker-toggle'
        ) as HTMLButtonElement
        toggleBtn.click()

        const checkboxes = el.shadowRoot?.querySelectorAll(
            '.layer-picker-panel input[type="checkbox"]'
        ) as NodeListOf<HTMLInputElement>
        // Graticule is the topmost overlay (first checkbox)
        expect(checkboxes[0].checked).to.be.true

        checkboxes[0].checked = false
        checkboxes[0].dispatchEvent(new Event('change'))

        expect(el.showGraticule).to.be.false
        expect(el.getLayer('graticule')?.getVisible()).to.be.false
    })
})

describe('<terra-map> collection-id', () => {
    const ENTRY_ID = 'AIRS2RET_NRT_7.0'

    let apiGetStub: sinon.SinonStub
    let originalFetch: typeof fetch

    /** Stubs `apiClient.get` so only `collections.json` requests resolve with `response` — other requests (e.g. the map's unrelated Giovanni shapefiles query) are left alone. */
    function stubCollectionTags(response: unknown) {
        apiGetStub.callsFake((url: string) => {
            if (url.includes('collections.json')) {
                return Promise.resolve(response)
            }
            return Promise.resolve({ categories: [] })
        })
    }

    function makeTagsResponse(
        entries: Array<{
            product: string
            geographic?: boolean
            arctic?: boolean
            antarctic?: boolean
        }>
    ) {
        return {
            feed: {
                entry: [
                    {
                        tags: {
                            'edsc.extra.serverless.gibs': {
                                data: entries.map(entry => ({
                                    product: entry.product,
                                    title: entry.product,
                                    source: 'Test',
                                    group: 'overlays',
                                    format: 'png',
                                    layerPeriod: 'Daily',
                                    geographic: entry.geographic ?? true,
                                    geographic_resolution: '2km',
                                    arctic: entry.arctic ?? false,
                                    arctic_resolution: null,
                                    antarctic: entry.antarctic ?? false,
                                    antarctic_resolution: null,
                                    match: {},
                                    updated_at: '2026-10-19T12:45:17.245Z',
                                })),
                            },
                        },
                    },
                ],
            },
        }
    }

    beforeEach(() => {
        apiGetStub = sinon.stub(apiClient, 'get')
        originalFetch = window.fetch
    })

    afterEach(() => {
        sinon.restore()
        window.fetch = originalFetch
    })

    it('adds one layer per GIBS product tagged on the collection', async () => {
        stubCollectionTags(
            makeTagsResponse([
                { product: 'AIRS_L2_Surface_Air_Temperature_Day' },
                { product: 'AIRS_L2_Surface_Air_Temperature_Night' },
            ])
        )

        const el = await fixture<TerraMap>(
            html`<terra-map collection-id=${ENTRY_ID}></terra-map>`
        )

        await waitUntil(() =>
            el.getLayer(`${ENTRY_ID}:AIRS_L2_Surface_Air_Temperature_Day`)
        )
        await waitUntil(() =>
            el.getLayer(`${ENTRY_ID}:AIRS_L2_Surface_Air_Temperature_Night`)
        )

        expect(el.getLayer(`${ENTRY_ID}:AIRS_L2_Surface_Air_Temperature_Day`)).to
            .exist
        expect(el.getLayer(`${ENTRY_ID}:AIRS_L2_Surface_Air_Temperature_Night`)).to
            .exist
    })

    it("only adds layers available in the map's current projection", async () => {
        window.fetch = (async () =>
            new Response(makeCapabilitiesXml('EPSG:3413', '1km'), {
                status: 200,
            })) as typeof fetch
        stubCollectionTags(
            makeTagsResponse([
                { product: 'Geographic_Only', geographic: true, arctic: false },
                // 'TestLayer' is the layer identifier baked into makeCapabilitiesXml()
                { product: 'TestLayer', geographic: false, arctic: true },
            ])
        )

        const el = await fixture<TerraMap>(
            html`<terra-map
                collection-id=${ENTRY_ID}
                projection="EPSG:3413"
            ></terra-map>`
        )

        await waitUntil(() => el.getLayer(`${ENTRY_ID}:TestLayer`))

        expect(el.getLayer(`${ENTRY_ID}:TestLayer`)).to.exist
        expect(el.getLayer(`${ENTRY_ID}:Geographic_Only`)).to.not.exist
    })

    it('removes the collection layers when collection-id is cleared', async () => {
        stubCollectionTags(makeTagsResponse([{ product: 'Test_Layer' }]))

        const el = await fixture<TerraMap>(
            html`<terra-map collection-id=${ENTRY_ID}></terra-map>`
        )

        await waitUntil(() => el.getLayer(`${ENTRY_ID}:Test_Layer`))

        el.collectionId = undefined
        await waitUntil(() => !el.getLayer(`${ENTRY_ID}:Test_Layer`))

        expect(el.getLayer(`${ENTRY_ID}:Test_Layer`)).to.not.exist
    })

    it('looks up by entry_id[] when given an entry-id', async () => {
        stubCollectionTags(makeTagsResponse([]))

        await fixture<TerraMap>(
            html`<terra-map collection-id=${ENTRY_ID}></terra-map>`
        )

        await waitUntil(() =>
            apiGetStub
                .getCalls()
                .some(call => call.args[0].includes('collections.json'))
        )
        const call = apiGetStub
            .getCalls()
            .find(call => call.args[0].includes('collections.json'))
        expect(call?.args[0]).to.include(`entry_id[]=${ENTRY_ID}`)
    })

    it('looks up by concept-id when given a concept-id', async () => {
        const CONCEPT_ID = 'C1234567890-GES_DISC'
        stubCollectionTags(makeTagsResponse([]))

        await fixture<TerraMap>(
            html`<terra-map collection-id=${CONCEPT_ID}></terra-map>`
        )

        await waitUntil(() =>
            apiGetStub
                .getCalls()
                .some(call => call.args[0].includes('collections.json'))
        )
        const call = apiGetStub
            .getCalls()
            .find(call => call.args[0].includes('collections.json'))
        expect(call?.args[0]).to.include(`concept-id=${CONCEPT_ID}`)
        expect(call?.args[0]).to.not.include('entry_id')
    })
})
