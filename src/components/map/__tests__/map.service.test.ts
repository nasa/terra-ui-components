import { expect } from '@open-wc/testing'
import { MapService } from '../map.service.js'
import sinon, { type SinonSpy } from 'sinon'
import { LatLng } from '../models/LatLng.js'
import { LatLngBounds } from '../models/LatLngBounds.js'
import { Map, View } from 'ol'
import { DrawToolbarControl } from '../controls/draw-toolbar.control.js'
import { Layer } from 'ol/layer.js'
import VectorLayer from 'ol/layer/Vector.js'
import VectorSource from 'ol/source/Vector.js'
import Draw from 'ol/interaction/Draw.js'
import Collection from 'ol/Collection.js'

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
        const setOptionsSpy = sinon.spy(DrawToolbarControl.prototype, 'setOptions')

        service.updateDrawToolbarVisibility({
            showBoundingBoxSelection: true,
            showPolygonSelection: false,
            showPointSelection: true,
            showCircleSelection: false,
        })

        expect(setOptionsSpy.calledOnce).to.be.true
        expect(
            setOptionsSpy.calledWith({
                showBboxTool: true,
                showPolygonTool: false,
                showPointTool: true,
                showCircleTool: false,
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
        it('inserts a custom layer below the borders layer by default', () => {
            // the map is created with 6 built-in layers (base, borders,
            // labels, graticule, shapes, draw), with borders at index 1
            const insertAtSpy = sinon.spy(Collection.prototype, 'insertAt')
            const customLayer = new VectorLayer({ source: new VectorSource() })

            service.addLayer(customLayer, { name: 'custom' })

            expect(insertAtSpy.calledWith(1, customLayer)).to.be.true
        })

        it('inserts a custom layer above everything when position is "top"', () => {
            const insertAtSpy = sinon.spy(Collection.prototype, 'insertAt')
            const customLayer = new VectorLayer({ source: new VectorSource() })

            service.addLayer(customLayer, { name: 'custom-top', position: 'top' })

            // 6 built-in layers occupy indices 0-5, so pushing onto the end
            // inserts at index 6
            expect(insertAtSpy.calledWith(6, customLayer)).to.be.true
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

        const addSpy = sinon.spy(Map.prototype, 'addInteraction')
        const removeSpy = sinon.spy(Map.prototype, 'removeInteraction')

        service.addInteraction(draw)
        service.removeInteraction(draw)

        expect(addSpy.calledWith(draw)).to.be.true
        expect(removeSpy.calledWith(draw)).to.be.true
    })

    it('returns the map size and canvas/svg elements', () => {
        expect(service.getSize()).to.exist
        expect(service.getCanvasElements()).to.have.keys(['canvases', 'svgs'])
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
})
