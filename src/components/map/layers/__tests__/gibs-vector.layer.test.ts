import { expect } from '@open-wc/testing'
import VectorTileLayer from 'ol/layer/VectorTile.js'
import VectorTileSource from 'ol/source/VectorTile.js'
import { Style } from 'ol/style.js'
import { buildGibsVectorLayer } from '../gibs-vector.layer.js'

function makeVectorCapabilitiesXml(layer: string, matrixSet: string) {
    return `<?xml version="1.0" encoding="UTF-8"?>
<Capabilities xmlns="http://www.opengis.net/wmts/1.0" xmlns:ows="http://www.opengis.net/ows/1.1" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.0.0">
    <Contents>
        <Layer>
            <ows:Title>${layer}</ows:Title>
            <ows:Identifier>${layer}</ows:Identifier>
            <Style isDefault="true">
                <ows:Identifier>default</ows:Identifier>
            </Style>
            <Format>application/vnd.mapbox-vector-tile</Format>
            <Dimension>
                <ows:Identifier>Time</ows:Identifier>
                <Default>default</Default>
                <Value>2020-03-18</Value>
            </Dimension>
            <TileMatrixSetLink>
                <TileMatrixSet>${matrixSet}</TileMatrixSet>
            </TileMatrixSetLink>
            <ResourceURL format="application/vnd.mapbox-vector-tile" resourceType="tile" template="https://example.com/epsg4326/${layer}/default/{Time}/${matrixSet}/{TileMatrix}/{TileRow}/{TileCol}.mvt"/>
        </Layer>
        <TileMatrixSet>
            <ows:Identifier>${matrixSet}</ows:Identifier>
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
</Capabilities>`
}

describe('buildGibsVectorLayer', () => {
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

    it('resolves to a VectorTileLayer wrapping an ol/source/VectorTile', async () => {
        stubFetch(makeVectorCapabilitiesXml('GRanD_Dams', '2km'))

        const layer = await buildGibsVectorLayer({
            layer: 'GRanD_Dams',
            tileMatrixSet: '2km',
        })

        expect(layer).to.be.instanceOf(VectorTileLayer)
        expect(layer.getSource()).to.be.instanceOf(VectorTileSource)
    })

    it('builds a KVP GetTile URL with the given layer/date/tileMatrixSet', async () => {
        stubFetch(makeVectorCapabilitiesXml('GRanD_Dams', '2km'))

        const layer = await buildGibsVectorLayer({
            layer: 'GRanD_Dams',
            date: '2020-03-18',
            tileMatrixSet: '2km',
        })
        const source = layer.getSource() as VectorTileSource
        const urls = source.getUrls()

        expect(urls).to.exist
        const url = urls![0]
        expect(url).to.include('TIME=2020-03-18')
        expect(url).to.include('layer=GRanD_Dams')
        expect(url).to.include('tilematrixset=2km')
        expect(url).to.include('FORMAT=application%2Fvnd.mapbox-vector-tile')
        expect(url).to.include('TileMatrix={z}')
        expect(url).to.include('TileCol={x}')
        expect(url).to.include('TileRow={y}')
    })

    it('defaults date to "default" and tileMatrixSet to "2km"', async () => {
        stubFetch(makeVectorCapabilitiesXml('GRanD_Dams', '2km'))

        const layer = await buildGibsVectorLayer({ layer: 'GRanD_Dams' })
        const source = layer.getSource() as VectorTileSource
        const url = source.getUrls()![0]

        expect(url).to.include('TIME=default')
        expect(url).to.include('tilematrixset=2km')
    })

    it('propagates noWorldWrap to wrapX: false on the source', async () => {
        stubFetch(makeVectorCapabilitiesXml('GRanD_Dams', '2km'))

        const layer = await buildGibsVectorLayer({
            layer: 'GRanD_Dams',
            noWorldWrap: true,
        })
        const source = layer.getSource() as VectorTileSource

        expect(source.getWrapX()).to.be.false
    })

    it('clips rendering to the given EPSG:4326 extent', async () => {
        stubFetch(makeVectorCapabilitiesXml('GRanD_Dams', '2km'))

        const layer = await buildGibsVectorLayer({
            layer: 'GRanD_Dams',
            extent: [-10, -10, 10, 10],
        })

        expect(layer.getExtent()).to.exist
    })

    it('applies a default style when none is given', async () => {
        stubFetch(makeVectorCapabilitiesXml('GRanD_Dams', '2km'))

        const layer = await buildGibsVectorLayer({ layer: 'GRanD_Dams' })

        expect(layer.getStyle()).to.be.instanceOf(Style)
    })

    it('applies a Mapbox style JSON when style/styleSourceId are given', async () => {
        stubFetch(makeVectorCapabilitiesXml('GRanD_Dams', '2km'))

        const style = {
            version: 8,
            name: 'Test',
            sources: {
                GRanD_Dams: {
                    type: 'vector',
                    tiles: ['https://example.com/{z}/{x}/{y}.mvt'],
                },
            },
            layers: [
                {
                    id: 'dams',
                    source: 'GRanD_Dams',
                    'source-layer': 'GRanD_Dams',
                    type: 'circle',
                    paint: { 'circle-radius': 3, 'circle-color': '#ff0000' },
                },
            ],
        }

        const layer = await buildGibsVectorLayer({
            layer: 'GRanD_Dams',
            style,
            styleSourceId: 'GRanD_Dams',
        })

        expect(layer.getStyleFunction()).to.exist
    })

    it('throws if style is given without styleSourceId', async () => {
        stubFetch(makeVectorCapabilitiesXml('GRanD_Dams', '2km'))

        let error: unknown
        try {
            await buildGibsVectorLayer({
                layer: 'GRanD_Dams',
                style: { version: 8, sources: {}, layers: [] },
            })
        } catch (e) {
            error = e
        }

        expect(error).to.be.instanceOf(Error)
    })

    it('throws when the layer is not found in GetCapabilities', async () => {
        stubFetch(makeVectorCapabilitiesXml('GRanD_Dams', '2km'))

        let error: unknown
        try {
            await buildGibsVectorLayer({ layer: 'NotARealLayer' })
        } catch (e) {
            error = e
        }

        expect(error).to.be.instanceOf(Error)
    })
})
