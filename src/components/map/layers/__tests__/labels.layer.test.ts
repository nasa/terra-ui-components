import { expect } from '@open-wc/testing'
import VectorTileSource from 'ol/source/VectorTile.js'
import { LabelsLayer } from '../labels.layer.js'

describe('LabelsLayer', () => {
    it('should create a VectorTileLayer with a VectorTileSource', () => {
        const layer = new LabelsLayer()

        expect(layer.getSource()).to.be.instanceOf(VectorTileSource)
    })

    it('should point the source at the Esri World_Basemap_v2 vector tile service', () => {
        const layer = new LabelsLayer()
        const source = layer.getSource() as VectorTileSource

        const urls = source.getUrls() ?? []
        expect(urls[0]).to.include('basemaps.arcgis.com')
        expect(urls[0]).to.include('World_Basemap_v2')
    })

    it('should leave wrapX unset by default', () => {
        const layer = new LabelsLayer()
        const source = layer.getSource() as VectorTileSource

        expect(source.getWrapX()).to.be.true
    })

    it('should propagate noWorldWrap to wrapX: false on the source', () => {
        const layer = new LabelsLayer({ noWorldWrap: true })
        const source = layer.getSource() as VectorTileSource

        expect(source.getWrapX()).to.be.false
    })

    it('should provide non-empty attributions', () => {
        const layer = new LabelsLayer()
        const source = layer.getSource() as VectorTileSource

        const attributions = source.getAttributions()
        expect(attributions).to.exist
        expect(attributions!({} as any)).to.not.be.empty
    })

    it('should apply a style function derived from the labels style config', () => {
        const layer = new LabelsLayer()

        expect(layer.getStyleFunction()).to.exist
    })
})
