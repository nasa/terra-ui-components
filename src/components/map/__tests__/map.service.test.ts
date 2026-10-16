import { expect } from '@open-wc/testing'
import { MapService } from '../map.service.js'
import sinon, { type SinonSpy } from 'sinon'
import { LatLng } from '../models/LatLng.js'
import { LatLngBounds } from '../models/LatLngBounds.js'
import { Map as OlMap, View } from 'ol'
import { DrawToolbarControl } from '../controls/draw-toolbar.control.js'
import { LayerPickerControl } from '../controls/layer-picker.control.js'
import { Layer } from 'ol/layer.js'
import VectorLayer from 'ol/layer/Vector.js'
import VectorSource from 'ol/source/Vector.js'
import Draw from 'ol/interaction/Draw.js'
import Collection from 'ol/Collection.js'
import GeoJSON from 'ol/format/GeoJSON.js'
import type { Projection } from 'ol/proj.js'

describe('Map Service', () => {
    let el: HTMLElement
    let service: MapService
    let onMouseMove: SinonSpy
    let onDraw: SinonSpy

    beforeEach(() => {
        el = document.createElement('div')
        el.style.width = '100px'
        el.style.height = '100px'
        document.body.appendChild(el)

        onMouseMove = sinon.spy()
        onDraw = sinon.spy()

        service = new MapService(el, {
            onMouseMove,
            onDraw,
        })
    })

    afterEach(() => {
        sinon.restore()
        document.body.innerHTML = ''
    })

    describe('parseLocationString', () => {
        it('parses point coordinates', () => {
            const result = service.parseLocationString('40.7128, -74.006')

            expect(result).to.be.instanceOf(LatLng)
            expect((result as LatLng).lat).to.equal(40.7128)
            expect((result as LatLng).lng).to.equal(-74.006)
        })

        it('parses bounding box coordinates', () => {
            const result = service.parseLocationString('1, 2, 3, 4')

            expect(result).to.be.instanceOf(LatLngBounds)
            expect((result as LatLngBounds).getWest()).to.equal(1)
            expect((result as LatLngBounds).getSouth()).to.equal(2)
            expect((result as LatLngBounds).getEast()).to.equal(3)
            expect((result as LatLngBounds).getNorth()).to.equal(4)
        })

        it('throws a BadRequestException for invalid input length', () => {
            expect(() => service.parseLocationString('1,2,3')).to.throw(
                'Failed to parse location string. Location must be in format: `lat,lng` for a point or `west,south,east,north` for a bounding box'
            )
        })
    })

    it('sets the zoom level on the map view', () => {
        const setZoomSpy = sinon.spy(View.prototype, 'setZoom')

        service.setZoom(6)

        expect(setZoomSpy.calledOnce).to.be.true
        expect(setZoomSpy.calledWith(6)).to.be.true
    })

    it('sets a LatLng value on the draw toolbar control', () => {
        const setValueSpy = sinon.spy(DrawToolbarControl.prototype, 'setValue')

        service.setValue('40.7128, -74.006')

        expect(setValueSpy.calledOnce).to.be.true
        expect(setValueSpy.calledWith(sinon.match.instanceOf(LatLng))).to.be.true
    })

    it('sets a LatLngBounds value on the draw toolbar control', () => {
        const setValueSpy = sinon.spy(DrawToolbarControl.prototype, 'setValue')

        service.setValue('12, 13, 14, 15')

        expect(setValueSpy.calledOnce).to.be.true
        expect(setValueSpy.calledWith(sinon.match.instanceOf(LatLngBounds))).to.be
            .true
    })

    it('updates the draw toolbar visibility', () => {
        const setDrawOptionsSpy = sinon.spy(
            DrawToolbarControl.prototype,
            'setOptions'
        )
        const setLayerOptionsSpy = sinon.spy(
            LayerPickerControl.prototype,
            'setOptions'
        )

        service.updateDrawToolbarVisibility({
            showBoundingBoxSelection: true,
            showPolygonSelection: false,
            showPointSelection: true,
            showCircleSelection: false,
            showLayerPicker: true,
        })

        expect(setDrawOptionsSpy.calledOnce).to.be.true
        expect(
            setDrawOptionsSpy.calledWith({
                showBboxTool: true,
                showPolygonTool: false,
                showPointTool: true,
                showCircleTool: false,
            })
        ).to.be.true

        expect(setLayerOptionsSpy.calledOnce).to.be.true
        expect(
            setLayerOptionsSpy.calledWith({
                showLayerPicker: true,
            })
        ).to.be.true
    })

    it('toggles the layer visibility', () => {
        const setVisibleSpy = sinon.spy(Layer.prototype, 'setVisible')

        service.toggleLayerVisibility('graticule', true)

        expect(setVisibleSpy.calledOnce).to.be.true
        expect(setVisibleSpy.calledWith(true)).to.be.true
    })

    it('does nothing when layer name does not exist', () => {
        const setVisibleSpy = sinon.spy(Layer.prototype, 'setVisible')

        service.toggleLayerVisibility('nonexistent', true)

        expect(setVisibleSpy.called).to.be.false
    })

    it('hides a layer', () => {
        const setVisibleSpy = sinon.spy(Layer.prototype, 'setVisible')

        service.toggleLayerVisibility('graticule', false)

        expect(setVisibleSpy.calledWith(false)).to.be.true
    })

    it.skip('calls onMouseMove when pointer moves', () => {
        // TODO
    })

    describe('addLayer / removeLayer / getLayer', () => {
        it('inserts a custom layer below the borders layer by default and stamps metadata', () => {
            // the map is created with 8 built-in layers (base, osm, topo,
            // borders, labels, graticule, shapes, draw), with borders at index 3
            const insertAtSpy = sinon.spy(Collection.prototype, 'insertAt')
            const customLayer = new VectorLayer({ source: new VectorSource() })

            service.addLayer(customLayer, { name: 'custom', title: 'Custom Layer' })

            expect(insertAtSpy.calledWith(3, customLayer)).to.be.true
            expect(customLayer.get('name')).to.equal('custom')
            expect(customLayer.get('title')).to.equal('Custom Layer')
            expect(customLayer.get('type')).to.equal('overlay')
        })

        it('inserts a custom layer above everything when position is "top"', () => {
            const insertAtSpy = sinon.spy(Collection.prototype, 'insertAt')
            const customLayer = new VectorLayer({ source: new VectorSource() })

            service.addLayer(customLayer, { name: 'custom-top', position: 'top' })

            // 8 built-in layers occupy indices 0-7, so pushing onto the end
            // inserts at index 8
            expect(insertAtSpy.calledWith(8, customLayer)).to.be.true
        })

        it('finds a named layer with getLayer', () => {
            const customLayer = new VectorLayer({ source: new VectorSource() })
            service.addLayer(customLayer, { name: 'custom' })

            expect(service.getLayer('custom')).to.equal(customLayer)
            expect(service.getLayer('nonexistent')).to.be.undefined
        })

        it('removes a named layer', () => {
            const customLayer = new VectorLayer({ source: new VectorSource() })
            service.addLayer(customLayer, { name: 'custom' })

            service.removeLayer('custom')

            expect(service.getLayer('custom')).to.be.undefined
        })
    })

    it('fits the view to a reprojected extent', () => {
        const fitSpy = sinon.spy(View.prototype, 'fit')

        service.fitToExtent([-74, 40, -73, 41], { projection: 'EPSG:4326' })

        expect(fitSpy.calledOnce).to.be.true
    })

    it('adds and removes an interaction', () => {
        const draw = new Draw({
            source: new VectorSource(),
            type: 'Point',
        })

        const addSpy = sinon.spy(OlMap.prototype, 'addInteraction')
        const removeSpy = sinon.spy(OlMap.prototype, 'removeInteraction')

        service.addInteraction(draw)
        service.removeInteraction(draw)

        expect(addSpy.calledWith(draw)).to.be.true
        expect(removeSpy.calledWith(draw)).to.be.true
    })

    it('returns the map size and canvas/svg elements', () => {
        expect(service.getSize()).to.exist
        expect(service.getCanvasElements()).to.have.keys(['canvases', 'svgs'])
    })

    it('delegates getFeaturesAtPixel to the underlying map', () => {
        const getFeaturesAtPixelSpy = sinon.spy(OlMap.prototype, 'getFeaturesAtPixel')

        service.getFeaturesAtPixel([10, 10])

        expect(getFeaturesAtPixelSpy.calledWith([10, 10])).to.be.true
    })

    it.skip('dispatches onDraw for bbox geometry', () => {
        // TODO
    })

    it.skip('dispatches onDraw for point geometry', () => {
        // TODO
    })

    it.skip('dispatches onDraw for circle geometry', () => {
        // TODO
    })

    it.skip('dispatches onDraw for polygon geometry', () => {
        // TODO
    })

    describe('projection', () => {
        it('defaults the view to EPSG:3857', () => {
            expect(service.getView().getProjection().getCode()).to.equal('EPSG:3857')
        })

        it('uses the configured projection for the view', () => {
            const el2 = document.createElement('div')
            document.body.appendChild(el2)
            const polarService = new MapService(el2, {
                projection: 'EPSG:4326',
                onMouseMove: sinon.spy(),
                onDraw: sinon.spy(),
            })

            expect(polarService.getView().getProjection().getCode()).to.equal(
                'EPSG:4326'
            )
        })

        it('builds the view with noWorldWrap on a non-EPSG:3857 projection without throwing', () => {
            const el2 = document.createElement('div')
            document.body.appendChild(el2)

            expect(
                () =>
                    new MapService(el2, {
                        projection: 'EPSG:4326',
                        noWorldWrap: true,
                        onMouseMove: sinon.spy(),
                        onDraw: sinon.spy(),
                    })
            ).to.not.throw()
        })

        it('reprojects a loaded shape into the configured view projection, not a hardcoded EPSG:3857', async () => {
            const el2 = document.createElement('div')
            document.body.appendChild(el2)
            const readFeaturesSpy = sinon.spy(GeoJSON.prototype, 'readFeatures')
            const polarService = new MapService(el2, {
                projection: 'EPSG:4326',
                onMouseMove: sinon.spy(),
                onDraw: sinon.spy(),
                getGeoJson: async () => ({
                    type: 'FeatureCollection',
                    features: [
                        {
                            type: 'Feature',
                            properties: {},
                            geometry: { type: 'Point', coordinates: [10, 20] },
                        },
                    ],
                }),
            })

            await polarService.handleShapeSelect({
                target: { value: 'some-shape', options: [], selectedIndex: 0 },
            } as unknown as Event)

            expect(
                readFeaturesSpy.calledWith(
                    sinon.match.any,
                    sinon.match({ featureProjection: sinon.match.has('getCode') })
                )
            ).to.be.true
            const featureProjection = readFeaturesSpy.firstCall?.args[1]
                ?.featureProjection as Projection
            expect(featureProjection.getCode()).to.equal('EPSG:4326')
        })
    })
})
