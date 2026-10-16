import { expect } from '@open-wc/testing'
import type ImageTile from 'ol/source/ImageTile.js'
import { buildBaseLayer, buildDefaultBaseLayers } from '../base.layer.js'

describe('base.layer', () => {
    it('builds the default base layers with World Imagery visible and alternatives hidden', () => {
        const layers = buildDefaultBaseLayers({})

        expect(
            layers.map(layer => ({
                name: layer.get('name'),
                title: layer.get('title'),
                type: layer.get('type'),
                visible: layer.getVisible(),
            }))
        ).to.deep.equal([
            {
                name: 'base',
                title: 'World Imagery',
                type: 'base',
                visible: true,
            },
            {
                name: 'osm',
                title: 'OpenStreetMap',
                type: 'base',
                visible: false,
            },
            {
                name: 'topo',
                title: 'Topographic',
                type: 'base',
                visible: false,
            },
        ])
    })

    it('passes noWorldWrap through to the underlying ImageTile source', () => {
        const wrappedLayer = buildBaseLayer({
            name: 'osm',
            title: 'OpenStreetMap',
            url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
            noWorldWrap: false,
        })
        const unwrappedLayer = buildBaseLayer({
            name: 'osm',
            title: 'OpenStreetMap',
            url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
            noWorldWrap: true,
        })

        const wrappedSource = wrappedLayer.getSource() as ImageTile
        const unwrappedSource = unwrappedLayer.getSource() as ImageTile

        expect(wrappedSource.getWrapX()).to.be.true
        expect(unwrappedSource.getWrapX()).to.be.false
    })
})
