import { expect } from '@open-wc/testing'
import ImageTile from 'ol/source/ImageTile.js'
import { BaseLayer } from '../base.layer.js'

describe('BaseLayer', () => {
    it('should create a TileLayer with an ImageTile source', () => {
        const layer = new BaseLayer()

        expect(layer.getSource()).to.be.instanceOf(ImageTile)
    })

    it('should point the source at the Esri World_Imagery layer', () => {
        const layer = new BaseLayer()
        const source = layer.getSource() as ImageTile

        const url = source.getKey()
        expect(url).to.include('server.arcgisonline.com')
        expect(url).to.include('World_Imagery')
    })

    it('should leave wrapX unset by default', () => {
        const layer = new BaseLayer()
        const source = layer.getSource() as ImageTile

        expect(source.getWrapX()).to.be.true
    })

    it('should propagate noWorldWrap to wrapX: false on the source', () => {
        const layer = new BaseLayer({ noWorldWrap: true })
        const source = layer.getSource() as ImageTile

        expect(source.getWrapX()).to.be.false
    })

    it('should provide non-empty attributions', () => {
        const layer = new BaseLayer()
        const source = layer.getSource() as ImageTile

        const attributions = source.getAttributions()
        expect(attributions).to.exist
        expect(attributions!({} as any)).to.not.be.empty
    })
})
