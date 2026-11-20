import { expect } from '@open-wc/testing'
import type XYZ from 'ol/source/XYZ.js'
import sinon from 'sinon'
import { getYesterdayIsoDate } from '../../../../utilities/date.js'
import { buildBaseLayer, buildDefaultBaseLayers } from '../base.layer.js'

describe('base.layer', () => {
    afterEach(() => {
        sinon.restore()
    })
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
                name: 'true-color',
                title: 'Corrected Reflectance (True Color)',
                type: 'base',
                visible: false,
            },
            {
                name: 'land-water',
                title: 'Land / Water Map',
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

    it('passes noWorldWrap through to the underlying tile source', () => {
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

        const wrappedSource = wrappedLayer.getSource() as XYZ
        const unwrappedSource = unwrappedLayer.getSource() as XYZ

        expect(wrappedSource.getWrapX()).to.be.true
        expect(unwrappedSource.getWrapX()).to.be.false
    })

    it('falls back to fallbackUrl and warns once when tileloaderror fires', () => {
        const warnStub = sinon.stub(console, 'warn')
        const layer = buildBaseLayer({
            name: 'true-color',
            title: 'Corrected Reflectance (True Color)',
            url: 'https://example.com/2026-11-19/{z}/{y}/{x}.jpg',
            fallbackUrl: 'https://example.com/default/{z}/{y}/{x}.jpg',
        })
        const source = layer.getSource() as XYZ
        const setUrlSpy = sinon.spy(source, 'setUrl')

        source.dispatchEvent('tileloaderror')
        source.dispatchEvent('tileloaderror')

        expect(
            setUrlSpy.calledOnceWithExactly(
                'https://example.com/default/{z}/{y}/{x}.jpg'
            )
        ).to.be.true
        expect(warnStub.calledOnce).to.be.true
    })

    it('uses VIIRS_NOAA20 and falls back to default date on tileloaderror for true-color', () => {
        const warnStub = sinon.stub(console, 'warn')
        const layers = buildDefaultBaseLayers({})
        const trueColorLayer = layers.find(l => l.get('name') === 'true-color')
        const source = trueColorLayer?.getSource() as XYZ
        const setUrlSpy = sinon.spy(source, 'setUrl')
        const yesterday = getYesterdayIsoDate()

        expect(source.getUrls()?.[0]).to.include(
            'VIIRS_NOAA20_CorrectedReflectance_TrueColor'
        )
        expect(source.getUrls()?.[0]).to.include(`/${yesterday}/`)

        source.dispatchEvent('tileloaderror')

        expect(setUrlSpy.calledOnce).to.be.true
        expect(source.getUrls()?.[0]).to.include('/default/default/')
        expect(warnStub.calledOnce).to.be.true
    })
})
