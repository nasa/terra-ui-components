import { expect } from '@open-wc/testing'
import TileLayer from 'ol/layer/Tile.js'
import ImageTile from 'ol/source/ImageTile.js'
import WMTS from 'ol/source/WMTS.js'
import { buildGibsLayer, GibsLayer, getGibsLegendUrls } from '../gibs.layer.js'
import '../../projections.js'

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

describe('GibsLayer', () => {
    describe('EPSG:3857 (constructor)', () => {
        it('should create a TileLayer with an ImageTile source', () => {
            const layer = new GibsLayer({ layer: 'TestLayer' })

            expect(layer.getSource()).to.be.instanceOf(ImageTile)
        })

        it('should build the GIBS RESTful WMTS-as-XYZ URL from layer/date/tileMatrixSet/format', () => {
            const layer = new GibsLayer({
                layer: 'MODIS_Terra_CorrectedReflectance_TrueColor',
                date: '2024-06-01',
                tileMatrixSet: 'GoogleMapsCompatible_Level9',
                format: 'png',
            })
            const source = layer.getSource() as ImageTile
            const url = source.getKey()

            expect(url).to.include('gibs.earthdata.nasa.gov/wmts/epsg3857/best')
            expect(url).to.include('MODIS_Terra_CorrectedReflectance_TrueColor')
            expect(url).to.include('2024-06-01')
            expect(url).to.include('GoogleMapsCompatible_Level9')
            expect(url).to.include('.png')
        })

        it('should default date to "default", tileMatrixSet to GoogleMapsCompatible_Level9, and format to jpg', () => {
            const layer = new GibsLayer({ layer: 'TestLayer' })
            const source = layer.getSource() as ImageTile
            const url = source.getKey()

            expect(url).to.include('/default/')
            expect(url).to.include('GoogleMapsCompatible_Level9')
            expect(url).to.include('.jpg')
        })

        it('should provide NASA EOSDIS GIBS attributions', () => {
            const layer = new GibsLayer({ layer: 'TestLayer' })
            const source = layer.getSource() as ImageTile

            const attributions = source.getAttributions()
            expect(attributions).to.exist
            expect(attributions!({} as any)).to.include('NASA EOSDIS GIBS')
        })

        it('should propagate noWorldWrap to wrapX: false on the source', () => {
            const layer = new GibsLayer({
                layer: 'TestLayer',
                noWorldWrap: true,
            })
            const source = layer.getSource() as ImageTile

            expect(source.getWrapX()).to.be.false
        })

        it('should clip rendering to the given EPSG:4326 extent', () => {
            const layer = new GibsLayer({
                layer: 'TestLayer',
                extent: [-10, -10, 10, 10],
            })

            expect(layer.getExtent()).to.exist
        })

        it('should tag the layer with its original EPSG:4326 extent as sourceExtent', () => {
            const layer = new GibsLayer({
                layer: 'TestLayer',
                extent: [-10, -10, 10, 10],
            })

            expect(layer.get('sourceExtent')).to.deep.equal([-10, -10, 10, 10])
        })

        it('should not set sourceExtent when no extent is given', () => {
            const layer = new GibsLayer({ layer: 'TestLayer' })

            expect(layer.get('sourceExtent')).to.be.undefined
        })
    })

    describe('forProjection (EPSG:4326 / EPSG:3413 / EPSG:3031)', () => {
        let originalFetch: typeof fetch
        let fetchCallCount: number

        beforeEach(() => {
            originalFetch = window.fetch
            fetchCallCount = 0
        })

        afterEach(() => {
            window.fetch = originalFetch
        })

        function stubFetch(xml: string) {
            window.fetch = (async () => {
                fetchCallCount++
                return new Response(xml, { status: 200 })
            }) as typeof fetch
        }

        it('should resolve to a TileLayer wrapping an ol/source/WMTS', async () => {
            stubFetch(makeCapabilitiesXml('EPSG:4326', '2km'))

            const layer = await GibsLayer.forProjection({
                layer: 'TestLayer',
                date: '2024-06-01',
                projection: 'EPSG:4326',
            })

            expect(layer).to.be.instanceOf(TileLayer)
            expect(layer.getSource()).to.be.instanceOf(WMTS)
        })

        it('should set the Time dimension from the date option', async () => {
            stubFetch(makeCapabilitiesXml('EPSG:4326', '2km'))

            const layer = await GibsLayer.forProjection({
                layer: 'TestLayer',
                date: '2024-06-01',
                projection: 'EPSG:4326',
            })
            const source = layer.getSource() as WMTS

            expect(source.getDimensions()).to.deep.include({
                Time: '2024-06-01',
            })
        })

        it('should cache the capabilities fetch per projection', async () => {
            stubFetch(makeCapabilitiesXml('EPSG:3413', '1km'))

            await GibsLayer.forProjection({
                layer: 'TestLayer',
                projection: 'EPSG:3413',
            })
            await GibsLayer.forProjection({
                layer: 'TestLayer',
                projection: 'EPSG:3413',
            })

            expect(fetchCallCount).to.equal(1)
        })

        it('should reproject the extent from EPSG:4326 into the target projection', async () => {
            stubFetch(makeCapabilitiesXml('EPSG:3031', '1km'))

            const layer = await GibsLayer.forProjection({
                layer: 'TestLayer',
                projection: 'EPSG:3031',
                extent: [-10, -80, 10, -70],
            })

            const extent = layer.getExtent()!
            expect(extent).to.exist
            // EPSG:4326 (-10, -80) should not equal the EPSG:3031 meters-based extent
            expect(extent[0]).to.not.equal(-10)
        })

        it('should tag the layer with the original EPSG:4326 extent as sourceExtent', async () => {
            stubFetch(makeCapabilitiesXml('EPSG:3031', '1km'))

            const layer = await GibsLayer.forProjection({
                layer: 'TestLayer',
                projection: 'EPSG:3031',
                extent: [-10, -80, 10, -70],
            })

            expect(layer.get('sourceExtent')).to.deep.equal([-10, -80, 10, -70])
        })

        it('should not set sourceExtent when no extent is given', async () => {
            stubFetch(makeCapabilitiesXml('EPSG:3031', '1km'))

            const layer = await GibsLayer.forProjection({
                layer: 'TestLayer',
                projection: 'EPSG:3031',
            })

            expect(layer.get('sourceExtent')).to.be.undefined
        })
    })
})

