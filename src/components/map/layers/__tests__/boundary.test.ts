import { expect } from '@open-wc/testing'
import Feature from 'ol/Feature.js'
import { Polygon } from 'ol/geom.js'
import type { Stroke, Style } from 'ol/style.js'
import { BOUNDARY_COLORS, buildExtentFeature, getBoundaryStyle } from '../boundary.js'

function strokeColor(style: Style) {
    return (style.getStroke() as Stroke).getColor()
}

describe('getBoundaryStyle', () => {
    it('cycles through the 5-color palette by index', () => {
        BOUNDARY_COLORS.forEach((color, index) => {
            const style = getBoundaryStyle(index)
            const [r, g, b] = color
            expect(strokeColor(style)).to.equal(`rgba(${r}, ${g}, ${b}, 1)`)
        })
    })

    it('wraps around the palette for indices beyond its length', () => {
        const first = getBoundaryStyle(0)
        const wrapped = getBoundaryStyle(BOUNDARY_COLORS.length)

        expect(strokeColor(wrapped)).to.equal(strokeColor(first))
    })

    it('defaults to the "normal" variant: solid stroke, width 2, no fill', () => {
        const style = getBoundaryStyle(0)

        expect((style.getStroke() as Stroke).getWidth()).to.equal(2)
        expect(style.getFill()).to.not.exist
    })

    it('"deemphasized" is a thinner, translucent version of the same indexed color', () => {
        const normal = getBoundaryStyle(1, 'normal')
        const deemphasized = getBoundaryStyle(1, 'deemphasized')

        expect((deemphasized.getStroke() as Stroke).getWidth()).to.equal(1)
        expect(strokeColor(deemphasized)).to.equal('rgba(52, 152, 219, 0.5)')
        expect(strokeColor(deemphasized)).to.not.equal(strokeColor(normal))
    })

    it('"highlighted" is a thick stroke (still indexed) plus a translucent green fill, regardless of index', () => {
        const styleA = getBoundaryStyle(0, 'highlighted')
        const styleB = getBoundaryStyle(3, 'highlighted')

        expect((styleA.getStroke() as Stroke).getWidth()).to.equal(4)
        expect(strokeColor(styleA)).to.equal('rgba(46, 204, 113, 1)')
        expect(strokeColor(styleB)).to.equal('rgba(231, 76, 60, 1)')
        expect(styleA.getFill()?.getColor()).to.equal('rgba(46, 204, 113, 0.2)')
        expect(styleB.getFill()?.getColor()).to.equal('rgba(46, 204, 113, 0.2)')
    })

    it('"background" is always gray, width 1, regardless of index', () => {
        const styleA = getBoundaryStyle(0, 'background')
        const styleB = getBoundaryStyle(4, 'background')

        expect(strokeColor(styleA)).to.equal('rgba(128, 128, 128, 0.6)')
        expect(strokeColor(styleB)).to.equal('rgba(128, 128, 128, 0.6)')
        expect((styleA.getStroke() as Stroke).getWidth()).to.equal(1)
    })
})

describe('buildExtentFeature', () => {
    it('builds a Feature with Polygon geometry', () => {
        const feature = buildExtentFeature([0, 0, 10, 10], 'EPSG:4326')

        expect(feature).to.be.instanceOf(Feature)
        expect(feature.getGeometry()).to.be.instanceOf(Polygon)
    })

    it('creates a closed ring of 5 coordinates', () => {
        const feature = buildExtentFeature([0, 0, 10, 10], 'EPSG:4326')
        const coords = (feature.getGeometry() as Polygon).getCoordinates()[0]

        expect(coords.length).to.equal(5)
        expect(coords[0]).to.deep.equal(coords[coords.length - 1])
    })

    it('reprojects from extentProjection (default EPSG:4326) into viewProjection', () => {
        const feature = buildExtentFeature(
            [-10, -10, 10, 10],
            'EPSG:3857',
            'EPSG:4326'
        )
        const coords = (feature.getGeometry() as Polygon).getCoordinates()[0]

        // EPSG:3857 coordinates are meters, not degrees - should not equal
        // the raw EPSG:4326 input
        expect(coords[0][0]).to.not.equal(-10)
    })

    it('leaves coordinates unreprojected when extentProjection matches viewProjection', () => {
        const feature = buildExtentFeature([0, 0, 10, 10], 'EPSG:4326', 'EPSG:4326')
        const coords = (feature.getGeometry() as Polygon).getCoordinates()[0]

        expect(coords[0]).to.deep.equal([0, 0])
        expect(coords[2]).to.deep.equal([10, 10])
    })
})
