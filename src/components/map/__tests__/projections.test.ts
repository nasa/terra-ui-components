import { expect } from '@open-wc/testing'
import { get as getProjection } from 'ol/proj.js'
import '../projections.js'

describe('projections', () => {
    it('should register EPSG:3413 (Arctic Polar Stereographic) with OpenLayers', () => {
        expect(getProjection('EPSG:3413')).to.exist
    })

    it('should register EPSG:3031 (Antarctic Polar Stereographic) with OpenLayers', () => {
        expect(getProjection('EPSG:3031')).to.exist
    })

    it('should set a world extent on EPSG:3413, matching GIBS/NASA\'s examples', () => {
        expect(getProjection('EPSG:3413')!.getExtent()).to.deep.equal([
            -4194304, -4194304, 4194304, 4194304,
        ])
    })

    it('should set a world extent on EPSG:3031, matching GIBS/NASA\'s examples', () => {
        expect(getProjection('EPSG:3031')!.getExtent()).to.deep.equal([
            -4194304, -4194304, 4194304, 4194304,
        ])
    })
})
