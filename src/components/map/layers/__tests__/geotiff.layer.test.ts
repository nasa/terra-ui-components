import { expect } from '@open-wc/testing'
import {
    buildStopsFromColors,
    computeMinMax,
    parseGdalMetadataXml,
} from '../geotiff.layer.js'

// NOTE: `buildGeoTiffLayer()` and `buildColorStops()` (the parts that import
// `ol/source/GeoTIFF.js` and the `colormap` package) aren't covered here.
// Both are CJS/Node-oriented packages that web-test-runner's unbundled dev
// server can't load as plain ESM - a pre-existing constraint (the same
// `ol/source/GeoTIFF` + `colormap` usage in `time-average-map.component.ts`
// has never had test coverage either); a bundled build (`npm run build`)
// resolves both correctly. The data-range and stop/legend math - the part
// that was actually untested before this change - is extracted as pure
// functions so it can be verified directly, independent of those imports.
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
