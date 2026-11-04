import { expect } from '@open-wc/testing'
import ImageTile from 'ol/source/ImageTile.js'
import { XYZLayer } from '../xyz.layer.js'

describe('XYZLayer', () => {
    it('should create a TileLayer with an ImageTile source', () => {
        const layer = new XYZLayer({
            urlTemplate: 'https://example.com/{z}/{y}/{x}.png',
        })

        expect(layer.getSource()).to.be.instanceOf(ImageTile)
    })

    it('should point the source at the given URL template', () => {
        const layer = new XYZLayer({
            urlTemplate: 'https://example.com/tiles/{z}/{y}/{x}.png',
        })
        const source = layer.getSource() as ImageTile

        expect(source.getKey()).to.include('example.com/tiles')
    })

    it('should leave wrapX unset by default', () => {
        const layer = new XYZLayer({
            urlTemplate: 'https://example.com/{z}/{y}/{x}.png',
        })
        const source = layer.getSource() as ImageTile

        expect(source.getWrapX()).to.be.true
    })

    it('should propagate noWorldWrap to wrapX: false on the source', () => {
        const layer = new XYZLayer({
            urlTemplate: 'https://example.com/{z}/{y}/{x}.png',
            noWorldWrap: true,
        })
        const source = layer.getSource() as ImageTile

        expect(source.getWrapX()).to.be.false
    })

    it('should pass attributions through to the source', () => {
        const layer = new XYZLayer({
            urlTemplate: 'https://example.com/{z}/{y}/{x}.png',
            attributions: ['Example Attribution'],
        })
        const source = layer.getSource() as ImageTile

        const attributions = source.getAttributions()
        expect(attributions).to.exist
        expect(attributions!({} as any)).to.include('Example Attribution')
    })

    it('should leave the layer extent unset when no extent option is given', () => {
        const layer = new XYZLayer({
            urlTemplate: 'https://example.com/{z}/{y}/{x}.png',
        })

        expect(layer.getExtent()).to.be.undefined
    })

    it('should reproject an EPSG:4326 extent to the view projection (EPSG:3857) by default', () => {
        const layer = new XYZLayer({
            urlTemplate: 'https://example.com/{z}/{y}/{x}.png',
            extent: [-10, -10, 10, 10],
        })

        const extent = layer.getExtent()!
        expect(extent).to.exist
        // EPSG:4326 (-10,-10) -> EPSG:3857 is not (-10,-10); confirm it was actually transformed
        expect(extent[0]).to.not.equal(-10)
        expect(extent[1]).to.not.equal(-10)
    })

    it('should reproject the extent from a custom extentProjection', () => {
        const layer = new XYZLayer({
            urlTemplate: 'https://example.com/{z}/{y}/{x}.png',
            extent: [-1113195, -1118890, 1113195, 1118890], // EPSG:3857 extent around the origin
            extentProjection: 'EPSG:3857',
        })

        const extent = layer.getExtent()!
        expect(extent).to.exist
        // reprojecting EPSG:3857 -> EPSG:3857 is a no-op, so the extent should be unchanged
        expect(extent[0]).to.be.closeTo(-1113195, 1)
        expect(extent[2]).to.be.closeTo(1113195, 1)
    })
})