describe('GIBS color map legend URLs', () => {
    // EPSG:3857's capabilities doc isn't touched by any other test in this
    // file (its sync GibsLayer constructor never fetches), so it's safe to
    // share one cached fetch across these assertions.
    const CAPABILITIES_XML = `<?xml version="1.0" encoding="UTF-8"?>
<Capabilities xmlns="http://www.opengis.net/wmts/1.0" xmlns:ows="http://www.opengis.net/ows/1.1" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.0.0">
    <Contents>
        <Layer>
            <ows:Title>With Legend</ows:Title>
            <ows:Identifier>WithLegend</ows:Identifier>
            <Style isDefault="true">
                <ows:Identifier>default</ows:Identifier>
                <LegendURL xlink:type="simple" xlink:href="https://example.com/legend-h.svg" xlink:role="http://earthdata.nasa.gov/gibs/legend-type/horizontal" format="image/svg+xml" width="378" height="86"/>
                <LegendURL xlink:type="simple" xlink:href="https://example.com/legend-v.svg" xlink:role="http://earthdata.nasa.gov/gibs/legend-type/vertical" format="image/svg+xml" width="135" height="288"/>
            </Style>
            <Format>image/jpeg</Format>
        </Layer>
        <Layer>
            <ows:Title>Without Legend</ows:Title>
            <ows:Identifier>WithoutLegend</ows:Identifier>
            <Style isDefault="true">
                <ows:Identifier>default</ows:Identifier>
            </Style>
            <Format>image/jpeg</Format>
        </Layer>
    </Contents>
</Capabilities>`

    let originalFetch: typeof fetch

    beforeEach(() => {
        originalFetch = window.fetch
        window.fetch = (async () =>
            new Response(CAPABILITIES_XML, { status: 200 })) as typeof fetch
    })

    afterEach(() => {
        window.fetch = originalFetch
    })

    it('should read both the horizontal and vertical legend URLs for a layer that has them', async () => {
        const legends = await getGibsLegendUrls('EPSG:3857', 'WithLegend')

        expect(legends).to.deep.equal({
            horizontal: 'https://example.com/legend-h.svg',
            vertical: 'https://example.com/legend-v.svg',
        })
    })

    it('should resolve to undefined for a layer whose style has no LegendURL', async () => {
        const legends = await getGibsLegendUrls('EPSG:3857', 'WithoutLegend')

        expect(legends).to.be.undefined
    })

    it('should resolve to undefined for an unknown layer', async () => {
        const legends = await getGibsLegendUrls('EPSG:3857', 'NoSuchLayer')

        expect(legends).to.be.undefined
    })

    it('should expose the legend on the result of buildGibsLayer() without blocking it', async () => {
        const result = await buildGibsLayer({
            type: 'gibs',
            name: 'with-legend',
            layer: 'WithLegend',
        })

        expect(result.legend).to.be.instanceOf(Promise)
        const legends = await result.legend
        expect(legends).to.deep.equal({
            horizontal: 'https://example.com/legend-h.svg',
            vertical: 'https://example.com/legend-v.svg',
        })
    })
})
