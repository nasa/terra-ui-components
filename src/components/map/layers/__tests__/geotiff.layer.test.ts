import { expect } from '@open-wc/testing'
import WebGLTileLayer from 'ol/layer/WebGLTile.js'
import {
    buildGeoTiffLayer,
    buildStopsFromColors,
    computeMinMax,
    type GeoTiffLayerInfo,
    parseGdalMetadataXml,
    updateGeoTiffStyle,
} from '../geotiff.layer.js'

describe('computeMinMax', () => {
    it('returns the min and max of the given pixel values', () => {
        expect(computeMinMax([3, 1, 4, 1, 5, 9, 2, 6], undefined)).to.deep.equal({
            min: 1,
            max: 9,
        })
    })

    it('excludes pixels equal to the no-data value', () => {
        expect(computeMinMax([1, 2, 99, 3, 4], 99)).to.deep.equal({
            min: 1,
            max: 4,
        })
    })

    it('excludes NaN pixels', () => {
        expect(computeMinMax([1, NaN, 2, NaN, 3], undefined)).to.deep.equal({
            min: 1,
            max: 3,
        })
    })

    it('returns Infinity/-Infinity when every pixel is no-data or NaN', () => {
        expect(computeMinMax([5, 5, 5], 5)).to.deep.equal({
            min: Infinity,
            max: -Infinity,
        })
    })
})

describe('buildStopsFromColors', () => {
    const colors = [
        [0, 0, 0, 255],
        [64, 64, 64, 255],
        [128, 128, 128, 255],
        [255, 255, 255, 255],
    ]

    it('builds one [value, color] pair per color, spanning min to max', () => {
        const { stops } = buildStopsFromColors(colors, 0, 9)

        expect(stops).to.have.lengthOf(8) // 4 colors * (value + color)
        expect(stops[0]).to.equal(0) // first stop value is min
        expect(stops[1]).to.deep.equal(colors[0])
        expect(stops[6]).to.equal(9) // last stop value is max
        expect(stops[7]).to.deep.equal(colors[3])
    })

    it('evenly spaces intermediate stop values between min and max', () => {
        const { stops } = buildStopsFromColors(colors, 0, 9)

        expect(stops[2]).to.equal(3) // 0 + 1 * (9-0)/3
        expect(stops[4]).to.equal(6) // 0 + 2 * (9-0)/3
    })

    it('builds legend entries only within the [min, max] range, highest first', () => {
        const { legendValues } = buildStopsFromColors(colors, 0, 9)

        expect(legendValues).to.have.lengthOf(3) // excludes the min-value color (loop starts at length-1, stops before 0)
        expect(legendValues[0].rgb).to.deep.equal(colors[3])
        for (const entry of legendValues) {
            expect(entry).to.have.keys(['value', 'rgb'])
            expect(parseFloat(entry.value)).to.be.within(0, 9)
        }
    })
})

describe('parseGdalMetadataXml', () => {
    it('parses XML items into key-value pairs', () => {
        const xml = `
            <GDALMetadata>
                <Item name="units">m/s</Item>
                <Item name="long_name">Surface Wind Speed</Item>
            </GDALMetadata>
        `
        expect(parseGdalMetadataXml(xml)).to.deep.equal({
            units: 'm/s',
            long_name: 'Surface Wind Speed',
        })
    })

    it('returns an empty object for null, undefined, or empty string', () => {
        expect(parseGdalMetadataXml(null)).to.deep.equal({})
        expect(parseGdalMetadataXml(undefined)).to.deep.equal({})
        expect(parseGdalMetadataXml('')).to.deep.equal({})
    })

    it('returns an empty object for invalid XML', () => {
        expect(parseGdalMetadataXml('<invalid xml')).to.deep.equal({})
    })
})

describe('updateGeoTiffStyle', () => {
    it('updates layer style, colorStops, and legendValues with specified config', async () => {
        const layer = new WebGLTileLayer()
        const initialInfo: GeoTiffLayerInfo = {
            layer,
            projection: 'EPSG:4326',
            min: 0,
            max: 100,
            colorStops: [],
            legendValues: [],
            noDataValue: -9999,
        }

        const updated = await updateGeoTiffStyle(initialInfo, {
            colorMapName: 'jet',
            colorSteps: 10,
            reverseColors: false,
        })

        expect(updated.colorStops).to.have.lengthOf(20) // 10 steps * 2 (value + rgba)
        expect(updated.colorStops[0]).to.equal(0)
        expect(updated.colorStops[18]).to.equal(100)
        expect(updated.legendValues.length).to.be.greaterThan(0)
        expect(layer.get('info')).to.equal(updated)
    })

    it('reverses colors when reverseColors is true', async () => {
        const layer = new WebGLTileLayer()
        const initialInfo: GeoTiffLayerInfo = {
            layer,
            projection: 'EPSG:4326',
            min: 0,
            max: 100,
            colorStops: [],
            legendValues: [],
            noDataValue: undefined,
        }

        const normal = await updateGeoTiffStyle(initialInfo, {
            colorMapName: 'jet',
            colorSteps: 10,
            reverseColors: false,
        })

        const reversed = await updateGeoTiffStyle(initialInfo, {
            colorMapName: 'jet',
            colorSteps: 10,
            reverseColors: true,
        })

        // The first stop color of normal should match the last stop color of reversed
        expect(normal.colorStops[1]).to.deep.equal(reversed.colorStops[19])
        expect(normal.colorStops[19]).to.deep.equal(reversed.colorStops[1])
    })

    it('falls back to default viridis with 72 steps when config options are omitted', async () => {
        const layer = new WebGLTileLayer()
        const initialInfo: GeoTiffLayerInfo = {
            layer,
            projection: 'EPSG:4326',
            min: 10,
            max: 50,
            colorStops: [],
            legendValues: [],
            noDataValue: undefined,
        }

        const updated = await updateGeoTiffStyle(initialInfo, {})
        expect(updated.colorStops).to.have.lengthOf(72 * 2)
        expect(updated.colorStops[0]).to.equal(10)
        expect(updated.colorStops[72 * 2 - 2]).to.equal(50)
    })
})

describe('buildGeoTiffLayer', () => {
    it('attempts to instantiate an OpenLayers GeoTIFF source and rejects on missing file', async () => {
        let error: Error | null = null
        try {
            await buildGeoTiffLayer({
                name: 'A Really Cool Base Layer',
                type: 'geotiff',
                url: '/non-existent.tif',
            })
        } catch (e) {
            error = e as Error
        }
        expect(error).to.be.an.instanceOf(Error)
    })
})
