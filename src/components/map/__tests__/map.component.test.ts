import { expect, fixture, html, waitUntil } from '@open-wc/testing'
import sinon from 'sinon'
import ImageTile from 'ol/source/ImageTile.js'
import WMTS from 'ol/source/WMTS.js'
import type TileLayer from 'ol/layer/Tile.js'
import TerraMap from '../map.component.js'
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

describe('<terra-map> gibs-layers', () => {
    let originalFetch: typeof fetch

    beforeEach(() => {
        originalFetch = window.fetch
    })

    afterEach(() => {
        window.fetch = originalFetch
    })

    function stubFetch(xml: string) {
        window.fetch = (async () => new Response(xml, { status: 200 })) as typeof fetch
    }

    describe('attribute parsing', () => {
        it('parses a JSON array from the gibs-layers attribute', async () => {
            const el = await fixture<TerraMap>(html`
                <terra-map
                    gibs-layers='[{ "name": "imagery", "layer": "TestLayer" }]'
                ></terra-map>
            `)

            expect(el.gibsLayers).to.deep.equal([
                { name: 'imagery', layer: 'TestLayer' },
            ])
        })

        it('falls back to an empty array for missing/invalid JSON', async () => {
            const el = await fixture<TerraMap>(
                html`<terra-map gibs-layers="not json"></terra-map>`
            )

            expect(el.gibsLayers).to.deep.equal([])
        })

        it('falls back to an empty array when the parsed value is not an array', async () => {
            const el = await fixture<TerraMap>(
                html`<terra-map gibs-layers='{ "name": "imagery" }'></terra-map>`
            )

            expect(el.gibsLayers).to.deep.equal([])
        })
    })

    describe('declared up front (EPSG:3857, sync)', () => {
        it('adds a layer for each entry in gibs-layers', async () => {
            const el = await fixture<TerraMap>(html`
                <terra-map
                    gibs-layers='[{ "name": "imagery", "layer": "TestLayer" }]'
                ></terra-map>
            `)

            await waitUntil(() => el.getLayer('imagery'))

            const layer = el.getLayer('imagery') as TileLayer | undefined
            expect(layer).to.exist
            expect(layer!.getSource()).to.be.instanceOf(ImageTile)
        })
    })

    describe('forProjection (async, non-EPSG:3857)', () => {
        it('adds the resolved layer once the GetCapabilities fetch completes', async () => {
            stubFetch(makeCapabilitiesXml('EPSG:3413', '1km'))

            const el = await fixture<TerraMap>(
                html`<terra-map></terra-map>`
            )
            el.gibsLayers = [
                { name: 'polar', layer: 'TestLayer', projection: 'EPSG:3413' },
            ]

            await waitUntil(() => el.getLayer('polar'))

            const layer = el.getLayer('polar') as TileLayer | undefined
            expect(layer).to.exist
            expect(layer!.getSource()).to.be.instanceOf(WMTS)
        })
    })

    describe('projection', () => {
        it('defaults to EPSG:3857', async () => {
            const el = await fixture<TerraMap>(html`<terra-map></terra-map>`)

            expect(el.projection).to.equal('EPSG:3857')
        })

        it('passes the projection attribute through to the map view', async () => {
            const el = await fixture<TerraMap>(
                html`<terra-map projection="EPSG:3413"></terra-map>`,
            )

            expect(el.projection).to.equal('EPSG:3413')
        })

        it('warns when a gibs-layers entry does not match the configured projection', async () => {
            stubFetch(makeCapabilitiesXml('EPSG:3413', '1km'))
            const warnSpy = sinon.spy(console, 'warn')

            const el = await fixture<TerraMap>(html`<terra-map></terra-map>`)
            el.gibsLayers = [
                { name: 'polar', layer: 'TestLayer', projection: 'EPSG:3413' },
            ]

            await waitUntil(() => el.getLayer('polar'))

            expect(
                warnSpy.calledWith(
                    sinon.match(/published in EPSG:3413.*EPSG:3857/),
                ),
            ).to.be.true
            warnSpy.restore()
        })

        it('does not warn when a gibs-layers entry matches the configured projection', async () => {
            stubFetch(makeCapabilitiesXml('EPSG:3413', '1km'))
            const warnSpy = sinon.spy(console, 'warn')

            const el = await fixture<TerraMap>(
                html`<terra-map projection="EPSG:3413"></terra-map>`,
            )
            el.gibsLayers = [
                { name: 'polar', layer: 'TestLayer', projection: 'EPSG:3413' },
            ]

            await waitUntil(() => el.getLayer('polar'))

            expect(warnSpy.called).to.be.false
            warnSpy.restore()
        })
    })

    describe('vector gibs-layers (type: "vector")', () => {
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
                    { status: 200 },
                )) as typeof fetch
        }

        it('adds a VectorTileLayer for a type: "vector" entry', async () => {
            stubVectorFetch()

            const el = await fixture<TerraMap>(html`<terra-map></terra-map>`)
            el.gibsLayers = [
                { name: 'dams', type: 'vector', layer: 'GRanD_Dams' },
            ]

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
            const el = await fixture<TerraMap>(
                html`<terra-map></terra-map>`
            )
            el.gibsLayers = [{ name: 'imagery', layer: 'TestLayer' }]
            await waitUntil(() => el.getLayer('imagery'))

            el.gibsLayers = []
            await waitUntil(() => !el.getLayer('imagery'))

            expect(el.getLayer('imagery')).to.not.exist
        })

        it('rebuilds a layer whose config changed', async () => {
            const el = await fixture<TerraMap>(
                html`<terra-map></terra-map>`
            )
            el.gibsLayers = [{ name: 'imagery', layer: 'TestLayer', date: '2024-06-01' }]
            await waitUntil(() => el.getLayer('imagery'))
            const firstLayer = el.getLayer('imagery')

            el.gibsLayers = [{ name: 'imagery', layer: 'TestLayer', date: '2024-06-02' }]
            await waitUntil(() => el.getLayer('imagery') !== firstLayer)

            const secondLayer = el.getLayer('imagery')
            expect(secondLayer).to.exist
            expect(secondLayer).to.not.equal(firstLayer)
        })

        it('leaves an unchanged entry alone', async () => {
            const el = await fixture<TerraMap>(
                html`<terra-map></terra-map>`
            )
            el.gibsLayers = [{ name: 'imagery', layer: 'TestLayer' }]
            await waitUntil(() => el.getLayer('imagery'))
            const firstLayer = el.getLayer('imagery')

            // re-assign an equivalent (but new) array reference
            el.gibsLayers = [{ name: 'imagery', layer: 'TestLayer' }]
            await el.updateComplete

            expect(el.getLayer('imagery')).to.equal(firstLayer)
        })
    })
})
